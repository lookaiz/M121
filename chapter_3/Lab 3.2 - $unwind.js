// We'd like to calculate how many movies every cast member has been in
// and get an average imdb.rating for each cast member.

// What is the name, number of movies, and average rating (truncated to one decimal)
// for the cast member that has been in the most number of movies with English as an available language?

// Provide the input in the following order and format

// { "_id": "First Last", "numFilms": 1, "average": 1.1 }

var pipeline = [
  {
    "$match":
    {
      "languages": { $in: ["English"] }
    }
  },
  {
    "$unwind": "$cast"
  },
  {
    "$group":
    {
      _id:
      {
        "First Last" : "$cast"
      },
      "numFilms" : { "$sum": 1 },
      "average": { "$avg" : "$imdb.rating"}
    }
  },
  {
    "$sort": { "numFilms": -1 }
  },
  {
    "$limit": 1
  }
]

db.movies.aggregate(pipeline)

