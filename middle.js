const Listing = require("./models/listing.js");
const Review = require("./models/review.js");


module.exports.loggedin =(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl ;
        req.flash("error","You must Logged in to Create");
        return res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

module.exports.isOwner = async(req,res,next)=>{
 let {id} = req.params ;
  let listing = await Listing.findById(id);
  if(!listing.author.equals(res.locals.currUser._id)){
    req.flash("error","You are not the owner of this listing");
    return res.redirect(`/listing/${id}`)
  }
   next();
};

module.exports.isReviewauthor = async(req,res,next)=>{
  let {id ,reviewId} = req.params ;
  let review = await Review.findById(reviewId);
  if(!review.author.equals(res.locals.currUser._id)){
    req.flash("error","You are not the author of this review");
    return res.redirect(`/listings/${id}`)
  }
   next();
};