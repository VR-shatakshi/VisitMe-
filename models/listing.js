const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");
const { required } = require("joi");

const ListingSchema = new Schema ({
 title: {
    type:String,
      required:true,
 },
 description :{
     type:String ,
       required:true,
 },
  image :{
    type:String,
    required:true,
  },
  price:{
    type:Number,
      required:true,
  },
  location:{
    type:String,
    required:true,
  },
  country:{
    type:String,
    required:true,
  },
  reviews:[{
    type:Schema.Types.ObjectId,
    ref:"Review",
}
,],
  owner :{
    type:Schema.Types.ObjectId,
    ref:"User",
  },
  
  },
);

//post middleware 
ListingSchema.post("findOneAndDelete",async(listing)=>{
   if(listing){
    await Review.deleteMany({_id:{$in:listing.reviews}});
   }
});

const Listing = mongoose.model("Listing",ListingSchema);
module.exports = Listing;