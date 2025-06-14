const mongoose = require("mongoose");
const data = require("./data.js");
const Listing = require("../models/listing.js");

main().then(()=>{
    console.log("CONNECTION SUCCESFUL");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

const initDB =async() =>{
    await Listing.deleteMany({});
    data.data = data.data.map((obj)=>({...obj,owner:'66a0794c4374fc2758247f1b'}));
    await Listing.insertMany(data.data);
    console.log("DATA INITIALIZED");

}

initDB();