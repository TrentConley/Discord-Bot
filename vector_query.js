const findClosestDocument = async (query_vector) => {
    // Define the aggregation pipeline for the knnBeta query
    const k_value = 1;
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
    const nearest_document = await Conversation.aggregate(pipeline).exec();
    let closest_document;
    if (nearest_document.length > 0) {
      closest_document = nearest_document[0];
    }
  
    return closest_document;
  };