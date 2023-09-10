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

const Schema = mongoose.Schema;

const ConversationSchema = new Schema({
  userId: String,
  messages: Array
});

const Conversation = mongoose.model('Conversation', ConversationSchema);

module.exports = {
  getConversation: async (userId) => {
    let conversation = await Conversation.findOne({ userId });
    if (!conversation) {
      conversation = new Conversation({ userId, messages: [] });
    }
    return conversation;
  },
  saveConversation: async (conversation) => {
    await conversation.save();
  },
  findClosestDocument  // Export the new function
};
