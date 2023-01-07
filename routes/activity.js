const express = require("express");
const bodyparser = require("body-parser");
const Activity = require("../models/Activity.js");
const router = express.Router();

router.use(bodyparser.json());

router.get("/", async (req, res) => {
    try{
        const details = await Activity.find({user: req.user});
        res.json({
            status: "Success",
            details
        })

    }catch(e){
        res.status(500).json({
            status: "Failed",
            message: e.message
        })
    }
});

router.post("/", async (req, res) => {
    try{  
        const details = await Activity.create({
            activity: req.body.activity,
            status: req.body.status,
            timetaken: req.body.timetaken,
            action: req.body.action,
            user: req.user,
        });
        res.json({
            status: "Success",
            details
        })

    }catch(e){
        res.status(500).json({
            status: "Failed",
            message: e.message
        })
    }
});
module.exports = router;