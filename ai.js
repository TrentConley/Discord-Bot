const mongoose = require('mongoose');

const MongoDBPassword = 'your_password_here';
const dbName = 'your_db_name_here';
const uri = `mongodb+srv://trentconley:${MongoDBPassword}@cluster0.aaepbj6.mongodb.net/${dbName}?retryWrites=true&w=majority`;

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const findClosestDocument = async (query_vector) => {
    const collection = mongoose.connection.collection('documentation_pages');
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

    const nearest_document = await collection.aggregate(pipeline).toArray();
    let closest_document;
    if (nearest_document.length > 0) {
        closest_document = nearest_document[0];
    }

    return closest_document.text;
};

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

const fetchConversation = async (userId) => {
    const conversation = await Conversation.findOne({ userId: userId });
    return conversation;
};

module.exports = {
    findClosestDocument,
    fetchConversation
};
