const express = require('express')
const userController = require('../controllers/userController');
const middleWare = require("../middleware/middleware") 
const router = express.Router();

const session=require("express-session")
 const config=require("../configurations/config")
router.use(session({secret:config.sessionSecret,
resave:false ,
saveUninitialized:true}))

router.get("/signup",middleWare.isLogout,userController.showSignup);
router.post("/signup",middleWare.isLogout,userController.signup);
router.get("/login",middleWare.isLogout,userController.showLogin);
router.post("/login",middleWare.isLogout,userController.login);
router.post("/logout",middleWare.isLoggedIn,userController.logout);
router.get('/',middleWare.isLoggedIn,userController.profile);

module.exports = router;