const dotenv = require('dotenv');
dotenv.config();
console.log(process.env.ATLAS_URI)
module.exports = {
	atlas_uri: process.env.ATLAS_URI,
	
};