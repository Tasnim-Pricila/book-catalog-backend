require("dotenv").config();
const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

const cors = require("cors");

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.dbUser}:${process.env.dbPassword}@cluster0.wflnx64.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

const run = async () => {
  try {
    const db = client.db("book-catalog");
    const bookCollection = db.collection("books");

    app.get("/books", async (req, res) => {
      const cursor = bookCollection.find({});
      const books = await cursor.toArray();
      res.send({ status: true, data: books });
    });

    app.post("/book", async (req, res) => {
      const book = req.body;
      const result = await bookCollection.insertOne(book);
      res.send({ status: true, data: result });
    });

    app.get("/book/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await bookCollection.findOne(query);
      console.log(result);
      res.send({ status: true, data: result });
    });

    app.delete("/book/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await bookCollection.deleteOne(query);
      res.send({ status: true, data: result });
    });

    app.patch("/book/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const updatedDoc = {
        $set: req.body,
      };
      const result = await bookCollection.updateOne(query, updatedDoc);
      res.send({ status: true, data: result });
    });
  } finally {
  }
};

run().catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
