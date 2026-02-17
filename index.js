const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
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
    //   ---------------------database collection ----------------
    const coffeeCollection = client.db("coffeeDB").collection("coffees");
    const usersCollection = client.db("coffeeDB").collection("users");
    //   -----------------read data find------------
    app.get("/coffees", async (req, res) => {
      //   const cursor = coffeeCollection.find()
      //   const result = await cursor.toArray()
      const result = await coffeeCollection.find().toArray();
      res.send(result);
    });

    //   ----------------data--find details --------------------
    app.get("/coffees/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await coffeeCollection.findOne(query);
      res.send(result);
    });
    //   ----------------post data----------------------
    app.post("/coffees", async (req, res) => {
      const newCoffee = req.body;
      console.log(newCoffee);
      const result = await coffeeCollection.insertOne(newCoffee);
      res.send(result);
    });
    // -------------------Delete data ------------------------
    app.delete("/coffees/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await coffeeCollection.deleteOne(query);
      res.send(result);
    });
    //----------------update data  ------------
    app.put("/coffees/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateCoffee = req.body;
      const updateDoc = {
        $set: updateCoffee,
      };
      const result = await coffeeCollection.updateOne(
        filter,
        updateDoc,
        options,
      );
      res.send(result);
    });
    // ----------------*****user related api**** -------------------
    // --------------user find data read -----------------
    app.get("/users", async (req, res) => {
      const result = await usersCollection.find().toArray();
      res.send(result);
    });
    // ---------------user data post ------------------
    app.post("/users", async (req, res) => {
      const userProfile = req.body;
      console.log(userProfile);
      const result = await usersCollection.insertOne(userProfile);
      res.send(result);
    });
    // ---------------user delete -----------------------------
    app.delete('/users/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await usersCollection.deleteOne(query)
      res.send(result)
    })
    // -------------user data update  one datar jonno-------patch---------------
    app.patch('/users', async (req, res) => {
      const { email, lastSignInTime } = req.body;
      const filter = { email: email }
      const updateDoc = {
        $set: {
          lastSignInTime: lastSignInTime,
        },
      };
      const result = await usersCollection.updateOne(filter, updateDoc)
      res.send(result)
      
    })
    //---------------- ping to  connection mongo db ------------
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
