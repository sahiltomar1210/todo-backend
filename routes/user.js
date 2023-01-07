const express = require("express");
const bodyparser = require("body-parser");
const bcrypt = require("bcrypt");
var jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require("../models/User.js");
const router = express.Router();
router.use(bodyparser.json());
const secret = "API";

router.post("/register", body('email').isEmail(), async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { email, password } = req.body;
        console.log(email);
        const user = await User.findOne({email});
        if(user){
            return res.status(403).json({ 
                status: "Failed",
                message: "User already exists"
            });
        }
        const username = email.split("@")[0];
        bcrypt.hash(password, 10, async function(err, hash) {
            if(err) {
                return res.status(400).json({ status: "Failed", message: err.message });
            }else{
            const user = await User.create({
                email,
                password: hash,
                username:username
            });
            res.json({
                status: "Success",
                user
            })
        }
        });

    } catch (e) {
        res.status(400).json({
            status: "Failed",
            message: "Failed to register due to technical error"
            }
        )
    }

});


router.post("/login", body('email').isEmail(), async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const {email, password } = req.body;
        const user = await User.findOne({email});
        if(!user){
            return res.status(403).json({ 
                status: "Failed",
                message: "User Not Registered"
            });
        }
        bcrypt.compare(password, user.password, function(err, result) {
            if(err) {
                return res.status(403).json({ status: "Failed", message: err.message});
            }
            if(result){
                const token = jwt.sign({
                    exp: Math.floor(Date.now() / 1000) + (60 * 60),
                    data: user._id
                  }, secret);

                res.status(200).json({
                    status: "Success",
                    message: "Login successful",
                    token,
                    user
                })
            }else{
                res.status(403).json({
                    status: "Failed",
                    message: "Invalid Password"
                })
            }
        });

    } catch (e) {
        res.status(400).json({
            status: "Failed",
            message: "Unable to login due to technical error"
            }
        )
    }
 
});

module.exports = router;