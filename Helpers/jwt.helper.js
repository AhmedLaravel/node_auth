const  httpError  = require("http-errors");
const JWT = require("jsonwebtoken");

//------------------------ Generation an access token-----------
module.exports.generateAccessToken = (userId)=>{
    return new Promise((resolve, reject)=>{
        const payload = {};


        const secret = `${process.env.ACCESS_TOKEN_SECRET}`;


        const options = {
            expiresIn: "1h",
            issuer: "zzabbat.com",
            audience: `${userId}`
        }
        JWT.sign(payload,secret,options,(err, token)=>{
            if(err){
                console.log(err);
                return reject(httpError.InternalServerError());
            } 

            return resolve(token);
        })
    })
}

//-------------------------------Generating refresh token------------------
module.exports.generateRefreshToken = (userId)=>{
    return new Promise((resolve, reject)=>{
        const payload = {};

        const secret = `${process.env.REFRESH_ROKEN_SECRET}`;


        const options = {
            expiresIn: "1y",
            issuer: "zzabbat.com",
            audience: `${userId}`
        }
        JWT.sign(payload,secret,options,(err, token)=>{
            if(err){
                console.log(err);
                return reject(httpError.InternalServerError());
            } 

            return resolve(token);
        })
    })
}


//--------------------------------Verify REfresh token-----------

module.exports.verifyRefreshToken = (refreshToken) => {
    return new Promise((resolve, reject) => {
        JWT.verify(refreshToken, process.env.REFRESH_ROKEN_SECRET, (err, payload) => {
            if(err) return reject(httpError.Unauthorized());
            const userId = payload.aud;

            return resolve(userId);
        });

    });
}