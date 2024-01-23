const express = require('express')
const app = express()
const port = 5000
const cors = require("cors");
const socketIo =require('socket.io')
// socket.io server side set up
let users=[]
const io=socketIo(8080,{
  cors:{
    origin:"http://localhost:3000"
  }
})
io.eio.pingTimeout = 120000; // 2 minutes
io.eio.pingInterval = 5000;  // 5 seconds

const mongoDB=require("./db");
const Users = require('./models/Users');
mongoDB()
app.get('/', (req, res) => {
  res.send("hello world")
})

//middleware
app.use(cors());
app.use((req,res,next)=>{
res.setHeader("Access-Control-Allow-Origin","http://localhost:3000");
res.header(
    "Access-Control-Allow-Headers",
    "Origin,X-Requested-With,Control-Type, Accept"
);
next();
});
// Socket.io
io.on("connection",socket=>{
  socket.on("addUser",userId=>{
    const isUserExist=users.find(user=>user.userId===userId)
    if(!isUserExist){
      const user={userId,socketId:socket.id,status:"Online"}
      users.push(user);
      io.emit("getUsers",users)
    }
  })
  socket.on("sendMessage",async ({senderid,recieverid,conversationId,message})=>{
    console.log(recieverid,"reciever id",senderid,"semder_id")
    const reciever =users.find(user=>user.userId===recieverid)
    const sender=users.find(user=>user.userId===senderid)
    const user= await Users.findById(senderid);
    if(reciever && sender){
         socket.to(reciever.socketId).emit("getMessage", {
            senderid,
            recieverid,
            conversationId,
            message,
            user: { _id: user._id, email: user.email, name: user.name }
        });
      }
   })

   socket.on('newConversation', (data) => {
    const { reciever_id } = data;

    // Assuming you have a function to retrieve the socket ID of the receiver
    const reciever =users.find(user=>user.userId===reciever_id)

    // If the receiver is connected, emit the 'loadConversations' event to that specific socket
    if (reciever) {
      io.to(reciever.socketId).emit('loadConversations');
    }

    console.log(`New conversation initiated with user ID: ${reciever_id}`);
  });

  socket.on("disconnect",()=>{
   users=users.filter((user)=>socket.id!==user.socketId)
   io.emit("getUsers",users)
  })
}
)
app.use(express.json({ limit: '10mb' }))
app.use("/api",require("./routes/createUserRoutes"))
app.use("/api",require("./routes/messageroutes"))
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})