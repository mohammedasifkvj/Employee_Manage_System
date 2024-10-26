const User = require('../models/userModel');
const bcrypt = require('bcrypt');


exports.showSignup = (req,res) => {
  const {error,success} = req.query
  res.render('./users/signup',{
    error,
    success
  })
}

exports.showLogin = (req,res) => {
  const { error, success } = req.query

  res.render('./users/login',{
    error,
    success
  })
}

exports.signup =async (req,res)=>{
    try{
        const name = req.body.name
        const email = req.body.email
        const phone = req.body.phone
        const password = req.body.password

        const oldUser =await User.findOne({email});

        if(oldUser){
            return res.redirect(`/signup?error=${encodeURIComponent("User already exists. Please  log in with another mail!")}`)
        }else{
        const hash = await bcrypt.hash(password,12);
        const user = await User.create(
            {
                name,
                email,
                password:hash,
                phone
            }
        )
        if (user) {
            return res.redirect(
              `/login?success=${encodeURIComponent("Successfully your account created.Please login")}`
            );
        } 
      }
    }catch(e){
        console.log(e);
    }
}

exports.profile = async (req,res)=>{
    try{
      const user = await User.find({_id:req.session.user_session});
      console.log(user[0].name,"iam working");
      if(!user) return res.redirect('/signup');

      return res.render("users/userPage",{
        user,
      });

    }catch(e){
      console.log(e)
    }
}

exports.login = async(req,res)=>{
    try {
        const email = req.body.email;
        const password = req.body.password;
  
        if (!email)
          return res.render("users/login", {
            error: "Email is required!",
            success: null,
          });
  
        if (!password)
          return res.render("users/login", {
            error: "Password is required",
            success: null,
          });
  
        const user = await User.findOne({ email });
  
        if (!user)
          return res.render("users/login", {
            error: "User not found",
            success: null,
          });
  
        const isMatch = await bcrypt.compare(password, user.password);
  
        if (!isMatch)
          return res.render(`users/login`, {
            error: "Email or password is incorrect",
            success: null,
          });
  
        if (user.isVerified === 0)
          return res.redirect(
            `/login?error=${encodeURIComponent(
              "Need verification to login"
            )}`
          );
  
        req.session.user_session = user._id;
  
        return res.redirect("/");

    } catch (e) {
        res.send(e);
    }
}

exports.logout = (req,res)=>{
  req.session.destroy();
  return res.redirect("/login");
}
