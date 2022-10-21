const router = require("express").Router();
const User = require("../model/User");
const { registerValidation, loginValidation } = require("../validation");
const { Bcrypt } = require("bcrypt-rust-wasm");
const bcrypt = Bcrypt.new(parseInt(process.env.SALT_ROUNDS));
const jwt = require("jsonwebtoken");

router.post("/register", async(req, res) => {
    try {
        const { username, email, password } = req.body;
        const { error } = registerValidation(req.body);
        if (error) {
            return res.status(400).send(error.details[0].message);
        }
        const exists = await User.findOne({ email: email, username: username});
        if (exists) {
            return res.status(409).json({ Error: "User already exists" });
        }
        const newUser = new User({
            username: username,
            email: email,
            password: bcrypt.hashSync(password),
        });
        const savedUser = await newUser.save();
        res.json(savedUser);
    } catch (err) {
        res.json(err);
    }
});

router.post("/login", async(req, res) => {
    try {
        const { error } = loginValidation(req.body);
        if (error) {
            return res.status(400).send(error.details[0].message);
        }
        const { username , password } = req.body;
        const exists = await User.findOne({ username: username });
        if (!exists) {
            return res.status(404).json({ Error: "No such user exists blig" });
        }
        if (!bcrypt.verifySync(password, exists.password)) {
            return res.status(401).json({ Error: "Incorrect Password" });
        }
        const token = jwt.sign({
            _id: exists._id,
          
            
        }, process.env.TOKEN_SECRET);
       
        if(exists){
            return res.status(200).json(req.body);
        }
    } catch (err) {
        res.json(err);
    }
});

module.exports = router;