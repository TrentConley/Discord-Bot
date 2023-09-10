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
}).then(() => {
  console.log("You successfully connected to MongoDB!");
}).catch(err => {
  console.error('Connection error', err);
});

module.exports = mongoose;