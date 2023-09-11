const { mongo } = require('mongoose');
const connectDB = require('./db.js');




const findClosestDocument = async (query_vector) => {

  // Use the database and collection
  const mongoose = await connectDB('crypto_protocol_db');
  const collection = mongoose.connection.collection('documentation_pages');

  // Print all documents in the collection
  // const allDocuments = await collection.find({}).toArray();
  // Define the aggregation pipeline for the knnBeta query
  const k_value = 2;
  const pipeline = [
    {
      "$search": {
        "knnBeta": {
          "vector": query_vector,
          "path": "embedding",
          "k": k_value
        }
      }
    },
    {
      "$limit": 1
    }
  ];

  // Execute the query and fetch the closest document
  const nearest_document = await collection.aggregate(pipeline).toArray();
  let closest_document;
  if (nearest_document.length > 0) {
    closest_document = nearest_document[0];
  }

  mongoose.connection.close();
  return closest_document.text;
};

module.exports = findClosestDocument;