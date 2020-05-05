const mongo = require("mongodb");
const MongoClient = mongo.MongoClient;
const ObjectId = mongo.ObjectId;

// connection url:
const url = "mongodb://localhost:27017";

// Database name:
const dbName = "chat";

// create new MongoClient:
const client = new MongoClient(url, {
  useUnifiedTopology: true
});
client.connect();

module.exports = {
  getClient: function () {
    return client;
  },
  getDB: function () {
    let client = module.exports.getClient();
    let db = client.db(dbName);
    return db;
  },
  createObjectId(id) {
    return new ObjectId(id);
  }
}