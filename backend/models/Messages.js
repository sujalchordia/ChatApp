const mongoose = require('mongoose');
const {Schema}=require('mongoose');

const MessagesSchema = new Schema({ 
     conversationId: {
        type: String,
        required:true
     },
     senderId: {
        type: String,
        required:true
     },
     message: {
        type: String,
        required:true
     },
    });
module.exports= mongoose.model('messages', MessagesSchema);