// How many movies are in both the top ten highest rated movies
// according to the imdb.rating and the metacritic fields ?
// We should get these results with exactly one access to the database.

var pipeline = [
  // Match documents with both 'metacritic' and 'imdb.rating' first.
  {"$match": {metacritic: {$gte: 0}, 'imdb.rating': {$gte: 0}}},
  
  // Project only some relevant field. Optional stage.
  {"$project": {'imdb.rating': 1, metacritic: 1, title: 1}},
  
  // Sort by 'metacritic' field descending.
  {"$sort": {metacritic: -1}},
  
  // Group all sorted documents under an 'movies' array.
  {"$group": {_id: null, movies: {$push: '$$CURRENT'}}},
  
  // Get the lowest 'metacritic' score in top 10 with which we should
  // retain documents and add a field with that value to each document
  // in that 'movies' array.
  {"$addFields": {'movies.lowestMetacriticToRetain':
    {$arrayElemAt: ['$movies.metacritic', 9]}
  }},
  
  // Unwind the 'movies' array.
  {"$unwind": '$movies'},
  
  // Replace root with movie documents for convenience. Optional stage.
  {"$replaceRoot": { newRoot: '$movies' }},
  
  // Sort by 'imdb.rating'.
  {"$sort": {'imdb.rating': -1}},
  
  // Limit top 10.
  {"$limit": 10},
  
  // Calculate a field that shows if any of the remaining documents
  // would have 'metacritic' value to be in top 10 by 'metacritic'.
  {"$addFields": {shouldRetain:
    {$gte: ['$metacritic', '$lowestMetacriticToRetain']}
  }},
  
  // Filter off documents that shouldn't be retained.
  {"$match": {shouldRetain: true}},
  
  // Project off working fields.
  {"$project": {_id: 0, shouldRetain: 0, lowestMetacriticToRetain: 0}}
]

db.movies.aggregate(pipeline)
