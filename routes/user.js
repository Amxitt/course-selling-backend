const { Router }  = require("express");
const userRouter = Router();
const {z}  = require("zod") //getting zod
const {userModel, purchasesModel} = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


const {userMiddleware} = require("../middleware/user");
const { JWT_USER_PASSWORD } = require("../config");

userRouter.post("/signup",async function(req , res){
     const requiredbody = z.object({
        email: z.string().min(5).email(),
        password: z.string().min(8).regex(/[A-Z]/).regex(/[a-z]/).regex(/[0-9]/),
        firstname: z.string().min(3).max(100),
        lastname: z.string().min(3).max(100)
    })
    const requiredbodyWithSuccess = requiredbody.safeParse(req.body);
    
    if(!requiredbodyWithSuccess.success){
        return res.json({
            message: "invalid format",
            error: requiredbodyWithSuccess.error
        })
    }
    const email = req.body.email;
    const password = req.body.password;
    const firstname = req.body.firstname;
    const lastname = req.body.lastname;
    
    try{
    const hashpassword = await bcrypt.hash(password, 5);
    await userModel.create({
        email: email,
        password: hashpassword,
        firstname: firstname,
        lastname: lastname
        })
        res.status(201).json({
        message: "User created"
        })

    }catch(e){

        if(e.code === 11000){
            return res.status(409).json({
            message: "User already exists"
            });
        }
       return res.status(500).json({
        message: "internal server error"
       });
       
    }
   
})

userRouter.post("/signin", async function(req , res){
      const requiredbody = z.object({
        email: z.string().min(5).max(100).email(),
        password: z.string().min(5).max(100).regex(/[A-Z]/, "need one uppercase")
    })
    const requiredbodyWithSuccess = requiredbody.safeParse(req.body);
    
    if(!requiredbodyWithSuccess.success){
        return res.json({
            message: "invalid format",
            error: requiredbodyWithSuccess.error
        })
    }
    const email = req.body.email;
    const password = req.body.password;
    
    const user = await userModel.findOne({ //checking if user exists
        email: email
    })
    if(!user){
        return res.json({
            message: "user does not exists"
        })
    }
    const passwordMatched = await bcrypt.compare(password , user.password) //checking if the password is correct
    if(!passwordMatched){
        return res.status(403).json({
            message: "invalid credentials"
        })
    }
    const token = jwt.sign({ //assigning token
        id: user._id
    }, JWT_USER_PASSWORD, { expiresIn: "7d"}); //expiry based token

    res.cookie("token", token, {
        httpOnly: true
    }).status(202).json({
        message: "You are signed in"
    })
})
userRouter.use(userMiddleware) //
userRouter.get("/purchases", async function(req , res){
    const userId = req.userId;
    const purchases = await purchasesModel.find({userId}).populate("courseId");
    if (purchases.length === 0){
        return res.json({
            courses: []
        })
    }
    const courses = purchases.map(p => p.courseId);

    res.status(200).json({
        courses
    });
})
userRouter.post("/logout", function(req, res){
    res.clearCookie("token").status(200).json({message: "logged out"})
})
module.exports = {
    userRouter: userRouter
}