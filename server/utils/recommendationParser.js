const CATEGORY_KEYWORDS = {
  smartphone: ["phone", "smartphone", "mobile", "cellphone"],
  tablet: ["tablet", "ipad", "tab"],
  laptop: ["laptop", "notebook"],
  headphone: ["headphone", "earbuds", "earphone"],
};

const FEATURE_KEYWORDS = {
  battery: ["battery", "backup", "mah", "long lasting", "long-lasting"],
  camera: ["camera", "photo", "selfie", "portrait", "video"],
  performance: ["performance", "fast", "speed", "smooth"],
  gaming: ["gaming", "game"],
  display: ["display", "screen", "amoled", "oled"],
  processor: ["processor", "chipset", "snapdragon", "dimensity", "bionic"],
  ram: ["ram", "multitask", "multitasking"],
  storage: ["storage", "memory", "rom", "gb"],
};

const KNOWN_BRANDS = [
  "apple",
  "samsung",
  "xiaomi",
  "oneplus",
  "realme",
  "motorola",
  "oppo",
  "vivo",
  "huawei",
  "lenovo",
  "iqoo",
];

const normalizeNumber = (value) =>
  Number.parseInt(String(value).replace(/,/g, ""), 10);

const extractBudgetInr = (lowercaseQuery) => {
  const budgetPatterns = [
    /(?:under|below|less than|upto|up to|within|budget)\s*(?:of\s*)?(?:rs\.?|inr|₹)?\s*([0-9][0-9,]*)\s*(k)?/i,
    /(?:rs\.?|inr|₹)\s*([0-9][0-9,]*)\s*(k)?/i,
  ];

  for (const pattern of budgetPatterns) {
    const match = lowercaseQuery.match(pattern);
    if (!match) {
      continue;
    }

    const amount = normalizeNumber(match[1]);
    if (!Number.isFinite(amount) || amount <= 0) {
      continue;
    }

    return match[2] ? amount * 1000 : amount;
  }

  return null;
};

const detectCategory = (lowercaseQuery) => {
  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (keywords.some((keyword) => lowercaseQuery.includes(keyword))) {
      return category;
    }
  }

  return "smartphone";
};

const detectFeatures = (lowercaseQuery) =>
  Object.entries(FEATURE_KEYWORDS)
    .filter(([, keywords]) =>
      keywords.some((keyword) => lowercaseQuery.includes(keyword)),
    )
    .map(([feature]) => feature);

const detectBrands = (lowercaseQuery) =>
  KNOWN_BRANDS.filter((brand) => lowercaseQuery.includes(brand));

const parseRecommendationQuery = (query, explicitBudget) => {
  const normalized = String(query || "").trim();
  const lowercaseQuery = normalized.toLowerCase();

  const extractedBudget = extractBudgetInr(lowercaseQuery);
  const explicitBudgetValue =
    explicitBudget === undefined || explicitBudget === null
      ? null
      : Number.parseInt(explicitBudget, 10);

  return {
    category: detectCategory(lowercaseQuery),
    budgetInr: Number.isFinite(explicitBudgetValue)
      ? explicitBudgetValue
      : extractedBudget,
    features: detectFeatures(lowercaseQuery),
    brands: detectBrands(lowercaseQuery),
    otherRequirements: [],
  };
};

const clampTopK = (value, fallback = 5) => {
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed)) {
    return fallback;
  }

  return Math.min(20, Math.max(1, parsed));
};

module.exports = {
  parseRecommendationQuery,
  clampTopK,
};
