const { Router, application }   = require("express"); // express routes handling
const adminRouter = Router(); 
const {z}  = require("zod") //getting zod

const {adminModel} = require("../db"); //importing admin model
const {courseModel} = require("../db"); //importing course model
const {JWT_ADMIN_PASSWORD} = require("../config") //importing jwt for admin
const bcrypt = require("bcrypt"); //for hashing passwords
const jwt = require("jsonwebtoken"); //jwt


const {adminMiddleware} = require("../middleware/admin");

adminRouter.post("/signup", async function(req , res){
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
    await adminModel.create({
        email: email,
        password: hashpassword,
        firstname: firstname,
        lastname: lastname
        })
        res.status(201).json({
        message: "Admin created"
        })

    }catch(e){

        if(e.code === 11000){
            return res.status(409).json({
            message: "Admin already exists"
            });
        }
       return res.status(500).json({
        message: "internal server error"
       });
       
    }
   
});

adminRouter.post("/signin", async function(req , res){
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
    
    const admin = await adminModel.findOne({ //checking if user exists
        email: email
    })
    if(!admin){
        return res.json({
            message: "Admin does not exists"
        })
    }
    const passwordMatched = await bcrypt.compare(password , admin.password) //checking if the password is correct
    if(!passwordMatched){
        return res.status(403).json({
            message: "invalid credentials"
        })
    }
    const token = jwt.sign({ //assigning token
        id: admin._id
    }, JWT_ADMIN_PASSWORD);

    res.cookie("token", token).status(201).json({
        message: "signed in as " + admin.firstname,
    })
})

adminRouter.use(adminMiddleware); //token verification for all the request below this.

adminRouter.post("/course", async function(req , res){ //create a course
  const adminId = req.userId;
  const {title , description, price, imageUrl} = req.body;

  try{
        const course = await courseModel.create({
            title,
            description,
            price,
            imageUrl,
            creatorId: adminId
            })

        res.status(202).json({
            message: "course added successfully",
            courseId: course._id
        })
    }catch(e){
        res.status(402).json({
            message: "couldn't add course due to internal error"
        })
    }
})

adminRouter.put("/course", async function(req , res){ //to change the price, name, image of course
    const adminId = req.userId;
    const {title , description, price, imageUrl , courseId} = req.body;
    if(!courseId) return res.status(402).json({
        message: "course id cannot be empty"
    })
  try{
        const course = await courseModel.updateOne({
            _id: courseId,
            creatorId: adminId
        },{
            title,
            description,
            price,
            imageUrl
        })
        console.log(course)//
        res.status(202).json({
            message: "course updated successfully",
            coourseId: course._id
        })

    }catch(e){
        res.status(402).json({
            message: "action failed"
        })
    }
})

adminRouter.get("/course/bulk",async function(req , res){ //get all the course that admin has created
    const adminId = req.userId;
    try{
        const courses = await courseModel.find({
            creatorId: adminId
        })

        res.status(202).json({
            courses
        })
    }catch(e){
        res.status(402).json({
            message: "cannot fetch courses due to internal error"
            })
        }
})

module.exports = {
    adminRouter: adminRouter
}