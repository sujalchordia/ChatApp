const mongoose = require('mongoose');
const url="mongodb+srv://sujalchordia10:gofood@cluster0.zo0tida.mongodb.net/GoFood?retryWrites=true&w=majority"
const mongodb =async()=>{
    mongoose.set('strictQuery', false);
    await mongoose.connect(url,{dbName:"ChatApplication"})
    console.log(mongoose.connection.readyState);
}
module.exports=mongodb  