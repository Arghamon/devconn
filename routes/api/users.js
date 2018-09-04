const express = require("express");
const router = express.Router();

//@route   GET api/users/test
//@desc    Tests Profiles route
//@access  Public
router.get("/test", (req, res) => res.json({ message: "Users Work" }));

module.exports = router;
