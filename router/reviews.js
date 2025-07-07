const express = require("express");
const router  = express.Router({mergeParams:true});
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js")
const ExpressError = require("../utils/ExpressError.js");
const { reviewSchema} = require("../server.js");
const Review = require("../models/review.js");
const { loggedin, isReviewauthor } = require("../middle.js");

const reviewcontroller = require("../controllers/review.js");



const validateReview = (req,res,next)=>{
    let{error}= reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError (400,errMsg);
    }else {
        next();
    }
};

//review route 
router.post ("/",loggedin, validateReview,wrapAsync(reviewcontroller.creatreview));

router.delete("/:reviewId",loggedin,isReviewauthor,
     wrapAsync(reviewcontroller.deletereview));


module.exports = router ;