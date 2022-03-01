require("dotenv").config();
const express = require("express");
const morgan = require("morgan"); // To log our http requests
const httpErrors = require("http-errors"); // To create out own http error objects
const AuthRoutes = require("./Routes/api");
const { verifyToken } = require("./Middlewares/auh.middleware");
require("./database/connection");
//Intializing out authentication app
const app = express();


app.get('/', verifyToken, async(req, res, next) =>{
    res.send("<center><h1>Pickles Authentication</h1></center>");
});
app.use(morgan("dev"));
app.use(express.json());

app.use("/api",AuthRoutes);

app.use((req, res, next)=>{
    next(httpErrors.NotFound());
});
app.use((err, req, res, next)=>{
    res.status = err.status || 500;
    res.send({
        status:err.status || 500,
        message:err.message,
        data:null
    });
});

const port = process.env.PORT || 3000;


app.listen(port, () =>{
    console.log(`Authentication service on port ${port}`);
} );