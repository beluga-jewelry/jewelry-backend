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

//ex post
router.post('/push',async (req,res) => {
  const postCollections = await loadCollections("promotion_dim")
  await postCollections.updateOne({promotion_name: "1 get free 1"},{$set:{_id:1}})
  await postCollections.updateOne({promotion_name:"midyear sale"},{$set:{_id:2}})
  await postCollections.updateOne({promotion_name:"year end sale"},{$set:{_id:3}}) 
  res.send(await postCollections.find({}));
});

//ex post
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

router.get('/product/:gender/:type', async (req,res) => {
  const db = await loadDataBase()
  const storeCollections = await db.collection("store")
  const storeArray = await storeCollections.aggregate([
      {$lookup:{
        from: "product_dim",
        localField: "product_id",   // name of users table field
        foreignField: "_id", // name of userinfo table field
        as: "product_info"    
        }
      },{$unwind: "$product_info"},

      {$lookup:{
        from: "promotion_dim",
        localField: "promotion_id",   // name of users table field
        foreignField: "_id", // name of userinfo table field
        as: "promotion_info"    
        }
      },{$unwind: "$promotion_info"},
      {$match:{
        "product_info.gender": req.params.gender, 
        "product_info.type": req.params.type
      }}
    ]).project({
      "_id": 1,
      "product_id": "$product_info._id",
      "promotion_id": "$promotion_info._id",
      "name": "$product_info.name",
      "type": "$product_info.type",
      "material": "$product_info.meterial",
      "gender": "$product_info.gender",
      "color": "$product_info.color",
      "price": "$product_info.price",
      "image": "$product_info.image",
      "promotion_name": "$promotion_info.promotion_name",
      "promotion_quantity": "$promotion_info.quantity",
      "discount": "$promotion_info.discount"
    }).toArray();
    res.send(storeArray);
});

router.get('/new', async (req,res) => {
  const db = await loadDataBase()
  const storeCollections = await db.collection("store")
  var curDate = new Date()
  const storeArray = await storeCollections.aggregate([
    {$lookup:{
      from: "product_dim",
      localField: "product_id",   // name of users table field
      foreignField: "_id", // name of userinfo table field
      as: "product_info"    
      }
    },{$unwind: "$product_info"},

    {$lookup:{
      from: "date_dim",
      localField: "date_id",   // name of users table field
      foreignField: "_id", // name of userinfo table field
      as: "date_info"    
      }
    },{$unwind: "$date_info"},

    {$lookup:{
      from: "promotion_dim",
      localField: "promotion_id",   // name of users table field
      foreignField: "_id", // name of userinfo table field
      as: "promotion_info"    
      }
    },{$unwind: "$promotion_info"},

    
    {$match:{ 
      "date_info.stock_date" : { 
        $lte: curDate, 
        $gte: new Date(new Date().setMonth(curDate.getMonth()-1))
      }  
    }
    }
  ]).project({
    "_id": 1,
    "product_id": "$product_info._id",
    "date_id": "$date_info._id",
    "name": "$product_info.name",
    "type": "$product_info.type",
    "material": "$product_info.meterial",
    "gender": "$product_info.gender",
    "color": "$product_info.color",
    "price": "$product_info.price",
    "image": "$product_info.image",
    "quantity":1,
    "promotion_name": "$promotion_info.promotion_name",
    "promotion_quantity": "$promotion_info.quantity",
    "discount": "$promotion_info.discount"
  }).toArray();
  res.send(storeArray);
})

router.get('/promotion/store', async (req,res) => {
  const db = await loadDataBase()
  const storeCollections = await db.collection("store")
  const storeArray = await storeCollections.aggregate([
      {$lookup:{
        from: "product_dim",
        localField: "product_id",   // name of users table field
        foreignField: "_id", // name of userinfo table field
        as: "product_info"    
        }
      },{$unwind: "$product_info"},

      {$lookup:{
        from: "promotion_dim",
        localField: "promotion_id",   // name of users table field
        foreignField: "_id", // name of userinfo table field
        as: "promotion_info"    
        }
      },{$unwind: "$promotion_info"},
    ]).project({
      "_id": 1,
      "product_id": "$product_info._id",
      "promotion_id": "$promotion_info._id",
      "name": "$product_info.name",
      "type": "$product_info.type",
      "material": "$product_info.meterial",
      "gender": "$product_info.gender",
      "color": "$product_info.color",
      "price": "$product_info.price",
      "image": "$product_info.image",
      "promotion_name": "$promotion_info.promotion_name",
      "promotion_quantity": "$promotion_info.quantity",
      "discount": "$promotion_info.discount"
    }).toArray();
    res.send(storeArray);
});

router.get('/admin/stock', async (req,res) => {
  const db = await loadDataBase()
  const storeCollections = await db.collection("store")
  const storeArray = await storeCollections.aggregate([
    {$lookup:{
      from: "product_dim",
      localField: "product_id",   // name of users table field
      foreignField: "_id", // name of userinfo table field
      as: "product_info"    
      }
    },{$unwind: "$product_info"},

    {$lookup:{
      from: "date_dim",
      localField: "date_id",   // name of users table field
      foreignField: "_id", // name of userinfo table field
      as: "date_info"    
      }
    },{$unwind: "$date_info"},
    {$match:{ 
      "date_info.sale_date" : { $exists: false } 
    }
    }
  ]).project({
    "_id": 1,
    "product_id": "$product_info._id",
    "date_id": "$date_info._id",
    "name": "$product_info.name",
    "type": "$product_info.type",
    "material": "$product_info.meterial",
    "gender": "$product_info.gender",
    "color": "$product_info.color",
    "price": "$product_info.price",
    "image": "$product_info.image",
    "stock_date": "$date_info.stock_date",
    "quantity":1
  }).toArray();
  res.send(storeArray);
})

router.get('/admin/report', async (req,res) => {
  const db = await loadDataBase()
  const storeCollections = await db.collection("store")
  const storeArray = await storeCollections.aggregate([
    {$lookup:{
      from: "product_dim",
      localField: "product_id",   // name of users table field
      foreignField: "_id", // name of userinfo table field
      as: "product_info"    
      }
    },{$unwind: "$product_info"},

    {$lookup:{
      from: "date_dim",
      localField: "date_id",   // name of users table field
      foreignField: "_id", // name of userinfo table field
      as: "date_info"    
      }
    },{$unwind: "$date_info"},
    {$match:{ 
      "date_info.sale_date" : { $exists: true , $lt: new Date()}
    }
    }
  ]).project({
    "_id": 1,
    "product_id": "$product_info._id",
    "date_id": "$date_info._id",
    "name": "$product_info.name",
    "type": "$product_info.type",
    "material": "$product_info.meterial",
    "gender": "$product_info.gender",
    "color": "$product_info.color",
    "price": "$product_info.price",
    "image": "$product_info.image",
    "sale_date": "$date_info.sale_date",
    "quantity":1
  }).toArray();
  res.send(storeArray);
})


router.get('/admin/history', async (req,res) => {
  const db = await loadDataBase()
  const storeCollections = await db.collection("store")
  const storeArray = await storeCollections.aggregate([
    {$lookup:{
      from: "product_dim",
      localField: "product_id",   // name of users table field
      foreignField: "_id", // name of userinfo table field
      as: "product_info"    
      }
    },{$unwind: "$product_info"},

    {$lookup:{
      from: "date_dim",
      localField: "date_id",   // name of users table field
      foreignField: "_id", // name of userinfo table field
      as: "date_info"    
      }
    },{$unwind: "$date_info"},
    {$lookup:{
      from: "jew_profile",
      localField: "profile_id",   // name of users table field
      foreignField: "_id", // name of userinfo table field
      as: "profile_info"    
      }
    },{$unwind: "$profile_info"},
    {$match:{ 
      "date_info.sale_date" : { $lt: new Date()}
    }
    }
  ]).project({
    "_id": 1,
    "product_id": "$product_info._id",
    "date_id": "$date_info._id",
    "profile_id": "$profile_id",
    "name": "$product_info.name",
    "type": "$product_info.type",
    "material": "$product_info.meterial",
    "gender": "$product_info.gender",
    "color": "$product_info.color",
    "price": "$product_info.price",
    "image": "$product_info.image",
    "stock_date": "$date_info.stock_date",
    "profile_country": "$profile_info.country",
    "profile_material": "$profile_info.material",
    "quantity":1
  }).toArray();
  res.send(storeArray);
})

router.post('/user/order', async (req,res) => {
  var data = req.body;
  const db = await loadDataBase();
  const orderCollection = await db.collection("order")
  const storeCollection = await db.collection("store")
  await storeCollection.updateOne({product_id: data.product_id}, { $inc: { quantity: -1}})
  await orderCollection.insertOne(data)
  res.send(await orderCollection.find({}).toArray());
});


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




