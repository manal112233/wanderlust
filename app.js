const express=require("express");
const app=express();
const mongoose=require("mongoose");
const Listing=require("./models/listing.js");
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const ExpressError=require("./utils/ExpressError.js");





main().then(()=>{
console.log("connected to db")
})
.catch((err)=>{
    console.log(err);
});


async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));






app.get("/",(req,res)=>{
    console.log("root working")
});

//index route
app.get("/listings",async(req,res)=>{
    const allListings=await Listing.find({});
        res.render("listings/index.ejs",{ allListings});

    

    });
//new route
app.get("/listings/new",async(req,res)=>{
res.render("listings/new.ejs")
});
//create
app.post("/listings",async(req,res,next)=>{
try{
    if(!req.body.listing){
        throw new ExpressError(400,"send valid data for listing");
    }
const newListing=new Listing(req.body.listing);
await newListing.save();
res.redirect("/listings");
}catch(err){
    next(err);
}
});


//edit
app.get("/listings/:id/edit",async(req,res)=>{
    let{id}=req.params;
const listing=await Listing.findById(id);

    res.render("listings/edit.ejs",{listing});
    });

    //update

    app.put("/listings/:id",async(req,res)=>{
        let{id}=req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
res.redirect(`/listings/${id}`);
    });
    //show route
    app.get("/listings/:id",async(req,res)=>{
let{id}=req.params;
const listing=await Listing.findById(id);

res.render("listings/show.ejs",{listing});

    });

    //DELETE
    app.delete("/listings/:id",async(req,res)=>{
        let{id}=req.params;
       let deleteListing=await Listing.findByIdAndDelete(id);
       console.log(deleteListing)
       res.redirect("/listings");
    })


// app.get("/testListing",async (req,res)=>{
// let sampleListing=new Listing({
//     title:"my new villa",
//     description:"by the beach",
//     price:1200,
//     location:"kerala",
//     country:"india",
// });
//  await sampleListing.save();
//  console.log("sample saved");
//  res.send("sucessfultesting");

// })

app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"page not found"));
});
app.use((err,req,res,next)=>{
    let{statusCode=500,message="something went wrong"}=err;
    res.render("error.ejs",{message});
   //res.status(statusCode).send(message);
});

app.listen(8080,()=>{
console.log("server listening port 8080")
});