const express=require('express');
const router=express.Router();


//@route  Post API/users
//@desc   Test  route
//@access public 
router.post('/',(req,res)=>res.send('User route'));

module.exports=router;
