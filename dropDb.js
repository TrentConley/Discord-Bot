const mongoose = require('mongoose');
const MongoDBPassword = process.env['MongoDBPassword'];
const uri = `mongodb+srv://trentconley:${MongoDBPassword}@cluster0.aaepbj6.mongodb.net/?retryWrites=true&w=majority`;

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: {
    version: '1',
    strict: true,
    deprecationErrors: true,
  }
}).then(async () => {
  console.log("You successfully connected to MongoDB!");

  // Get all collections in the database
  const collections = Object.keys(mongoose.connection.collections);

  for (let collectionName of collections) {
    // Drop each collection
    const collection = mongoose.connection.collections[collectionName];
    try {
      await collection.drop();
      console.log(`Dropped ${collectionName} collection.`);
    } catch (err) {
      if (err.message === 'ns not found') return;
      if (err.message.includes('a background operation is currently running')) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        await collection.drop();
      }
    }
  }

  console.log("All collections dropped.");
  mongoose.connection.close();
}).catch(err => {
  console.error('Connection error', err);
});