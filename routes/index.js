var express = require('express');
var router = express.Router();
var mongodb = require("mongodb");
var ObjectId = require("mongodb").ObjectID;
module.exports = router;

// router.get('/', async (req,res) => {
//   var data = req.body;

//   const postCollections = await loadCollections("date_dim")
//   var mimint = await postCollections.find({}).toArray();  
  
//   res.send(mimint);
// });

router.post('/push',async (req,res) => {
  const postCollections = await loadCollections("promotion_dim")
  await postCollections.updateOne({promotion_name: "1 get free 1"},{$set:{_id:1}})
  await postCollections.updateOne({promotion_name:"midyear sale"},{$set:{_id:2}})
  await postCollections.updateOne({promotion_name:"year end sale"},{$set:{_id:3}}) 
  res.send(await postCollections.find({}));
});

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

router.get('/items/:gender/:type', async (req,res) => {
  const postCollections = await loadCollections("product_dim")
  var data = await postCollections.find({"gender": req.params.gender, "type": req.params.type}).toArray();
  res.send(data)  
});

router.get('/new', async (req,res) => {
  const db = await loadDataBase()
  const productCollections = await db.collection("product_dim")
  const storeCollections = await db.collection("store")
  const dateCollections = await  db.collection("date_dim")
  var curDate = new Date()
  var dateData = await dateCollections.find({ 
    stock_date : { 
      $lte: curDate, 
      $gte: new Date(new Date().setMonth(curDate.getMonth()-1))
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

router.get('/promotion/store', async (req,res) => {
  const db = await loadDataBase()
  const productCollections = await db.collection("product_dim")
  const storeCollections = await db.collection("store")
  const promoCollections = await db.collection("promotion_dim")

  var promotionData = await promoCollections.find({ 
    begin_date:{
      $lte: new Date()
    },
    end_date: { 
      $gte: new Date()
    }
  }).toArray()


  var promoTemp = [];
var len = promotionData.length
for (let i = 0; i < len; i++) {
  promoTemp[i] = promotionData[i]._id
}
var store = await storeCollections.find({promotion_id: { $in: promoTemp }}).project({product_id:1}).toArray()
var store2 = await storeCollections.find({promotion_id: { $in: promoTemp }}).toArray()

var storeTemp = [];
var promoId = []
var len2 = store.length
for (let i = 0; i < len2; i++) {
  storeTemp[i] = store[i].product_id
}
var product = await productCollections.find({_id: {$in: storeTemp}}).toArray()

var sendArray = []
var len3 = product.length
let i = 0, k = 0;
while(k < len3){
  if(store[i].product_id == product[k]._id){
    promoId[k] = store2[i]['promotion_id']
    var promoSet = await promoCollections.findOne({_id:ObjectId(promoId[k])});
  sendArray[k] = { "_id": product[i]['id'],
  "name": product[k]['name'],
  "type": product[k]['type'],
  "material": product[k]['material'],
  "gender": product[k]['gender'],
  "color": product[k]['color'],
  "price": product[k]['price'],
  "image":product[k]['image'],
  "promotion_name": promoSet['promotion_name'],
  "quantity":promoSet['quantity'],
  "discount":promoSet['discount'],
  }  
    k++;
    }
  i++;
  if(i >= len2) i = 0;
}

res.send(sendArray)  
})

/*
*load collection 
*/
async function loadCollections(collection) {
  var db = await loadDataBase();
  return db.collection(collection);
}

/**
 * load dataBase
 */
async function loadDataBase() {
  const client = await mongodb.MongoClient.connect(
    "mongodb+srv://darm:007007@cluster0-umqz2.gcp.mongodb.net/test?retryWrites=true",{ useNewUrlParser: true }
  );
  return client.db("beluga");
}




