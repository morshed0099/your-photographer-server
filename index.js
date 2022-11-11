const express = require('express');
const app = express();
const jwt=require('JsonWebToken')
const port = process.env.PORT || 5000
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()


app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.1m4kiwj.mongodb.net/?retryWrites=true&w=majority`;


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
function verifyJWT(req,res,next){
  const authHeade = req.headers.authorization;
  if(!authHeade){
    return res.status(401).send({message:'unauthorization'})
  }
  const token=authHeade.split(' ')[1];
  jwt.verify(token,process.env.ACCESS_TOKEN_SECRET,function(error,decoded){
    if(error){
     return res.status(403).send({message:'unauthorization'})
    }
    req.decoded=decoded;
    next();
  })
}
async function run() {
  const servicesCollection = client.db('yourPhotodb').collection('services');
  const commentCollection = client.db('yourPhotodb').collection('comments')
  try {

    app.post('/jwt',(req,res)=>{
      const user=req.body
      const token=jwt.sign(user,process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h'  });
      console.log(token);
      res.send({token});
       
      
    })
    app.get('/service', async (req, res) => {
      const query = {}
      const cursor = servicesCollection.find(query).sort({myDate: -1})
      const service = await cursor.limit(3).toArray();
   
      res.send(service)
    })
    app.get('/services', async (req, res) => {
      const query = {}
      const cursor = servicesCollection.find(query)
      const service = await cursor.toArray();
    
      res.send(service)
    })
    app.get('/services/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) }
      const result = await servicesCollection.findOne(query)
     
      res.send(result)
    })

    app.post('/services',async(req,res)=>{
      const services=req.body
      const result=await servicesCollection.insertOne(services);
      console.log(result)
      res.send(result);      
    })
    app.get('/comments', async (req, res) => {
      const id = req.query.id
      const query = { service_id: id }
      const cursor = commentCollection.find(query).sort({time: -1})       
      const result = await cursor.toArray();
      res.send(result);
    })

    app.get('/comment',verifyJWT,async (req, res) => { 
      const decoded=req.decoded   
      const email=req.query.email      
        if(decoded.email!== email){
          return res.status(404).send({message:'unauthorized'})
        }
      const query={email:email};
      const cursor = commentCollection.find(query)
      const result = await cursor.toArray();          
      res.send(result);
    })
    app.post('/comments', async (req, res) => {
      const comment = req.body;
      const result = await commentCollection.insertOne(comment);    
      res.send(result);
    })
    app.patch('/comments/:id',verifyJWT,async(req,res)=>{
      const id =req.params.id;
      const query={_id:ObjectId(id)}
      const comments=req.body.comm
      const updateDoc={
        $set:{
          comment:comments
       }  
      }
      const result=await commentCollection.updateOne(query,updateDoc)
      console.log(result);
      res.send(result)
      
    })
    app.delete('/comment/:id',verifyJWT,async(req,res)=>{
      const id=req.params.id;
      const query={_id: ObjectId(id)}
      const result=await commentCollection.deleteOne(query);
      console.log(result);
      res.send(result)
    })

  }
  finally {

  }
} run().catch(error => console.error(error))

app.get('/', (req, res) => {
  res.send('woo server is running')
})

app.listen(port, () => {
  console.log(`your photographer is runnig on port ${port}`)
})