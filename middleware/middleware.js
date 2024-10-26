const User = require('../models/userModel')

exports.isAdmin = async (req, res, next) => {
    const user = await User.findOne({ _id: req.session.admin_session });
    console.log(user);
    if (user && user.isAdmin === true) {
      next();
    } else {
      return res.redirect(
        `/login?error=${encodeURIComponent("You did note have access")}`
      );
    }
};
exports.isAdminLogout = async (req,res,next) =>{
  if(!req.session.user_session){
    return next()
  }else{
    return res.redirect('/admin/dashboard');
  }
}

exports.isLoggedIn = async (req,res,next) =>{
  try{
    if(req.session.user_session){
      // const user = await User.findById(req.session.user_session);
      // if(!user) return res.redirect(`/login?error=${encodeURIComponent("Login to Gain Access")}`)
      next(); 
    }else{
      return res.redirect('/login')
    }
  }catch(e){
    console.log(e);
  }
}

exports.isLogout = async (req,res,next)=>{
  try {
    if(!req.session.user_session){
      next()
    }else{
      return res.redirect('/userPage')
    }
  } catch (error) {
    console.log(error.message);
  }
}