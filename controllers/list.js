const mongoose = require("mongoose");
const Listing = require("../models/listing.js");


module.exports.index = async (req, res) => {
  const { q } = req.query;
  let allListings;

  if (q) {
    // Case-insensitive partial match on title or description
    allListings = await Listing.find({
      $or: [
        { title: new RegExp(q, 'i') },
        { description: new RegExp(q, 'i') }
      ]
    });
  } else {
    allListings = await Listing.find({});
  }
  


  res.render("listings/index.ejs", { allListings });
};


module.exports.show = async(req,res)=>{
    let {id} = req.params ;
    if (!mongoose.Types.ObjectId.isValid(id)) {
    req.flash("error", "Invalid listing ID");
    return res.redirect("/listings");
  }
    const listing = await Listing.findById(id).populate({path:"reviews",populate:{path:"author"}})
  .populate("owner");
    if (!listing) {
    req.flash("error", "Listing not found");
    return res.redirect("/listings");
  }
    res.render("listings/show.ejs",{ listing, currUser:req.user});
};


module.exports.create = async(req,res)=>{
    const newListing = new Listing(req.body.listing);
   newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success","New listing is created");
    res.redirect("/listings");
};

module.exports.edit = async(req,res)=>{
     let {id} = req.params ;
     if (!mongoose.Types.ObjectId.isValid(id)) {
    req.flash("error", "Invalid listing ID");
    return res.redirect("/listings");
  }
    const listing = await Listing.findById(id);
    if (!listing) {
    req.flash("error", "Listing not found");
    return res.redirect("/listings");
  }
    req.flash("success","Listing is Edited");
    res.render("listings/edit.ejs",{listing});
};

module.exports.update = async(req,res)=>{
    let {id} = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
    req.flash("error", "Invalid listing ID");
    return res.redirect("/listings");
  }
  
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    req.flash("success","Listing is Updated");
    res.redirect(`/listings/${id}`);
};

module.exports.delete = async(req,res)=>{
    let {id} = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
    req.flash("error", "Invalid listing ID");
    return res.redirect("/listings");
  }
    const deletelisting = await Listing.findByIdAndDelete(id);
    console.log(deletelisting);
    req.flash("success","Listing is deleted");
    res.redirect("/listings");
};