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
    if(reciever && sender){
      io.to(reciever.socketId).to(sender.socketId).emit("getMessage",{
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
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})