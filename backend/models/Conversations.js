const mongoose = require('mongoose');
const {Schema}=require('mongoose');

const ConversationsSchema = new Schema({ 
     members: {
        type: Array,
        required:true
     }
    });
module.exports= mongoose.model('conversations', ConversationsSchema);