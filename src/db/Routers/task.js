const express = require('express');
const Task = require('../models/task');
const router = new express.Router();
const auth = require('../middleware/auth')
const parser = require('body-parser')
router.use(parser.json())

router.post('/task',auth,async (req, res) => {
    const taskd = new Task({
        ...req.body,
        owner:req.user._id
    })
    
    try {
        await taskd.save();
        res.status(201).send(taskd)

    } catch (e) {
        res.status(404).send(e)
    }
});
router.get('/task',auth,async (req,res) =>{  
    const match ={}
    const sort ={}
    const all =req.query.completed
    if(all){
        match.completed= all === "true"

    }
    if(req.query.sortBy){
       const parts = req.query.sortBy.split(':')
       sort[parts[0]] = parts[1]==='desc'?-1:1
    }
    try{
     await req.user.populate({
         path:'tasks',
         match,
         options:{
             limit:parseInt(req.query.limit),
             skip:parseInt(req.query.skip),
             sort      
         }
     }).execPopulate();
    res.status(200).send(req.user.tasks)
    }catch(e){
        res.status(404).send(e)}
    })
   





router.get('/task/:id',auth,async (req, res) => {
    const _id = req.params.id
    try {
        const result = await Task.findOne({_id,owner:req.user._id })
        if(!result)
        return res.status(404).send()
    res.status(200).send(result)
    } catch (e) {
        res.status(403).send(e);
    }
})




router.patch('/task/:id', auth,async (req, res) => {
    const isValid = ['completed', 'description'];
    const reqdata = Object.keys(req.body);
    const operation = reqdata.every(data => isValid.includes(data));
    if (!operation) {
        return res.status(401).send({ error: "Invalid Operation" })
    }
    try {
        const finddoc = await Task.findOne({_id:req.params.id,owner:req.user._id});
        if(!finddoc){
            return res.status(404).send("No Such User Found")
        }
        reqdata.map(data=>{
           finddoc[data] = req.body[data];
        })
        await finddoc.save()
        res.send(finddoc)
       
        
    }
    catch (e) {
        res.send(e)
    }
})


router.delete('/task/:id',auth,async(req,res)=>{
    try{
   const deleted = await Task.findOneAndDelete({_id:req.params.id,owner:req.user._id})
   if(!deleted)
     return res.status(404).send({error:"No Such Task Found"})
   res.send("deleted data: "+deleted)
    }
    catch(e){res.send(e)}
})
module.exports = router;