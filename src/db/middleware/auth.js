const jwt= require('jsonwebtoken');
const User = require('../models/user');
const auth = async(req,res,next)=>{
   try{
    const token = req.header('Authorization').replace("Bearer ","");
    const decoded = jwt.verify(token,process.env.PRIVATE_KEY);
    const user = await User.findOne({_id:decoded._id , 'tokens.token':token});
    if(!user){
        throw new Error();
    }
    req.token = token
    req.user = user;
   next();
    }catch(e){
        res.send({Error:"Error Connecting Invalid User!!!"})
       
   }
}

module.exports =auth