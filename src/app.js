const express = require("express");
const app = express();
const path = require("path");
const User = require("./models/usermsg");
const port = process.env.PORT || 3000;
require("./db/conn");
const hbs = require('hbs');
const { registerPartials } = require('hbs');

//setting the path
const staticpath = path.join(__dirname, "../public");
// Note : Express uses top to bottom approach....it will first render html page and does not reach to the routing part
const templatepath = path.join(__dirname,"../templates/views"); // we have to tell express application that we have moved the "views" folder into "template > views"
const partialspath = path.join(__dirname,"../templates/partials")
// console.log(path.join(__dirname, "../public"));

//middleware
app.use(express.static(staticpath));

// this is a method to include bootstrap and jquery in node application 
app.use("/css", express.static(path.join(__dirname, "../node_modules/bootstrap/dist/css")));
// now in index.hbs we only have to define the path in "link rel".... as "/css" instead of writing long path of node_modeules
app.use("/js", express.static(path.join(__dirname, "../node_modules/bootstrap/dist/js")));
app.use("/jq", express.static(path.join(__dirname, "../node_modules/jquery/dist")));

app.use(express.urlencoded({extended: false})); // this is to show the data in the "POST" request in the database. very important to display data in mongo compass
app.set("view engine", "hbs");
app.set("views",templatepath); // we have to tell express application that we have moved the "views" folder into "template > views"
hbs.registerPartials(partialspath);
 
//routing
//app.get(path,callback)

app.get("/",(req,res)=>{
    res.render("index");
});

// app.get("/contact",(req,res)=>{ 
//     res.render("contact");
// })

app.post("/contact",async(req,res) => {
    try {
        // res.send(req.body);

        //saving user filled data to DB
        const userData = new User(req.body); // here we get the data from contact us page filled by the user and store it in collection named userData
        await userData.save(); // saving the data
        res.status(201).render("index"); // rendering home page
    } catch (error) {
        res.status(500).send(error);    
    }
})


//create server

app.listen(port,()=>{
    console.log(`Server is running at port no. ${port}`);
})