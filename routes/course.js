const { Router }  = require("express");
const courseRouter = Router();
const {userMiddleware } = require("../middleware/user");
const { courseModel , purchasesModel} = require("../db");

courseRouter.post("/purchase", userMiddleware, async function(req, res){
    const userId = req.userId;
    const courseId = req.body.id;
    if(!userId || !courseId) return res.json({message: "need to sign in before purchasing the course and send course id"})
    //should check if the user paid only then move forward
     const purchase = await purchasesModel.create({
        userId, courseId
    })

    res.status(202).json({
        message: "Purchased successfully",
    })
})

courseRouter.get("/preview", async function(req, res){
    const courses = await courseModel.find({ //no filter means provide all the courses that exists
    })
    res.status(202).json({
        message: "here are all the available courses",
        courses
    })
})


module.exports = {
    courseRouter: courseRouter
}