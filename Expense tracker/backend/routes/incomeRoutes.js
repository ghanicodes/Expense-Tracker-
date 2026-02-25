const express = require("express");
const router = express.Router();
const protect = require("../middleware/protect");
const {addIncome , getIncome}  = require("../controllers/incomeController");

router.post("/addIncome", protect, addIncome);
router.get("/getIncome", protect, getIncome)

module.exports = router