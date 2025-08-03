const mongoose=require("mongoose");
const Review = require("./review.js");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title:{
        type : String,
        required : true
    },
        
    description:String,
    image: {
        url :String,
        filename : String,
    },
    price:Number,
    location:String,
    country:String,
    reviews:[
        {
            type : Schema.Types.ObjectId,
            ref :"Review"
        }
    ],
    owner : {
        type : Schema.Types.ObjectId,
        ref : "User" 
    },
    geometry: {
        type: {
            type: String, // 'Point'
            enum: ['Point'], // 'Point' is the only supported value
            required: true
        },
        coordinates: {
            type: [Number], // [longitude, latitude]
            required: true
        }
    },
    category: {
        type: String,
        enum: ['Boats', 'Camping', 'Farms', 'Iconic Cities','Mountains','Castles','Pools','Arctic','Forest']
    }
});

listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
     await Review.deleteMany({_id : {$in : listing.reviews}})
    }
    })

const Listing = mongoose.model("Listing",listingSchema);
module.exports = Listing;
