
const router = require('express').Router();
const indexController= require('../controllers/index')

router.get('/', indexController.getIndex);

router.get('/register',indexController.getRegister);

router.post('/register',indexController.postRegister)


router.get('/login',indexController.getLogin);

router.post('/login', indexController.postLogin);

router.post('/logout',indexController.postLogout)


router.get('/recoverPassword',indexController.getRecoverPassword)

router.post('/recoverPassword',indexController.postRecoverPassword)

router.get('/resetPassword/:token',indexController.getResetPassword)

router.post('/resetPassword/:token',indexController.getResetPassword)




module.exports = router;
