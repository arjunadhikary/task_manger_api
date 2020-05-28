const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Task = require('../models/task')
const userSchema = new mongoose.Schema({
    Name:{
     type:String,
     trim:true,
     required:[true,'Enter your Valid Name']
    },
    Age:{
        type:Number,
        trim:true,
        required:[true,'Enter your Valid Age'],
        validate(value){
            if(value<12){
                throw new Error('Sorry Too Young To Use Our Services')
            }
        }
},
    Email:{
        type:String,
        trim:true,
        unique:true,
        required:[true,'Email is Required'],
               validate(value){
                  if(!validator.isEmail(value))
                    throw new Error("Invalid Email");
                },
          },
    Password:{
        type:String,
        trim:true,
        minlength:7,
             validate(value){
                if(value.toLowerCase().includes('password'))
                    throw new Error("Type Strong Password")
            }
    },
    avatar:{
        type:Buffer
    },
    tokens:[
        {
        token:{
        type:String,
        required:true
        }
    }
]
    
},{
    timestamps:true
});
userSchema.virtual('tasks',{
    ref:'task',
    localField:'_id',
    foreignField:"owner"
})

userSchema.methods.getToken = async function(){
 const user = this;
 const token = jwt.sign({ _id : user._id.toString()},process.env.PRIVATE_KEY);
 user.tokens = user.tokens.concat({token})
 await  user.save()
 return token;
  
}
userSchema.methods.toJSON = function(){
    const user = this
    const userObj = user.toObject()
   delete userObj.Password
   delete userObj.tokens
   return userObj
}



userSchema.statics.findByCredentials = async(Email,Password)=>{
   const users=  await Users.findOne({Email})
    if(!users)
    throw new Error("Error Logging In");
    const compared = await bcrypt.compare(Password,users.Password)
   if(!compared)
    throw new Error("Error Login");    
    return users

}

userSchema.pre('save',async function(next){
    const user = this;
    if(user.isModified('Password')){
       user.Password =  await bcrypt.hash(user.Password,8);
    }
    
    next();
    

});
userSchema.pre('remove',async function(next){
    const user = this;
    await Task.deleteMany({owner:user._id})
    next();

})
const Users = mongoose.model("Users",userSchema)

module.exports = Users
