const User = require("../models/userModel")
const bcrypt = require("bcrypt");

exports.getAdminLogin = (req,res)=>{
    const {error, success} = req.query
    res.render('admin/login',{
        error,
        success:null
    });
}

exports.login = async(req, res)=>{
    try{
        const {email, password} = req.body;
        console.log(email);
        const user = await User.findOne({email});
        console.log(user.isAdmin);
        if(!user){
            return res.render('admin/login',{
                error : "Account note Found",
                success : null,
            })
        }

        const isCurrectPassword = await bcrypt.compare(password, user.password);
        if(!isCurrectPassword){
            res.render('admin/login',{
                error:"invalid crenditials",
                success: null
            })
        }

        if(user.isAdmin === true ){
            req.session.admin_session = user._id;
            return res.redirect('/admin/dashboard');
        }

        return res.redirect(`/login?error=${encodeURIComponent("Sorry,only admin have the access !")}`)

    }catch(e){
        console.log(e);
    }
}

exports.dashboard = async (req,res)=>{
    const q = false;  
    if(q){
        const users = await User.find({ name: { $regex: ".*" + q + ".*" } });
        return res.render("admin/dashboard", { users, q });
    }else{
        const users = await User.find({isAdmin: false});
        console.log(users);
        return res.render("admin/dashboard", {users, q: null});
    }
}

exports.newUser = (req,res)=>{
    return res.render("admin/new_user",{
        error : null
    });
}

exports.createUser = async (req,res) =>{
    const {name,email,phone,password} = req.body;
    try{
        if (!email)
            return res.render("admin/new_user", { error: "Email is required" });
        if(!name)
            return res.render("admin/new_user",{ error: "Name is required" });
        if(!phone)
            return res.render("admin/new_user",{ error: "phone number is required" });
        if(!password) 
            return res.render("admin/new_user",{ error: "password is required" });

        const isExist = await User.findOne({email});
        if(isExist){
            res.render('admin/new_user',{error:"user already exists"})
        } else{
        const hash = await bcrypt.hash(password,12);

         await User.create({name,email,phone,password:hash})
        res.redirect("/admin/dashboard") 
        }
    }catch(e){
        console.log(e);
    }
}

exports.editUser = async (req, res) => {
    const { id } = req.params;
    const user = await User.findOne({ uid: id });
    return res.render("admin/user_edit", { user });
}

exports.updateUser = async (req, res) => {
    const { id } = req.params;
    const { name, email, phone } = req.body;
    try {
      const user = await User.findOneAndUpdate(
        { uid: id },
        {
          $set: {
            name,
            email,
            phone
          },
        },
        { new: true }
      );

      if (!user)
        return res.redirect(
          `/admin/dashboard?error=${encodeURIComponent("User not found!")}`
        );

      return res.redirect(
        `/admin/dashboard?message=${encodeURIComponent("Updated success")}`
      );
    } catch (e) {
      console.log(e);
    }
}

exports.destroyUser= async (req, res) => {
    const { id } = req.params;
    console.log(id);
    try {
      const user = await User.findOneAndDelete({ uid: id });
      if (req.session.user_session === user._id) {
        req.session.destroy();
      }
      return res.redirect("/admin/dashboard");
    } catch (e) {
      console.log(e);
    }
  }

  exports.showUser = async (req, res) => {
    const { id } = req.query;
    try {
      const user = await User.findOne({ uid: id });
      if (user) {
        return res.render("admin/user_show", { user });
      }
      return res.redirect(
        `/admin/dashboard?error=${encodeURIComponent("User not found!")}`
      );
    } catch (e) {
      console.log(e);
    }
}
//////////////////
exports.saerch = async (req, res) => {
  //const { id } = req.query;
  const name = req.body.name
  try {
    const user =await User.findOne({name});

    //const user = await User.findOne({ uid: id, });
    if (User.updateSearchIndexser) {
      return res.render("admin/user_show", { user });
    }
    return res.redirect(
      `/admin/dashboard?error=${encodeURIComponent("User not found!")}`
    );
  } catch (e) {
    console.log(e);
  }
}


////
// exports.search =async (req,res)=>{
//   try{
//       const name = req.body.name
//       // const email = req.body.email
//       // const phone = req.body.phone
//       // const password = req.body.password

//       const user =await User.findOne({name});

//       if(user){

//         res.render('admin/user_show')

//           // return res.redirect(`/signup?error=${encodeURIComponent("User already exists. Please  log in with another mail!")}`)
          
//       }else{
//         return res.redirect(
//           `/admin/dashboard?error=${encodeURIComponent("User not found!")}`
//         );
//       // const hash = await bcrypt.hash(password,12);
//       // const user = await User.create(
//       //     {
//       //         name,
//       //         email,
//       //         password:hash,
//       //         phone
//       //     }
//       // )
//       // if (user) {
//       //     return res.redirect(
//       //       `/login?success=${encodeURIComponent("Successfully your account created.Please login")}`
//       //     );
//       // } 
//     }
//   }catch(e){
//       console.log(e);
//   }
// }
//////////////////////////
exports.destroyMe = (req,res)=>{
    req.session.destroy();
    return res.redirect("/admin/login");
}
