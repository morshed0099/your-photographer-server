const express=require('express');
const app=express();
const port=process.env.PORT || 5000
const cors=require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()


app.use(cors());
app.use(express.json());

console.log(process.env.DB_USER)
console.log(process.env.DB_PASSWORD)
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.1m4kiwj.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){    
const servicesCollection=client.db('yourPhotodb').collection('services');
const commentCollection=client.db('commentsdb').collection('comments')
    try{
      app.get('/service',async(req,res)=>{
        const query={}
        const cursor=servicesCollection.find(query)
        const service= await cursor.limit(3).toArray();
        console.log(service);
        res.send(service)
      })
      app.get('/services',async(req,res)=>{
        const query={}
        const cursor=servicesCollection.find(query)
        const service= await cursor.toArray();
        console.log(service);
        res.send(service)
      })
      app.get('/services/:id',async(req,res)=>{
        const id =req.params.id;
        const query={_id:ObjectId(id)}
        const result=await servicesCollection.findOne(query)
        console.log(result);
        res.send(result)
      })
      app.get('/comments',async(req,res)=>{        
        const id = req.query.id
        const query={service_id:id}
        const cursor= commentCollection.find(query)
        const result= await cursor.toArray();
        res.send(result);
      })
      app.post('/comments', async (req, res) => {
       
        const comment = req.body;
        const result = await commentCollection.insertOne(comment);
        console.log(result);
        res.send(result);
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