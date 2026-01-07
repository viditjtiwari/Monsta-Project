const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const env = require('dotenv').config();
const mongoose = require('mongoose');

const server = express();//Executable Function

server.use(express.json());
server.use(express.urlencoded({ extended: true }));

server.use(bodyParser.json());

server.use(cors());

server.get('/', (request, response) => {
    response.send("Server is working fine!!");
});

server.use("/uploads/default",express.static("uploads/default"))
server.use("/uploads/categories",express.static("uploads/categories"))
server.use("/uploads/sliders",express.static("uploads/sliders"))
server.use("/uploads/whychooseus",express.static("uploads/whychooseus"))
server.use("/uploads/testimonial",express.static("uploads/testimonial"))

//Admin API URIs
require('./src/Routes/Admin/default.routes.js')(server);
require('./src/Routes/Admin/color.routes.js')(server);
require('./src/Routes/Admin/material.routes.js')(server);
require('./src/Routes/Admin/country.routes.js')(server);
require('./src/Routes/Admin/category.routes.js')(server);
require('./src/Routes/Admin/slider.routes.js')(server);
require('./src/Routes/Admin/whychooseus.routes.js')(server);
require('./src/Routes/Admin/testimonial.routes.js')(server);
require('./src/Routes/Admin/faq.routes.js')(server);
require('./src/Routes/Admin/subCategory.routes.js')(server);
require('./src/Routes/Admin/subSubCategory.routes.js')(server);

mongoose.connect(`mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@cluster.h2penvi.mongodb.net/Monsta?appName=Cluster`)
    .then(() => console.log('Connected!'))
    .catch(err => console.log(err));

server.listen(process.env.PORT, () => {
    console.log("Server is working fine!!");
})