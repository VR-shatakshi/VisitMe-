const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const MONGO_URL ='mongodb://127.0.0.1:27017/VisitMe';
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const Joi = require("joi");
const session = require("express-session");
const flash = require("connect-flash");
const Passport = require("passport");
const LocalStraegy = require("passport-local");
const User = require("./models/user.js");


const listings = require("./router/listings.js");
const reviews = require("./router/reviews.js");
const users = require("./router/users.js");

main().
then(()=>{
    console.log("connected to db");
})
.catch(()=>{
    console.log(err);
});

async function main(){
    await mongoose.connect(MONGO_URL);
}

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true }));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));



const sessionOptions = {
  secret :"mysecretcode",
  resave :false , 
  saveUninitialized:true,
  cookie:{
    expires:Date.now()+7*24*60*60*1000,
    maxAge:7*24*60*60*1000,
    httpOnly:true,
  },
};

app.use(session(sessionOptions));
app.use(flash());

app.use(Passport.initialize());
app.use(Passport.session());
Passport.use(new LocalStraegy(User.authenticate()));
Passport.serializeUser(User.serializeUser());
Passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

app.use("/",users);
app.use("/listings",listings);
app.use("/listing",listings);
app.use("/listings/:id/reviews",reviews);



app.get("/", (req, res) => {
  res.send("Hi, I am there!");
});

/*app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page not Found "));
});*/



app.use((err,req,res,next)=>{
    let {statusCode=500 , message="something went wrong"}= err;
    res.status(statusCode).render("error.ejs",{message});
});


app.listen(8080, () => {
  console.log("Server is listening to port 8080");
});
 