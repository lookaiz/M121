// MongoDB has another movie night scheduled.
// This time, we polled employees for their favorite actress or actor, and got these results
var favorites = [
  "Sandra Bullock",
  "Tom Hanks",
  "Julia Roberts",
  "Kevin Spacey",
  "George Clooney"]

// For movies released in the USA with a tomatoes.viewer.rating greater than or equal to 3,
// calculate a new field called num_favs that represents how many favorites appear
// in the cast field of the movie.

// Sort your results by num_favs and then tomatoes.viewer.rating, both in descending order.

// What is the title of the 25th film in the aggregation result?

var pipeline = [
  {
    "$match":
    {
      "countries": { $eq : "USA"},
      "tomatoes.viewer.rating" : {$gte: 3}
    }
  },
  {
    "$project":
    {
      "num_favs":
      {
        "$size":
        {
          "$ifNull":
          [
            {
              "$setIntersection": ["$cast", favorites ]
            },
            []
          ]
        }
      },
      title: 1,
      "tomatoes.viewer.rating": 1
    }
  },
  {
    "$sort":
    {
      num_favs: -1,
      "tomatoes.viewer.rating": -1
    }
  },
    {
      "$skip": 24
    },
    {
      "$limit": 1
    }
]

db.movies.aggregate(pipeline)
