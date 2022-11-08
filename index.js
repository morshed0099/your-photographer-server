const express=require('express');
const app=express();
const port=process.env.PORT || 5000
const cors=require('cors')
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config()

console.log(process.env.DB_USER);
console.log(process.env.DB_PASSWORD);
app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.1m4kiwj.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
console.log(uri);
async function run(){
    try{

    }
    finally{

    }
}run().catch(error=>console.error(error))

app.get('/',(req,res)=>{
    res.send('woo server is running')
})

app.listen(port,()=>{
    console.log(`your photographer is runnig on port ${port}`)
})