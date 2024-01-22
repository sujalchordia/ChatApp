const mongoose = require('mongoose');
const {Schema}=require('mongoose');

const Userschema = new Schema({ 
     name: {
        type: String,
        required:true
     },
     email: {
        type:String,
        required:true
     },
     password: {
        type:String,
        required:true
     },
     date: {
        type:Date,
        default:Date.now
     },
     image:{
         public_id:{
            type:String,
            required:true
         },
         url:{
            type:String,
            required:true
         }
     }
    });
module.exports= mongoose.model('users', Userschema);