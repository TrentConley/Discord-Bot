const mongoose = require('./db.js');
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
  }
};