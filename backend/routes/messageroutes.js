const express=require("express");
const router=express.Router();
const Conversations=require("../models/Conversations");
const Users = require("../models/Users");
const Messages = require("../models/Messages");


router.post("/conversation", async (req, res) => {
    try {
        const { senderid, recieverid } = req.body;
        const conversation = new Conversations({
            members: [senderid, recieverid]
        });

        await conversation.save();
        // res.status(200).json("Conversation created successfully");
        res.status(200).json(conversation._id)
    } catch (err) {
        console.log(err, 'ERROR!');
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.post("/messages", async (req, res) => {
    try {
        const { senderid, recieverid = "", conversationId, message } = req.body;

        // if (!conversationId && recieverid) {
        //     const newConversation = new Conversations({
        //         members: [senderid, recieverid]
        //     });
        //     await newConversation.save();

        //     const newMessage = new Messages({
        //         senderId: senderid,
        //         conversationId: newConversation._id,
        //         message: message
        //     });

        //     await newMessage.save();
        //     return res.status(200).json("message sent succesfully");
        // }

        const newMessage = new Messages({
            senderId: senderid,
            conversationId: conversationId,
            message: message
        });

        await newMessage.save();
        res.status(200).json("message sent succesfully");
    } catch (err) {
        console.log(err, 'ERROR!');
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


router.get("/messages/:conversationId", async (req, res) => {
    try {
        const {conversationId} = req.params;
        if(conversationId==="new"){
            return res.json([]);
        }
        const messages=await Messages.find({conversationId});
        const messageUserData= await Promise.all(messages.map(async(message)=>{
            const user= await Users.findById(message.senderId)
            return {user:{
                email:user.email,
                name:user.name,
                _id:user._id
            },message:message.message
        }}))
        res.status(200).json(await messageUserData)
    } catch (err) {
        console.log(err, 'ERROR!');
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get("/conversation/:userId",async(req,res)=>{
    try{
        const{userId}=req.params;
        const conversations=await Conversations.find({ members :{$in : [userId]}});
        const userDataconversation=await Promise.all(conversations.map(async(conversation)=>{
            const recieverId=conversation.members.find((members)=>members!=userId)
            if(recieverId){
                const userDetails=await Users.findById(recieverId)
                return{ 
                    user:{ email :userDetails.email, name:userDetails.name ,id:userDetails._id},
                    conversationId:conversation._id
                }
            }

        }))
        res.status(200).json( userDataconversation);
    }
    catch(err){
        res.status(500).json(err,"ERRORRR");
    }
})

module.exports=router