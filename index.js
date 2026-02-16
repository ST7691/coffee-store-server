const express = require("express");
const cors = require("cors");
require("dotenv").config(); 
const { MongoClient, ServerApiVersion } = require("mongodb");
const app = express();
const port = process.env.PORT || 3000;
// ---------------middle ware------------------
app.use(cors());
app.use(express.json());
//----------------------- mongodb connection ---------------------------
const uri = process.env.DB_URL;

// console.log(process.env.DB_URL);

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
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!",
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

//---------------- server connection----------------------
app.get("/", (req, res) => {
  res.send("coffe is getting hotter!");
});

app.listen(port, () => {
  console.log(`coffee server is runing now !!! ${port}`);
});