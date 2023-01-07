const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const activitySchema = new Schema({
    activity: {type: String},
    status: {type: String},
    timetaken:{type:String},
    action:String,
    user: {type: Schema.Types.ObjectId, ref: "User"}
}, {timestamps: true});

const Activity = mongoose.model("Activity", activitySchema);

module.exports = Activity;