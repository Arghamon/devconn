const express = require("express");
const router = express.Router();

//@route   GET api/users/test
//@desc    Tests Posts route
//@access  Public
router.get("/test", (req, res) => res.json({ message: "Posts Work" }));

module.exports = router;
