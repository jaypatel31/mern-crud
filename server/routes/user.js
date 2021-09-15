const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const User = mongoose.model("User")

router.get('/allusers',(req,res)=>{
    User.find()
    .then(result=>{
        return res.status(200).json({users:result})
    })
    .catch(err=>{
        console.log(err)
    })
})

router.post('/createuser',(req,res)=>{
    const {name,username,email,phone} = req.body

    if(!name || !username || !email || !phone){
        return res.status(422).json({error:"Please fill all the details"})
    }

    const user = new User({
        name,
        username,
        email,
        phone
    })
    
    user.save().then(result=>{
        return res.status(201).json({user:result})
    })
    .catch(e=>{
        console.log(e)
    })

})

router.put('/updateuser',(req,res)=>{
    const {name,username,email,phone, userId} = req.body

    if(!name || !username || !email || !phone){
        return res.status(422).json({error:"Please fill all the details"})
    }

    User.findOneAndUpdate({_id:userId},{
        $set:{name,username,email,phone}
    },{
        new:true
    })
    .exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }
        res.status(201).json(result);
    })

})

router.delete('/deleteuser/:id',(req,res)=>{
    const userId = req.params.id

    User.findOne({_id:userId})
    .exec((err,user)=>{
        if(err || !user){
            return res.status(422).json({error:err})
        }
        user.remove()
        .then(result=>{
            return res.status(200).json({result})
        })
        .catch(e=>{
            console.log(e)
        })
    })
})

module.exports = router
