const mongoose = require('mongoose');

const MongoDBPassword = process.env['MongoDBPassword'];

const connectDB = async (dbName) => {
    const uri = `mongodb+srv://trentconley:${MongoDBPassword}@cluster0.aaepbj6.mongodb.net/${dbName}?retryWrites=true&w=majority`;

    await mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverApi: {
            version: "1",
            strict: false
        }
    });

    console.log("You successfully connected to MongoDB!");
    return mongoose;
};

module.exports = connectDB;