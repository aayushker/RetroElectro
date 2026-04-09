const express = require("express");
const router = express.Router();
const {
  getRecommendations,
  logQuery,
} = require("../controllers/recommendationController");

router.post("/recommend", getRecommendations);
router.post("/recommend/top-k", getRecommendations);
router.post("/query-log", logQuery);

module.exports = router;
