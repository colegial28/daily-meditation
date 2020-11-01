

const bcrypt = require('bcryptjs');
const utils = require('../utils/index')


let User = require("../models/user")


exports.getIndex = (req,res)=>{
    res.render('register')
}

exports.getLogin =(req,res)=>{
    res.render('login')
}

exports.postLogout=(req,res)=>{
	console.log("logout")
	req.session.destroy((err) => {
		console.log(err);
		res.redirect('/');
	});
}

exports.getRegister =(req,res)=>{
    res.render('register')
}


exports.postRegister = async(req,res)=>{
    console.log(req.body)
    let { email, firstName, lastName, phoneNumber, password } = req.body;
	let username = email.split('@')[0];


	try {
		let userDoc = await User.findOne({ email: email });
		if (userDoc) {
			return res.redirect('/login');
		}
		let hashedPassword = await bcrypt.hash(password, 12);

		const newUser = await User.create(
			new User({
				email,
				firstName,
				lastName,
				phoneNumber,
				username,
				password: hashedPassword
			})
		);
		req.session.isLoggedIn = true;
        req.session.user = newUser;
        req.session.user._id = newUser._id
		return req.session.save((err) => {
			return res.redirect('/newClient');
		});
	} catch (err) {
		console.log(err);
		res.redirect('/register');
	}

}

exports.postLogin = async(req,res)=>{
    let { email, password } = req.body;
	let username = email.split('@')[0];
	try {
		var user = await User.findOne({ $or: [ { username }, { email } ] });
		if (!user) {
			return res.redirect('/login');
		}


		let validPassword = await bcrypt.compare(password, user.password);
		if (validPassword) {
			req.session.isLoggedIn = true;
			req.session.user = user;
			req.session.userType = user.userType;
			return req.session.save((err) => {
				console.log(err);
				if (user.userType == 'administrator') {
					res.redirect('/administrator/index');
				}

				if(user.userType==""){
					

					return res.redirect('/clientHome')
				}else{
					return res.redirect('/newClient');
				}
				
				
			});
		}

		res.redirect('/login');
	} catch (err) {
		console.log(err);
	}
};


