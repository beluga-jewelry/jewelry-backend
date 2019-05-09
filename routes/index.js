var express = require('express');
var router = express.Router();
var mongodb = require("mongodb");

module.exports = router;

router.get('/', async (req,res) => {
  var data = req.body;

  const postCollections = await loadCollections("date_dim")
  var mimint = await postCollections.find({}).toArray();  
  
  res.send(mimint);
});

router.post('/product',async (req,res) => {
  const postCollections = await loadCollections("product_dim")
  
  var a = await postCollections.insertMany()
  res.send("finish");
});

router.post('/date/:stock/:outstock', async (req,res) => {
  const postCollections = await loadCollections("date_dim")
  res.send(await postCollections.insertOne({"stock": req.params.stock, "outstock": req.param.outstock}))
});

router.get('/date', async (req,res) => {
  const postCollections = await loadCollections("date_dim")
  res.send(await postCollections.find({}).toArray())
});


async function loadCollections(collection) {
  const client = await mongodb.MongoClient.connect(
    "mongodb+srv://darm:007007@cluster0-umqz2.gcp.mongodb.net/test?retryWrites=true",{ useNewUrlParser: true }
  );
  return client.db("beluga").collection(collection);
}

