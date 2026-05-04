
const cloudinary = require("cloudinary").v2;
require("dotenv").config();

cloudinary.config({
  secure: true, 
  cloud_name: 'dwsctg415',           
  api_key: '356821134385893',         
  api_secret: 'tCMq1FnfSMK6zkMG7j35qz7yy5w' 
});

module.exports = cloudinary;
