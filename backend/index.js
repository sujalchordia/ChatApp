const express = require('express')
const app = express()
const server= require("http").createServer(app)
const port = 5000
const cors = require("cors");
const socketIo =require('socket.io')
// socket.io server side set up
let users=[]
const io=socketIo(server,{
    pingTimeout: 25000, // Maximum time (in milliseconds) for the client to respond to a ping.
    pingInterval: 5000, // How often (in milliseconds) the server sends out a ping to the client.
  cors:{
    origin:"http://localhost:3000"
  }
})


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
    console.log(users, recieverid)
    const reciever =users.find(user=>user.userId===recieverid)
    const sender=users.find(user=>user.userId===senderid)
    const user= await Users.findById(senderid);
    console.log("user",user);
    console.log(reciever,"reciever")
    console.log(sender,"sender")
    if(reciever){
      io.to(reciever.socketId).emit("getMessage",{
        senderid,
        recieverid,
        conversationId,
        message,
        user:{_id:user._id,email:user.email,name:user.name}
      })
    }
    if(sender){
      io.to(sender.socketId).emit("getMessage",{
        senderid,
        recieverid,
        conversationId,
        message,
        user:{_id:user._id,email:user.email,name:user.name}
      })
    }
   })
  socket.on("disconnect",()=>{
   users=users.filter((user)=>socket.id!==user.socketId)
   io.emit("getUsers",users)
  })
}
)
app.use(express.json({ limit: '10mb' }))
app.use("/api",require("./routes/createUserRoutes"))
app.use("/api",require("./routes/messageroutes"))
server.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})