const prisma = require("../lib/prisma");

const RETRYABLE_PRISMA_CODES = new Set(["P1001", "P1002", "P1017"]);
const PRODUCTS_CACHE_TTL_MS = 30 * 1000;

const productsCache = new Map();

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const isRetryablePrismaError = (error) =>
  RETRYABLE_PRISMA_CODES.has(String(error?.code || ""));

const getProductsCacheKey = ({ where, limit }) =>
  JSON.stringify({ where, limit });

const getCachedProducts = (cacheKey) => {
  const entry = productsCache.get(cacheKey);

  if (!entry) {
    return null;
  }

  const ageMs = Date.now() - entry.updatedAt;
  return {
    data: entry.data,
    ageMs,
    isFresh: ageMs < PRODUCTS_CACHE_TTL_MS,
  };
};

const setCachedProducts = (cacheKey, products) => {
  productsCache.set(cacheKey, {
    data: products,
    updatedAt: Date.now(),
  });
};

const findProductsWithRetry = async (args, maxRetries = 2) => {
  let lastError;

  for (let attempt = 0; attempt <= maxRetries; attempt += 1) {
    try {
      return await prisma.product.findMany(args);
    } catch (error) {
      lastError = error;

      if (!isRetryablePrismaError(error) || attempt === maxRetries) {
        throw error;
      }

      const backoffMs = 200 * (attempt + 1);
      await sleep(backoffMs);
    }
  }

  throw lastError;
};

const toIntOrNull = (value) => {
  if (value === undefined || value === null || value === "") {
    return null;
  }

  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : null;
};

const toFloatOrNull = (value) => {
  if (value === undefined || value === null || value === "") {
    return null;
  }

  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const mapProductPayload = (payload) => {
  const title = String(payload.title || payload.name || "").trim();
  const inferredBrand = title ? title.split(" ")[0] : "";
  const modelName = String(payload.modelName || payload.model || title).trim();
  const priceInr = toIntOrNull(payload.priceInr ?? payload.price);

  return {
    title,
    brand: String(payload.brand || inferredBrand).trim(),
    modelName,
    category: String(payload.category || "smartphone").toLowerCase(),
    priceInr,
    launchedYear: toIntOrNull(payload.launchedYear),
    batteryMah: toIntOrNull(payload.batteryMah),
    ramGb: toIntOrNull(payload.ramGb),
    screenSizeInches: toFloatOrNull(payload.screenSizeInches),
    weightGrams: toFloatOrNull(payload.weightGrams),
    processor: payload.processor || null,
    frontCameraMp: toFloatOrNull(payload.frontCameraMp),
    backCameraMp: toFloatOrNull(payload.backCameraMp),
    specsText: payload.specsText || null,
    imageUrl: payload.imageUrl || payload.image || null,
    productUrl: payload.productUrl || payload.link || null,
    tags: Array.isArray(payload.tags) ? payload.tags : [],
    rating: toFloatOrNull(payload.rating) ?? 0,
    reviews: toIntOrNull(payload.reviews) ?? 0,
  };
};

const validatePayload = (payload) => {
  if (!payload.title || !payload.brand || !payload.modelName) {
    return "title, brand, and modelName are required fields";
  }

  if (!Number.isFinite(payload.priceInr) || payload.priceInr <= 0) {
    return "priceInr must be a positive integer";
  }

  return null;
};

// @desc    Get all products
// @route   GET /api/products
// @access  Public
exports.getProducts = async (req, res) => {
  let cacheKey = null;

  try {
    const limit = Math.min(
      Math.max(Number.parseInt(req.query.limit, 10) || 50, 1),
      200,
    );
    const where = {};

    if (req.query.category) {
      where.category = String(req.query.category).toLowerCase();
    }

    if (req.query.maxPriceInr) {
      const parsedMaxPrice = Number.parseInt(req.query.maxPriceInr, 10);

      if (Number.isFinite(parsedMaxPrice)) {
        where.priceInr = {
          lte: parsedMaxPrice,
        };
      }
    }

    cacheKey = getProductsCacheKey({ where, limit });
    const cachedProducts = getCachedProducts(cacheKey);

    if (cachedProducts?.isFresh) {
      return res.status(200).json({
        success: true,
        count: cachedProducts.data.length,
        data: cachedProducts.data,
      });
    }

    const products = await findProductsWithRetry(
      {
        where,
        orderBy: [{ priceInr: "asc" }, { rating: "desc" }],
        take: limit,
      },
      2,
    );

    setCachedProducts(cacheKey, products);

    return res
      .status(200)
      .json({ success: true, count: products.length, data: products });
  } catch (error) {
    if (isRetryablePrismaError(error)) {
      const staleProducts = cacheKey ? getCachedProducts(cacheKey) : null;

      if (staleProducts?.data?.length) {
        console.warn(
          `Transient DB connectivity issue (${error.code}). Serving stale products cache.`,
        );

        return res.status(200).json({
          success: true,
          count: staleProducts.data.length,
          data: staleProducts.data,
        });
      }

      console.warn(
        `Transient DB connectivity issue (${error.code}) in getProducts.`,
      );

      return res.status(503).json({
        success: false,
        error: "Database temporarily unavailable. Please retry shortly.",
      });
    }

    console.error(error);
    return res.status(500).json({ success: false, error: "Server Error" });
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
exports.getProduct = async (req, res) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: req.params.id },
    });

    if (!product) {
      return res
        .status(404)
        .json({ success: false, error: "Product not found" });
    }

    res.status(200).json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, error: "Server Error" });
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private (will require auth later)
exports.createProduct = async (req, res) => {
  try {
    const payload = mapProductPayload(req.body);
    const validationError = validatePayload(payload);

    if (validationError) {
      return res.status(400).json({ success: false, error: validationError });
    }

    const product = await prisma.product.create({
      data: payload,
    });

    res.status(201).json({ success: true, data: product });
  } catch (error) {
    if (error.code === "P2002") {
      return res.status(409).json({
        success: false,
        error: "Product with same brand and model already exists",
      });
    }

    console.error(error);
    res.status(500).json({ success: false, error: "Server Error" });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private
exports.updateProduct = async (req, res) => {
  try {
    const payload = mapProductPayload(req.body);
    const validationError = validatePayload(payload);

    if (validationError) {
      return res.status(400).json({ success: false, error: validationError });
    }

    const product = await prisma.product.update({
      where: { id: req.params.id },
      data: payload,
    });

    if (!product) {
      return res
        .status(404)
        .json({ success: false, error: "Product not found" });
    }

    res.status(200).json({ success: true, data: product });
  } catch (error) {
    if (error.code === "P2025") {
      return res
        .status(404)
        .json({ success: false, error: "Product not found" });
    }

    if (error.code === "P2002") {
      return res.status(409).json({
        success: false,
        error: "Product with same brand and model already exists",
      });
    }

    console.error(error);
    res.status(500).json({ success: false, error: "Server Error" });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private
exports.deleteProduct = async (req, res) => {
  try {
    const product = await prisma.product.delete({
      where: { id: req.params.id },
    });

    if (!product) {
      return res
        .status(404)
        .json({ success: false, error: "Product not found" });
    }

    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    if (error.code === "P2025") {
      return res
        .status(404)
        .json({ success: false, error: "Product not found" });
    }

    console.error(error);
    res.status(500).json({ success: false, error: "Server Error" });
  }
};
