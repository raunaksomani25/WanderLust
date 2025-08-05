if(process.env.NODE_ENV != "production"){
    require('dotenv').config();

}



const express=require("express");
const app = express();
const mongoose=require("mongoose");
const path=require("path");
const methodOverride=require("method-override");
const ejsmate = require("ejs-mate");
const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");
const user = require("./routes/user.js");
const bookingRoutes = require("./routes/booking.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const ExpressError=require("./utils/ExpressError.js");
const flash=require("connect-flash");
const passport=require("passport");
const localStrategy=require("passport-local");
const User=require("./models/user.js");

const dbURL = process.env.ATLASDB_URL;

const store = MongoStore.create({
    mongoUrl: dbURL,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24 * 3600 
});

store.on("error",function(e){
    console.log("SESSION STORE ERROR",e);
});
const sessionOptions = {
    store,
    secret : process.env.SECRET,
    resave : false,
    saveUninitialized: true,
    cookie : {
        expires : Date.now()+1000*60*60*24*3,
        maxAge:1000*60*60*24*3,
        httpOnly: true
    }
};


app.use(session(sessionOptions));

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine('ejs',ejsmate);
app.use(express.static(path.join(__dirname,"/public")));
app.use(flash());


main().then(()=>{
    console.log("CONNECTION SUCCESFUL");
})
.catch(err => console.log(err)); 

async function main() {
  await mongoose.connect(dbURL);
}

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
})

// app.get("/demouser",async(req,res)=>{
//     let fakeuser=new User({
//         email:"abc@gmail.com",
//         username:"abc"
//     });
//     //pbkdf2 hashing algo
//     let newuser = await User.register(fakeuser,"helloworld");
//     res.send(newuser);
// });



app.use("/listings",listings);
app.use("/listings/:id/reviews",reviews);
app.use("/",user);
app.use("/", bookingRoutes);

app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"PAGE NOT FOUND"));
})

app.use((err,req,res,next)=>{
    let {status = 500,message = "SOME ERROR"} = err;
    res.status(status).render("error.ejs",{err});
})


app.listen(3010,()=>{
    console.log("LISTENING");
});
