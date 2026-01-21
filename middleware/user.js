const jwt = require("jsonwebtoken");
const {JWT_USER_PASSWORD} = require("../config")

async function userMiddleware(req, res, next){
    const token = req.cookies.token;
    if(!token){
        return res.status(401).json({
            message: "not authenticated"
        })
    }
    try{
    const decoded = jwt.verify(token, JWT_USER_PASSWORD);
        req.userId = decoded.id;
        next();
    }catch(e){
        return res.status(401).json({
            message: "invalid or expired token"
        })
    }
}

module.exports = {
    userMiddleware
}