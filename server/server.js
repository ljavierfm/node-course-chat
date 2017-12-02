/*jshint esversion: 6 */

//imports
const path=require('path');
const express=require('express');

//public path
const publicPath=path.join(__dirname,'../public');
//puerto para heroku o para default
const port=process.env.PORT||3000;

//Creates an Express application
let app=express();

//middleware. serves static files
app.use(express.static(publicPath));

//Start de server
app.listen(port,()=>{
    console.log(`Server starting at ${port}`);
});





