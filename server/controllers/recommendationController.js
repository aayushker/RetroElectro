const axios = require("axios");
const prisma = require("../lib/prisma");
const {
  parseRecommendationQuery,
  clampTopK,
} = require("../utils/recommendationParser");

const EMBEDDING_SERVICE_URL =
  process.env.EMBEDDING_SERVICE_URL || "http://localhost:8000";

const PRODUCT_SELECT_SQL = `
  id,
  title,
  brand,
  model_name AS "modelName",
  category,
  price_inr AS "priceInr",
  launched_year AS "launchedYear",
  battery_mah AS "batteryMah",
  ram_gb AS "ramGb",
  screen_size_inches AS "screenSizeInches",
  weight_grams AS "weightGrams",
  processor,
  front_camera_mp AS "frontCameraMp",
  back_camera_mp AS "backCameraMp",
  specs_text AS "specsText",
  image_url AS "imageUrl",
  product_url AS "productUrl",
  tags,
  rating,
  reviews
`;

const toVectorLiteral = (embedding) =>
  `[${embedding.map((value) => Number(value).toFixed(8)).join(",")}]`;

const parseFilterNumber = (value) => {
  if (value === undefined || value === null || value === "") {
    return null;
  }

  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : null;
};

const buildWhereClause = (parsedQuery, filters, params) => {
  const whereParts = [];

  if (parsedQuery.category) {
    params.push(parsedQuery.category.toLowerCase());
    whereParts.push(`category = $${params.length}`);
  }

  const queryBudget = parseFilterNumber(parsedQuery.budgetInr);
  const bodyBudget = parseFilterNumber(filters.maxPriceInr);
  const effectiveBudget =
    queryBudget && bodyBudget
      ? Math.min(queryBudget, bodyBudget)
      : queryBudget || bodyBudget;

  if (effectiveBudget) {
    params.push(effectiveBudget);
    whereParts.push(`price_inr <= $${params.length}`);
  }

  const minBatteryMah = parseFilterNumber(filters.minBatteryMah);
  if (minBatteryMah) {
    params.push(minBatteryMah);
    whereParts.push(`battery_mah >= $${params.length}`);
  }

  const minRamGb = parseFilterNumber(filters.minRamGb);
  if (minRamGb) {
    params.push(minRamGb);
    whereParts.push(`ram_gb >= $${params.length}`);
  }

  const minLaunchedYear = parseFilterNumber(filters.minLaunchedYear);
  if (minLaunchedYear) {
    params.push(minLaunchedYear);
    whereParts.push(`launched_year >= $${params.length}`);
  }

  const brandFilter = String(filters.brand || "")
    .trim()
    .toLowerCase();
  if (brandFilter) {
    params.push(brandFilter);
    whereParts.push(`LOWER(brand) = $${params.length}`);
  } else if (parsedQuery.brands && parsedQuery.brands.length === 1) {
    params.push(parsedQuery.brands[0]);
    whereParts.push(`LOWER(brand) = $${params.length}`);
  }

  return whereParts.length ? `WHERE ${whereParts.join(" AND ")}` : "";
};

const getQueryEmbedding = async (rawQuery) => {
  const endpoint = `${EMBEDDING_SERVICE_URL.replace(/\/$/, "")}/embed`;

  try {
    const response = await axios.post(
      endpoint,
      {
        inputs: [`query: ${rawQuery}`],
        normalize: true,
      },
      {
        timeout: 25000,
      },
    );

    const embedding = response.data?.embeddings?.[0];
    if (!Array.isArray(embedding) || embedding.length === 0) {
      return null;
    }

    return embedding.map((value) => Number(value));
  } catch (error) {
    console.warn(
      "Embedding service unavailable, using SQL fallback ranking:",
      error.message,
    );
    return null;
  }
};

const fetchRankedProducts = async ({
  parsedQuery,
  filters,
  topK,
  queryEmbedding,
}) => {
  const params = [];
  const whereClause = buildWhereClause(parsedQuery, filters, params);

  if (queryEmbedding) {
    params.push(toVectorLiteral(queryEmbedding));
    const vectorParam = `$${params.length}::vector`;

    params.push(topK);
    const limitParam = `$${params.length}`;

    const sql = `
      SELECT
        ${PRODUCT_SELECT_SQL},
        COALESCE((1 - (embedding <=> ${vectorParam})), 0)::double precision AS score
      FROM products
      ${whereClause}
      ORDER BY score DESC, price_inr ASC
      LIMIT ${limitParam}
    `;

    return prisma.$queryRawUnsafe(sql, ...params);
  }

  params.push(topK);
  const limitParam = `$${params.length}`;
  const sql = `
    SELECT
      ${PRODUCT_SELECT_SQL},
      0::double precision AS score
    FROM products
    ${whereClause}
    ORDER BY price_inr ASC, battery_mah DESC NULLS LAST
    LIMIT ${limitParam}
  `;

  return prisma.$queryRawUnsafe(sql, ...params);
};

const applyFeatureBoosts = (products, features) => {
  if (!features || features.length === 0) {
    return products;
  }

  const boosted = products.map((product) => {
    let boost = 0;

    if (features.includes("battery") && product.batteryMah) {
      boost += Number(product.batteryMah) / 10000;
    }

    if (features.includes("camera") && product.backCameraMp) {
      boost += Number(product.backCameraMp) / 200;
    }

    if (
      (features.includes("performance") || features.includes("gaming")) &&
      product.ramGb
    ) {
      boost += Number(product.ramGb) / 16;
      if (product.launchedYear) {
        boost += Math.max(Number(product.launchedYear) - 2018, 0) / 20;
      }
    }

    if (features.includes("display") && product.screenSizeInches) {
      boost += Number(product.screenSizeInches) / 20;
    }

    if (features.includes("processor") && product.processor) {
      boost += 0.2;
    }

    if (features.includes("ram") && product.ramGb) {
      boost += Number(product.ramGb) / 24;
    }

    return {
      ...product,
      score: Number(product.score || 0) + boost,
    };
  });

  boosted.sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score;
    }

    return Number(a.priceInr || 0) - Number(b.priceInr || 0);
  });

  return boosted;
};

const buildFeaturesList = (product) => {
  const features = [];

  if (product.processor) {
    features.push(product.processor);
  }

  if (product.ramGb) {
    features.push(`${product.ramGb}GB RAM`);
  }

  if (product.batteryMah) {
    features.push(`${product.batteryMah}mAh battery`);
  }

  if (product.backCameraMp) {
    features.push(`${product.backCameraMp}MP rear camera`);
  }

  return features;
};

const normalizeProduct = (product) => {
  const priceInr = Number(product.priceInr || 0);
  const rating = Number(product.rating || 0);
  const reviews = Number(product.reviews || 0);

  return {
    id: product.id,
    title: product.title,
    name: product.title,
    brand: product.brand,
    modelName: product.modelName,
    category: product.category,
    priceInr,
    price: priceInr,
    launchedYear: product.launchedYear,
    batteryMah: product.batteryMah,
    ramGb: product.ramGb,
    screenSizeInches: product.screenSizeInches,
    weightGrams: product.weightGrams,
    processor: product.processor,
    frontCameraMp: product.frontCameraMp,
    backCameraMp: product.backCameraMp,
    specsText: product.specsText,
    imageUrl: product.imageUrl,
    image: product.imageUrl || "https://via.placeholder.com/600x600?text=Phone",
    link: product.productUrl,
    tags: Array.isArray(product.tags) ? product.tags : [],
    rating,
    reviews,
    features: buildFeaturesList(product),
    score: Number((product.score || 0).toFixed(4)),
  };
};

// @desc    Get product recommendations based on user query
// @route   POST /api/recommend
// @access  Public
exports.getRecommendations = async (req, res) => {
  try {
    const { query, topK, filters = {}, budgetInr } = req.body;

    if (!query) {
      return res
        .status(400)
        .json({ success: false, error: "Please provide a search query" });
    }

    const safeTopK = clampTopK(topK ?? req.query.topK, 5);
    const parsedQuery = parseRecommendationQuery(
      query,
      budgetInr ?? filters.maxPriceInr,
    );
    const queryEmbedding = await getQueryEmbedding(query.trim());

    const rankedProducts = await fetchRankedProducts({
      parsedQuery,
      filters,
      topK: safeTopK,
      queryEmbedding,
    });

    const boostedProducts = applyFeatureBoosts(
      rankedProducts,
      parsedQuery.features,
    ).slice(0, safeTopK);
    const normalizedProducts = boostedProducts.map(normalizeProduct);

    await prisma.queryLog.create({
      data: {
        rawQuery: query,
        parsedQuery,
        topK: safeTopK,
        budgetInr: parsedQuery.budgetInr || null,
        matchedProducts: normalizedProducts.map((product) => ({
          id: product.id,
          priceInr: product.priceInr,
          score: product.score,
        })),
      },
    });

    res.status(200).json({
      success: true,
      data: {
        rawQuery: query,
        parsedQuery,
        topK: safeTopK,
        count: normalizedProducts.length,
        products: normalizedProducts,
        embeddingUsed: Boolean(queryEmbedding),
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Server Error" });
  }
};

// @desc    Log user query
// @route   POST /api/query-log
// @access  Public
exports.logQuery = async (req, res) => {
  try {
    const { query, selectedProducts = [], meta = {} } = req.body;

    if (!query) {
      return res
        .status(400)
        .json({ success: false, error: "Please provide a search query" });
    }

    const queryLog = await prisma.queryLog.create({
      data: {
        rawQuery: query,
        parsedQuery: meta.parsedQuery || null,
        topK: clampTopK(meta.topK, 5),
        budgetInr: parseFilterNumber(meta.budgetInr),
        matchedProducts: selectedProducts,
      },
    });

    res.status(201).json({ success: true, data: queryLog });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Server Error" });
  }
};
