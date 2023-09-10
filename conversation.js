const connectDB = require('./db.js');

module.exports = {
    getConversation: async (mongoose, userId) => {
        const Schema = mongoose.Schema;

        const ConversationSchema = new Schema({
            userId: String,
            messages: Array
        });

        let Conversation;
        if (mongoose.models.Conversation) {
            // If the model is already defined, use it
            Conversation = mongoose.model('Conversation');
        } else {
            // If the model is not yet defined, define it
            Conversation = mongoose.model('Conversation', ConversationSchema);
        }


        let conversation = await Conversation.findOne({ userId });
        if (!conversation) {
            conversation = new Conversation({ userId, messages: [] });
        }
        return conversation;
    },
    saveConversation: async (mongoose, conversation) => {
        await conversation.save();
    }
};