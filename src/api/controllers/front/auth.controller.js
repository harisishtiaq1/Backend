const User = require("../../models/users.model");
const bcrypt=require("bcryptjs")
const nodemailer=require("nodemailer")
const crypto=require("crypto")
const jwt=require("jsonwebtoken")
const generateToken = (id) => {
  return jwt.sign({id},process.env.JWT,{
    expiresIn:'3d',
  })
}
var transporter=nodemailer.createTransport({
  service:"gmail",
  auth:{
    user:"harisharry232@gmail.com",
    pass:"cewhgiaykiatxcpi"
  },
  tls:{
    rejectUnauthorized:false
  }
})
exports.register = async (req, res, next) => {
  try {
    const { Name,Email,Password} = req.body;
    if(!Name || !Email || !Password){
    res.json("Please add all fields")
  } 
  const userExists=await User.findOne({Email})
  if(userExists){
    res.json("Gmail already Exists")
}
    const salt=await bcrypt.genSalt(10)
    const hashPassword= await bcrypt.hash(Password,salt)
    const user=await User.create({
  Name,
  Email,
  Password:hashPassword,
  emailToken:crypto.randomBytes(64).toString('hex'),
  isVerified:false
})
if(user){
  res.status(201).json({
    _id:user.id,
    Name:user.Name,
    Email:user.Email,
    token:generateToken(user._id)
  })
}
else{
  res.json("Invalid Data")
}
var mailOption={
  from:'"Verify your email" <harisharry232@gmail.com>',
  to:user.Email,
  subject:'E-HELP Verify your email',
  html:`<h2>${user.Name}! Thank you for registering on E-HELP</h2>
  <h4>Please Verify your email to continue...</h4>
  <a href="http://${req.headers.host}/v1/front/auth/verify-email?token=${user.emailToken}">Verify Your Email</a>`
}
console.log(req.headers.host);
transporter.sendMail(mailOption,function(error){
  if(error){
    console.log(error)
  }
  else{
    console.log('A Verification Link has been sent to your Respected email');
  }
})
  } catch (error) {
    console.log(error);
    return next(error);
  }
};
exports.verify =async(req,res)=>{
  try{
    const token=req.query.token
    const user=await User.findOne({emailToken:token})
    if(user){
      user.emailToken=null;
      user.isVerified=true;
      await user.save();
      res.json("User is Verified")
    }
    else{
      res.json("User is not Verified Please verify First")
    } 
  }
  catch(error){
    console.log(error);
  }
}
exports.login = async (req,res)=>{
  try{
    const {Email,Password}=req.body;
  const user = await User.findOne({Email})
  if(user && (await bcrypt.compare(Password, user.Password)) && user.isVerified){
    res.json({
      _id:user.id,
      Name:user.Name,
      Email:user.Email,
      token:generateToken(user._id)
    })
  }
  else{
      res.json("You are not verified")
    }   
  }
  catch(error){
    console.log(error);
  }
}
