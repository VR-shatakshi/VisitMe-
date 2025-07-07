const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js")
const ExpressError = require("../utils/ExpressError.js");
const {ListingSchema} = require("../server.js");
const {loggedin} = require("../middle.js");
const {isReviewauthor} = require("../middle.js")


const listcontroller = require("../controllers/list.js");

const validateListing = (req,res,next)=>{
    let{error}=ListingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError (400,errMsg);
    }else {
        next();
    }
};

// index route 
router.get ("/", wrapAsync(listcontroller.index));

//new route 
router.get("/new",loggedin,(req,res)=>{
   res.render("listings/new.ejs");
});

// show route 
router.get("/:id",loggedin, wrapAsync(listcontroller.show));

//create route 
router.post("/",validateListing,loggedin, wrapAsync(listcontroller.create));

//edit route 
router.get("/:id/edit",loggedin,wrapAsync(listcontroller.edit));

// update route 
router.put("/:id",loggedin,validateListing, wrapAsync(listcontroller.update));

// Delete route 
router.delete("/:id",loggedin,wrapAsync(listcontroller.delete));

module.exports = router ;