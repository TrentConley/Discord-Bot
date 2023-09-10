const axios = require('axios');
require('dotenv').config();
const openAIKey = process.env['OpenAPIKey']
async function getEmbedding(text) {
  try {
    const response = await axios.post(
      'https://api.openai.com/v1/embeddings',
      {
        model: 'text-embedding-ada-002',
        input: text
      },
      {
        headers: {
          'Authorization': `Bearer ${openAIKey}`
        }
      }
    );
    const embedding = response.data.data[0].embedding;
    return embedding;
  } catch (error) {
    console.error(`Error: ${error}`);
  }
}
module.exports = { getEmbedding };

