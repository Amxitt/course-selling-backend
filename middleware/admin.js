const jwt = require("jsonwebtoken");
const {JWT_ADMIN_PASSWORD} = require("../config");

async function adminMiddleware(req, res, next){
    const token = req.cookies.token;
    if(!token){
        return res.status(402).json({
            message: "not authenticated"
        })
    }
    try{
    const decoded = jwt.verify(token, JWT_ADMIN_PASSWORD);
    req.userId = decoded.id;
    next();
    }catch(e){
        res.status(402).json({
            message: "invalid or expired token"
        })
    }
}

module.exports = {
    adminMiddleware
}