const express = require('express');
const adminController = require('../controllers/adminController');
const middleware = require('../middleware/middleware') 
const router = express();
const session=require("express-session")
const config=require("../configurations/config")

router.use(session({
    secret: config.sessionSecret,
    resave: false,
    saveUninitialized:true
  }));

router.use(express.json());
router.use(express.urlencoded({extended:true}))



router.get('/login',middleware.isAdminLogout,adminController.getAdminLogin);
router.post('/login',middleware.isAdminLogout,adminController.login);
router.post('/logout',middleware.isAdminLogout,adminController.destroyUser);
router.get('/dashboard',middleware.isAdmin,adminController.dashboard)
router.get('/user/newuser',middleware.isAdmin, adminController.newUser);
router.get('/user',middleware.isAdmin, adminController.showUser);

//router.get('/admin/usershow',middleware.isAdmin, adminController.search);

router.post('/user/newuser',middleware.isAdmin, adminController.createUser);
router.get('/user/:id/edit',middleware.isAdmin, adminController.editUser);
router.post('/user/:id', middleware.isAdmin, adminController.updateUser);

router.post('/users/:id/destroy', middleware.isAdmin, adminController.destroyUser);

module.exports = router; 