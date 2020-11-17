

const bcrypt = require('bcryptjs');
const utils = require('../utils/index')
const crypto = require('crypto');
const transporter = require("../controllers/API/sendEmail")


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
			return res.redirect('/userHome');
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

exports.getRecoverPassword=(req,res)=>{
    res.render('recoverPassword')
}

exports.postRecoverPassword=async (req,res)=>{
	let email = req.body.email
	try{
	   const buffer = await crypto.randomBytes(32)
	   var token = buffer.toString('hex')

	}catch(err){
		console.log(err);
		return res.redirect('/recoverPassword')
	}

	try{
		let user = await User.findOne({username:email,email:email})
		if(!user){
			req.flash('error','No account with that email or username')
			return res.redirect('/recoverPassword')
		}

		user.resetToken = token;
		user.resetTokenExpiration = Date.now()+360000
		user.save()

		transporter.sendMail({
			to: req.body.email,
			from: 'drivera289@gmail.com',
			subject: 'Recuperar Contraseña',
			html: `
		<p>Ha solicitado un cambio de contaseña.</p>
		<p>Para proceder presione el siguiente <a href="${process.env.ROOT_URL}/newPassword/${token}">enlace</a></p>
		`
		});


	}catch(err){
		console.log(err)
	}



}

exports.getResetPassword= async(req,res)=>{
	let token = req.params.token

	try {
		var user = await User.findOne({ resetToken: token });
		if(!user){
			res.redirect('/register')
		}
		console.log(user);
		res.render('resetPassword', { user, token });
	} catch (err) {
		console.log(err);
	}
};

exports.postResetPassword= async(req,res)=>{
	const newPassword =  req.body.newPassword;
	const token = req.params.token;

	try {
		var user = await User.findOne( { resetToken: token } );
		user.password = await bcrypt.hash(newPassword, 12);
		user.resetToken = null;
		await user.save();
		res.redirect('/login');
	} catch (err) {
		console.log(err);
	}
}


