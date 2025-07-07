const User = require("../models/user");

module.exports.signup = (req,res)=>{
  console.log("signup is reached");
  res.render("users/signup.ejs");
};

module.exports.createsignup = async(req,res)=>{
 try {
    let {username, email,password} = req.body ;
    const newUser = new User({email,username});
    const registered = await User.register(newUser,password);
    console.log(registered);
    req.login((registered),(err)=>{
     if(err){
       return next(err);
     }
     req.flash("success","Welcome to VisitMe");
    res.redirect("/listings");
    });   
 }
 catch(e){
    req.flash("error",e.message);
    res.redirect("/signup");
 }
};

module.exports.login =(req,res)=>{
  res.render("users/login.ejs");
};

module.exports.createlogin = async(req,res)=>{
  req.flash("success","welcome to VisitMe"); 
  let redirectUrl = res.locals.redirectUrl || "/listings";
  res.redirect(redirectUrl);
  
};

module.exports.createlogout = (req,res,next)=>{
  req.logout((err)=>{
    if(err){
      return next(err);
    }
    req.flash("success","You are Logged Out");
    res.redirect('/listings');
  });
};