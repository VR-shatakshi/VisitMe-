require('dotenv').config();
if (process.env.NODE_ENV !=" production"){
   console.log(process.env);
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");

const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const Joi = require("joi");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const Passport = require("passport");
const LocalStraegy = require("passport-local");
const User = require("./models/user.js");

const db = process.env.ATLAS_URL ;

const listings = require("./router/listings.js");
const reviews = require("./router/reviews.js");
const users = require("./router/users.js");

main().
then(()=>{
    console.log("connected to db");
})
.catch((err)=>{
    console.log(err);
});

async function main(){
    await mongoose.connect(db);
}



app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true }));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"public")));


const store = MongoStore.create({
   mongoUrl:db,
   crypto:{
    secret:"mysecretcode",
   },
   touchAfter: 24*3600,
});


store.on ("error",(error)=>{
  console.log("error occured",error);

});

const sessionOptions = {
  store ,
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
app.get("/", (req, res) => {
  res.send("Hi, I am there!");
});
app.use("/",users);
app.use("/listings",listings);
app.use("/listing",listings);
app.use("/listings/:id/reviews",reviews);





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
 
