var express = require('express');
var cors = require('cors');
const fs = require('fs');
var bodyParser = require('body-parser');
var router = require('./router/router.js');
var app = express();
app.use(cors())

// parse application/x-www-form-urlencoded
app.use("/app",router);


app.listen(8888,function(){
    console.log("Server đang lắng nghe port 8888");
});