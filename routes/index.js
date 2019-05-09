var express = require('express');
var router = express.Router();
var mongodb = require("mongodb");

module.exports = router;

// router.get('/', async (req,res) => {
//   var data = req.body;

//   const postCollections = await loadCollections("date_dim")
//   var mimint = await postCollections.find({}).toArray();  
  
//   res.send(mimint);
// });

// router.post('/push',async (req,res) => {
//   const postCollections = await loadCollections("store")
//   await postCollections.insertMany([])
//   res.send("finish");
// });

router.post('/date/:stock/:outstock', async (req,res) => {
  const postCollections = await loadCollections("date_dim")
  res.send(await postCollections.insertOne({"stock": req.params.stock, "outstock": req.param.outstock}))
});

router.get('/date', async (req,res) => {
  const postCollections = await loadCollections("date_dim")
  res.send(await postCollections.find({}).toArray())
});

router.get('/customer', async (req,res) => {
  const postCollections = await loadCollections("customer_dim")
  res.send(await postCollections.find({}).toArray())
});

router.get('/jew-profile', async (req,res) => {
  const postCollections = await loadCollections("jew_profile")
  res.send(await postCollections.find({}).toArray())
});

router.get('/order', async (req,res) => {
  const postCollections = await loadCollections("order")
  res.send(await postCollections.find({}).toArray())
});

router.get('/order-sale', async (req,res) => {
  const postCollections = await loadCollections("order_sale")
  res.send(await postCollections.find({}).toArray())
});

router.get('/product', async (req,res) => {
  const postCollections = await loadCollections("product_dim")
  res.send(await postCollections.find({}).toArray())
});

router.get('/promotion', async (req,res) => {
  const postCollections = await loadCollections("promotion_dim")
  res.send(await postCollections.find({}).toArray())
});

router.get('/store', async (req,res) => {
  const postCollections = await loadCollections("store")
  res.send(await postCollections.find({}).toArray())
});

router.get('/order-sale', async (req,res) => {
  const postCollections = await loadCollections("date_dim")
  res.send(await postCollections.find({}).toArray())
});

router.get('/:gender/:type', async (req,res) => {
  const postCollections = await loadCollections("product_dim")
  var data = await postCollections.find({"gender": req.params.gender, "type": req.params.type}).toArray();
  res.send(data)  
});

router.get('/new', async (req,res) => {
  const db = await loadDataBase()
  const productCollections = await db.collection("product_dim")
  const storeCollections = await db.collection("store")
  const dateCollections = await  db.collection("date_dim")
  var todayDate = new Date()
  var dateData = await dateCollections.find({ 
    stock_date : { 
      $lte: todayDate, 
      $gte: new Date(new Date().setDate(todayDate.getDate()-30))
    }   
}).project({_id: 1}).toArray()
var dateTemp = [];
var len = dateData.length
for (let i = 0; i < len; i++) {
  dateTemp[i] = dateData[i]._id
}
  var store = await storeCollections.find({date_id: { $in: dateTemp }}).project({product_id:1}).toArray()
  var storeTemp = [];
  var len2 = store.length
  for (let i = 0; i < len2; i++) {
    storeTemp[i] = store[i].product_id
  }
  var product = await productCollections.find({_id: {$in: storeTemp}}).toArray()
  res.send(product)  
});

async function loadCollections(collection) {
  var db = await loadDataBase();
  return db.collection(collection);
}

async function loadDataBase() {
  const client = await mongodb.MongoClient.connect(
    "mongodb+srv://darm:007007@cluster0-umqz2.gcp.mongodb.net/test?retryWrites=true",{ useNewUrlParser: true }
  );
  return client.db("beluga");
}




