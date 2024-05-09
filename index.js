require('dotenv').config();

const express = require('express');

const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
app.get('/', (req, res) => {
    res.send("Car doctor is running");
    
})


const uri =
 `mongodb+srv://${process.env.DB_user}:${process.env.DB_pass}@cluster0.p8g8qjz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
      const serviceCollection = client.db('carDoctor').collection('services');
      const bookingCollection=client.db('carDoctor').collection('bookings')
      app.get('/services', async (req, res) => {
          const cursor = serviceCollection.find();
          const result = await cursor.toArray();
          res.send(result);
      })
       app.get('/services/:id', async (req, res) => {
           const id = req.params.id;
           const query = { _id: new ObjectId(id) };
           const result=await serviceCollection.findOne(query)
         res.send(result);
       });
      app.post('/bookings', async(req, res) => {
          const booking = req.body;
          const result = await bookingCollection.insertOne(booking);
          res.send(result);

      })
    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    
  }
}
run().catch(console.dir);

app.listen(port, () => {
    console.log(`server is running at port ${port}`);
})