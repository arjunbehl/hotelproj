const express=require('express');
const router=express.Router();
const {check,validationResult}=require('express-validator');
const User=require('../../Models/Users');
const gravatar=require('gravatar');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
const config=require('Config');
//@route  Post API/users
//@desc   Register  route
//@access public 
router.post('/',[
 check('name','name is required').not().isEmpty(),
 check('email','Please include a valid email').isEmail(),
 check('password','Please enter password of minimum 8 characters').isLength({min:6})
],
async (req,res)=>{
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }
const {name,email,password}=req.body;

    console.log(req.body);
    //res.send('User route');
try{
    // see if user exists
    let  user= await User.findOne({email});
    if(user){
        return res.status(400).json({errors:[{msg:'User already exists'}]})
    }
    //get users gravatar
    const avatar=gravatar.url(email,{
        s:'200',
        r:'pg',
        d:'mm'
    });

    user =new User({
        name,
        email,
        avatar,
        password
    });
    //encrypt the password
    const salt= await bcrypt.genSalt(10);
    user.password=await bcrypt.hash(password,salt);
    await user.save();
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
