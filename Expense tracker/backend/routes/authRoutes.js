const express = require("express");
const router =express.Router();
const protect = require("../middleware/protect");


const { registerUser, loginUser, getUserInfo, logoutUser} = require("../controllers/authController");


router.post("/signup", registerUser);

router.post("/login", loginUser);

router.get("/me", protect, getUserInfo);

router.post("/logout", logoutUser);


module.exports = router;