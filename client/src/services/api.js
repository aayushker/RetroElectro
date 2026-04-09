import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const PRODUCTS_CACHE_TTL_MS = 15 * 1000;

const productsResponseCache = new Map();
const inFlightProductRequests = new Map();

const serializeProductsParams = (params = {}) =>
  JSON.stringify(
    Object.entries(params)
      .filter(([, value]) => value !== undefined && value !== null && value !== "")
      .sort(([left], [right]) => left.localeCompare(right)),
  );

const clearProductListCache = () => {
  productsResponseCache.clear();
  inFlightProductRequests.clear();
};

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Product API calls
export const getProducts = (params = {}) => {
  const cacheKey = serializeProductsParams(params);
  const now = Date.now();
  const cached = productsResponseCache.get(cacheKey);

  if (cached && now - cached.updatedAt < PRODUCTS_CACHE_TTL_MS) {
    return Promise.resolve(cached.response);
  }

  const activeRequest = inFlightProductRequests.get(cacheKey);
  if (activeRequest) {
    return activeRequest;
  }

  const request = api
    .get("/products", { params })
    .then((response) => {
      productsResponseCache.set(cacheKey, {
        response,
        updatedAt: Date.now(),
      });
      return response;
    })
    .finally(() => {
      inFlightProductRequests.delete(cacheKey);
    });

  inFlightProductRequests.set(cacheKey, request);
  return request;
};
export const getProduct = (id) => api.get(`/products/${id}`);
export const createProduct = (data) =>
  api.post("/products", data).then((response) => {
    clearProductListCache();
    return response;
  });
export const updateProduct = (id, data) =>
  api.put(`/products/${id}`, data).then((response) => {
    clearProductListCache();
    return response;
  });
export const deleteProduct = (id) =>
  api.delete(`/products/${id}`).then((response) => {
    clearProductListCache();
    return response;
  });

// Recommendation API calls
export const getRecommendations = (data) => api.post("/recommend", data);
export const getTopKRecommendations = (data) =>
  api.post("/recommend/top-k", data);
export const logQuery = (data) => api.post("/query-log", data);

// Error interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  },
);

export default api;
