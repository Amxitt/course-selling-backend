const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const ObjectId = mongoose.ObjectId;

const user = new Schema({
    email: {type: String, unique: true},
    password: String,
    firstname: String,
    lastname: String
})

const admin = new Schema ({
    email: {type: String, unique: true},
    password: String,
    firstname: String,
    lastname: String
})

const course = new Schema({
    title: String,
    description: String,  
    price: Number,
    imageUrl: String,
    creatorId: ObjectId   //point to admin who created id
})

const purchases = new Schema({
    courseId: {type: ObjectId, ref:"course"}, //will point to course object id
    userId: {type: ObjectId, ref: "user"}//will point to user who has access to it
})

const userModel = mongoose.model("users", user);
const adminModel = mongoose.model("admin", admin);
const courseModel  = mongoose.model("course", course);
const purchasesModel = mongoose.model("purchase", purchases);

module.exports = {
    userModel,
    adminModel,
    courseModel,
    purchasesModel
}