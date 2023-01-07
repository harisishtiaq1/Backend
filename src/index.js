const { port } = require('./config/vars');
const express=require("express")
const app = require('./config/express');
const mongoose = require('./config/mongoose');
const http = require('http');
mongoose.connect();
http.createServer(app).listen(port);
console.log(`App is running on ${port}`)
module.exports = app;