const mongoose = require("mongoose");
const Listing = require("../models/listing.js");
const initData = require("./data.js");

const MONGO_URL ='mongodb://127.0.0.1:27017/VisitMe';

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

const initDb = async()=>{
    await Listing.deleteMany({});
    const ownerId = new mongoose.Types.ObjectId("6868fdf345d6a3d218877208"); // convert to ObjectId
    initData.data = initData.data.map((obj) => ({ ...obj, owner: ownerId }));
    await Listing.insertMany(initData.data);
    console.log("data is initialized");
};
 initDb();