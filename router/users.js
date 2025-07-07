const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js");
const User = require("../models/user");
const passport = require("passport");
const { saveRedirectUrl } = require("../middle.js");

const usercontroller = require("../controllers/user.js");

router.get("/signup",usercontroller.signup);

router.post("/signup", wrapAsync(usercontroller.createsignup));

router.get("/login",usercontroller.login);

router.post("/login",
  saveRedirectUrl,
  passport.authenticate("local",{failureRedirect:"/login",failureFlash:true, }),
  usercontroller.createlogin);

router.get("/logout",usercontroller.createlogout);

module.exports = router;