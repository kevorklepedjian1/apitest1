const router = require("express").Router();
const User = require("../model/User");
const verify = require("./verifyToken");

router.get("/dashboard", verify, async(req, res) => {
    try {
        console.log(req.user);
        const details = await User.findOne({ _id: req.user._id });
        res.json(details);
    } catch (err) {
        res.json(err);
    }
});

module.exports = router;