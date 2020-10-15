const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema(
	{
		username: {
			type: String,
			required: true,
			unique: true,
			minlength: 3
		},

		password: {
            type: String,
            required:true
		},

		firstName: {
			type: String,
            required: true,
            uppercase: true
            
		},
		lastName: {
			type: String,
            required: true,
            uppercase: true
		},

		email: {
			type: String,
			required: true,
			unique: true
		},
		phoneNumber: {
			type: String
		},
		userType: {
			type: String,
			default: ''
		}
		
		
		

		
	
	},
	{
		timestamps: true
	}
);

module.exports = mongoose.model('User', UserSchema);