
const router = require('express').Router();
const indexController= require('../controllers/index')

router.get('/', indexController.getIndex);

router.get('/register',indexController.getRegister);

router.post('/register',indexController.postRegister)


router.get('/login',indexController.getLogin);

router.post('/login', indexController.postLogin);

router.post('/logout',indexController.postLogout)


module.exports = router;
