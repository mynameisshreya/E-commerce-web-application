
const port =4000;
const express =require("express");
const app=express();
const mongoose=require("mongoose");
const jwt=require("jsonwebtoken");
const multer = require("multer");
const path=require("path");
const cors=require("cors");
const nodemailer = require("nodemailer");
app.use(express.json());
app.use(cors());


//Database connection with MongoDB
mongoose.connect("mongodb://localhost:27017/E-commerce");
//API creation
app.get("/",(req,res)=>{
    res.send("Express App is Running")

})
//Image Storage Engine
const storage = multer.diskStorage({
    destination:'./upload/images',
    filename:(req,file,cb)=>{
    return cb(null,`${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
})
const upload=multer({storage:storage})

//creating upload Endpoint for images
app.use('/images',express.static('upload/images'))
app.post("/upload",upload.single('product'),(req,res)=>{
    res.json({
        success:1,
        image_url:`http://localhost:${port}/images/${req.file.filename}`
    });
})
//schema for creating product 
const Product =mongoose.model("Product",{
    id:{
        type:Number,
        require:true,

    },
    name:{
        type:String,
        required:false
    },
    image:{
type:String,
required:false
    },
    category:{
        type:String,
        required:false
    },
    new_price:{
        type:Number,
        required:false
    },
    old_price:{
type:Number,
required:false
    },
    date:{
        type:Date,
        default:Date.now,
    },
    available:{
        type:Boolean,
        default:false
    },
    })
    app.post('/addproduct',async(req,res)=>{
        let products=await Product.find({});
        let id;
        if(products.length>0){
            let last_product_array=products.slice(-1);
            let last_product=last_product_array[0];
            id=last_product.id+1;
        }
        else{
            id=1;
        }
const product=new Product({
    id:id,
    name:req.body.name,
    image:req.body.image,
    category:req.body.category,
    new_price:req.body.new_price,
    old_price:req.body.old_price,

});
console.log(product);
await product.save();
console.log("save");
res.json({
    success:true,
    name:req.body.name,
})
})
//deleting

app.post('/removeproduct',async(req,res)=>{
await Product.findOneAndDelete({id:req.body.id});
console.log("removed");
res.json({
    success:true,
    name:req.body.name


})
    })
    //creating Api for getting all product
    app.get('/allproducts',async(req,res)=>{
        let products=await Product.find({});
        console.log("All products fetched");
        res.send(products);
    })


//  //schema creating for user model 
 const Users = mongoose.model('Users',{
    name:{
        type:String,
    },
    email:{
        type:String,
        unique:true,
    },
    password:{
        type:String,
    },
    cartData:{
        type:Object,
    },
    date:{
        type:Date,
        default:Date.now,
    }
 }) 
// creating endpoint for registering the user
 app.post('/signup',async(req,res)=>{
    let check=await Users.findOne({email:req.body.email});
    if(check){
        return res.status(400).json({success:false,errors:"existing user found with same email address"})
    }
    let cart={};
    for(let i=0; i<300;i++){
       cart[i]=0; 
    }
    const user=new Users({
        name:req.body.username,
        email:req.body.email,
        password:req.body.password,
        cartData:cart,
    })
    await user.save();
    const data={
        user:{
            id:user.id
        }
    }
    const token=jwt.sign(data,'secret_ecom');
    res.json({success:true,token})
 }) 
// creating endpoint for user login
 app.post('/login',async(req,res)=>{
    console.log("login called")
let user=await Users.findOne({email:req.body.email});
console.log("user",user)
if(user){
    const passCompare = req.body.password === user.password;
    if(passCompare){
        const data={
            user:{
                id:user.id,
               email:user.email
            }
        }
        const token=jwt.sign(data,'secret_ecom');
    res.json({success:true,token})
    }
else{
    res.json({success:false,errors:"wrong password"});

}
}
else{
    res.json({success:false,errors:"wrong Email Id"})
}
 })
//creating endpoin for newcollection data
app.get('/newcollection',async(req,res)=>{
    let products=await Product.find({});
    let newcollection=products.slice(1).slice(-8);
    console.log("newcollection fetched");
    res.send(newcollection);
})

//cerating endpoin for popular in women section
app.get('/popularinwomen',async(req,res)=>{
    let products= await Product.find({category:"women"});
    let popular_in_women=products.slice(0,4);
    console.log("popular in women fetched")
    res.send(popular_in_women);

})
//cerating middelware to fetch user
const fetchUser = async(req,res,next)=>{
    const token = req.header('auth-token');
    if(!token){
        res.status(401).send({errors:"Please authonticate using valid token"})
    }
    else{
        try{
            const data = jwt.verify(token,'secret_ecom');
            req.user=data.user;
            next();

        }catch(error){
    res.status(401).send({errors:"Please authenticate using a valid token"})

        }
    }

}



//cerating endpoint for adding product in cartdata
app.post('/addtocart',fetchUser,async(req,res)=>{
    console.log("Added",req.body.itemId);
   let userData=await Users.findOne({_id:req.user.id});
   userData.cartData[req.body.itemId] += 1;
   await Users.findOneAndUpdate({_id:req.user.id},{cartData:userData.cartData})
   res.send("Added")
})
//creating endpoint for removing product in cartitem
app.post('/removefromcart',fetchUser,async(req,res)=>{
    console.log("remove",req.body.itemId)
    let userData=await Users.findOne({_id:req.user.id});
    if( userData.cartData[req.body.itemId]>0)
    userData.cartData[req.body.itemId] -= 1;
    await Users.findOneAndUpdate({_id:req.user.id},{cartData:userData.cartData})
    res.send("Removed")
})
//creating endpoint to get cart
app.post('/getcart',fetchUser,async(req,res)=>{
    console.log("GetCart",req.body.itemId);
    let userData=await Users.findOne({_id:req.user.id});
    res.json(userData.cartData)
})



app.post('/order',async(req,res)=>{
    console.log("send Email called")
    const {email} = req.body
    console.log(email)
if(!email){
    return res.status(400).json({message:"Email is required"});
}
const transporter=nodemailer.createTransport({
    service:"Gmail",//e.g., Gmail.outlook
    auth:{
        user:"shreyatripathi0301@gmail.com",
        pass:"cdsy bnfw pddw syeu"
    },
});
//Email option
const mailOptions={
    from:"shreyatripathi0301@gmail.com",
    to:email,
    subject:"Shoping",
    text:"thank you for ordering",
};
try{
    await transporter.sendMail(mailOptions);
    res.status(200).json({message:"Email sent successfully"})
    console.log("Email sent success")
}catch(error){
    console.error("Error sending email:",error);
    res.status(500).json({message:"Error sending email"});
}
})





app.listen(port,(error)=>{
    if(!error){
        console.log("server is running on port "+port);
    }else{
        console.log("Error : "+error);
    }
})