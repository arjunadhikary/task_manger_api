const express = require('express');
const Users =  require('../models/user');
const router = new express.Router();
const auth = require('../middleware/auth');
const multer = require('multer')
const sharp = require('sharp');
const {welcomeMessage,seeuMessage}=require('../accounts/account')


//Creating New Users
router.post('/users', async(req, res) => {
    const user =  new Users(req.body)
 
    try{ 
        await user.save();
        welcomeMessage(req.body.Email,req.body.name)

        const token = await user.getToken();   
        res.send({user,token})
   
 }
 catch(E){res.send(E)}
 
 });
 //Log In 
router.post('/users/login',async(req,res)=>{
  
    try{
    const user = await Users.findByCredentials(req.body.Email,req.body.Password)
    const token= await user.getToken();   
        res.send({user,token})
    }catch(error){
        res.status(401).send({Error:"Error Logging",error})
    }
})

router.get('/users/me',auth,async (req,res)=>{
    res.send(req.user)
})




//LOGOUT
router.post('/logout',auth,async(req,res)=>{
    try{
        req.user.tokens = req.user.tokens.forEach(token=>{
            return token.token !==req.token
           
        })
       await req.user.save()
        res.status(201).send("logged Out")

    }catch(e){
        res.send(e);

    }
})
router.post('/users/logout/all',auth,async(req,res)=>{
    try {
        req.user.tokens =[];
         req.user.save();
         res.send('Looged Out Of All')
        
    } catch (error) {
        res.send(error)
    }
})

router.patch('/users/me', auth,async (req, res) => {
    const isallowed = ['Email', 'Password'];
    const entity = Object.keys(req.body);
    const isValid = entity.every(data => isallowed.includes(data));
    if (!isValid)
        return res.status(401).send('Invalid Operation')

    try {
        entity.forEach(entry=>{ req.user[entry] = req.body[entry]});
        await req.user.save()

        res.status(201).send()
    }
    catch (e) { res.status(404).send(e) };

})
const upload = multer({
    limits:{
        fileSize:1000000 
    },
    fileFilter(req,file,call){
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            return call(new Error("Please Provide Valid Word File"))

        }
        call(undefined,true)
    }
})
router.post('/users/me/avatar',auth,upload.single('avatar'),async(req,res)=>{
  
        const image = await sharp(req.file.buffer,{
            failOnError:false 
        }).resize({
            height:200,
            width:200
        }).png().toBuffer();
        req.user.avatar = image
  
    await req.user.save()
    res.send('Saved')
},(error,req,res,next)=>{
    res.status(404).send(error.message)
})
router.get('/users/:id/avatar',async(req,res)=>{

        try{
            const user = await Users.findById(req.params.id)
            if(!user || !user.avatar){
                throw new Error("No Image Found")
            }
            res.set('Content-Type','image/png')
            res.send(user.avatar)
         
        }catch(e){
            res.status(404).send()

        }



})
//delete Profile
router.delete('/users/me/avatar',auth,async(req,res)=>{
    try {
        req.user.avatar = undefined
        req.user.save()
        res.send('Deleted')        
    } catch (error) {
        res.status(404).send(error)
    }
 
})

router.delete('/users/me',auth,async(req,res)=>{
    try{
        
  const deleted = await req.user.remove();
  seeuMessage(req.user.Email,req.user.Name)
    res.send(deleted)
    }
    catch(e){
        res.send(e)
    }
})

module.exports = router