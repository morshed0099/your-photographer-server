const express=require('express');
const app=express();
const port=process.env.PORT || 5000
const cors=require('cors')
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config()


app.use(cors());
app.use(express.json());

console.log(process.env.DB_USER)
console.log(process.env.DB_PASSWORD)
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.1m4kiwj.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

const servicesCollection=client.db('yourPhotodb').collection('services');
async function run(){
    try{
      app.get('/service',async(req,res)=>{
        const query={}
        const cursor=servicesCollection.find(query)
        const service= await cursor.limit(3).toArray();
        console.log(service);
        res.send(service)
      })
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