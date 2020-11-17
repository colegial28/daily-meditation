const nodemailer = require('nodemailer');
const sendGridTransport = require('nodemailer-sendgrid-transport');
require('dotenv').config()


const transporter = nodemailer.createTransport(
	sendGridTransport({
		auth: {
			api_key: process.env.SEND_GRID_API_KEY
		}
	})
);




module.exports =  transporter