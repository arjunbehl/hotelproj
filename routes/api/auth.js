const express=require('express');
const router=express.Router();
const auth=require('../../middleware/auth');
const User=require('../../Models/Users')
const {check,validationResult}=require('express-validator');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
const config=require('Config');
//@route  get api/auth
//@desc   Test  route
//@access public 
router.get('/',auth,async (req,res)=>{
try{
    const user=await User.findById(req.user.id).select('-password');
    res.json(user);
}catch(err){
    console.error(err.message);
    res.status(500).send('Server error');
}
});
//@route  Post api/auth
//@desc   Authentication
//@access public 
router.post('/',[
    check('email','Please include a valid email').isEmail(),
    check('password','Password is required').exists()
   ],
   async (req,res)=>{
       const errors=validationResult(req);
       if(!errors.isEmpty()){
           return res.status(400).json({errors:errors.array()});
       }
   const {email,password}=req.body;
   
       console.log(req.body);
       //res.send('User route');
   try{
       // see if user exists
       let  user= await User.findOne({email});
       if(!user){
           return res.status(400).json({errors:[{msg:'Invalid Credentials'}]})
       }
       const isMatch= await bcrypt.compare(password,user.password);
       if(!isMatch){
           return res.status(400).json({errors:[{msg:'Password incorrect'}]}) 
       }
      
       const payload=
       {
           user:{
               id:user.id
           }
       }
       
       jwt.sign(
           payload,
           config.get('jwtSecret'),
           {expiresIn:3600000},
           (err,token)=>{
               if(err) throw err;
               res.json({token});
           });
     
       //return the json webtoken
   }
   catch(err){
       console.error(err.message);
       res.status(500).send("Server Error");
   }
   });
   
   module.exports=router;
   