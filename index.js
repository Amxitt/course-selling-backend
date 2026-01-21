require("dotenv").config();
const express = require("express");
const { userRouter } = require("./routes/user");
const { courseRouter } = require("./routes/course");
const { adminRouter }  = require("./routes/admin");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");//cookie parser so req.cookie does not remains undefined

const app = express();
app.use(express.json());
app.use(cookieParser())//cookie middleware

app.use("/api/v1/user", userRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/course", courseRouter);

async function main(){
    await mongoose.connect(process.env.Mongo_URL);
    app.listen(3000);
}

main();