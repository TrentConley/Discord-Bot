const connectDB = require('./db.js');

module.exports = {
    getConversation: async (mongoose, userId) => {

        const Schema = mongoose.Schema;
        let Conversation;
        if (mongoose.models.Conversation) {
            Conversation = mongoose.models.Conversation;
        } else {
            const ConversationSchema = new Schema({
                userId: String,
                messages: Array
            });
            Conversation = mongoose.model('Conversation', ConversationSchema);
        }

        // Explicitly create collection
        const collection = mongoose.connection.collection('conversations');

        let conversation = await collection.find({ userId });
        if (!conversation) {
            conversation = new Conversation({ userId, messages: [] });
        }
        print(conversation);

        return conversation;
    },
    saveConversation: async (mongoose, conversation) => {
        await conversation.save();
    }
};