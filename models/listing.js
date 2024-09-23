const mongoose=require("mongoose");
const  Schema=mongoose.Schema;

const listingSchema=new Schema({
    title:{
        type:String,
        required:true
    },
    description:String,
    image:{
        filename:String,
        url:{
            type:String,
       
        default:"https://unsplash.com/photos/a-rock-formation-on-a-beach-near-the-ocean-eMNoQ3ovO4c",
        set:(v)=>v==="" ?"https://unsplash.com/photos/a-rock-formation-on-a-beach-near-the-ocean-eMNoQ3ovO4c":v,
        },
    
    },
    price:Number,
    location:String,
    country:String,
});

const listening=mongoose.model("Listing",listingSchema);
module.exports=listening;