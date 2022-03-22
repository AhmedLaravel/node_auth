const httpErrors = require("http-errors"); 
const JWT = require("jsonwebtoken");
const  { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports.verifyToken = (req, res, next) => {
    if(!req.headers['authorization']) return next(httpErrors.Unauthorized("Not Authorized"));

    const authHeader = req.headers['authorization'];
    const allToken = authHeader.split(' ');
    const token = allToken[1];
    JWT.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, payload) => {
        if(err){
            const message = err.name === "JsonWebTokenError" ? "Unauthorized" : err.message;
            return next(httpErrors.Unauthorized(message));
        } 

        req.payload = payload;
        req.user = await prisma.user.findFirst({
            where:{id: Number(payload.aud)},
            select:{
                id:true,
                name:true,
                isVerified:true
            }
        })
        next();
    });
}