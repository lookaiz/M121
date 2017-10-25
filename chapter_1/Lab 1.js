///https://docs.mongodb.com/manual/reference/operator/aggregation/match/

// imdb.rating is at least 7
// genres does not contain "Crime" or "Horror"
// rated is either "PG" or "G"
// languages contains "English" and "Japanese"

// MATCH
//////////
// Hint : use $all stage for languages query ?
var pipeline = [
    {
      "$match":
      {
      	"$and":
      	[
        	{"imdb.rating": { $gte: 7 }},
			{"genres": 		{ $nin: ["Crime", "Horror"]}},
			{"rated": 		{ $in:  ["PG", "G"]}},
			{"languages": 	{ $in:  ["English"]}},
			{"languages": 	{ $in:  ["Japanese"]}}
		]
      }
    }
    ]
db.movies.aggregate(pipeline).itcount()


// PROJECT
////////////
var pipeline = [
    {
      "$match":
      {
      	"$and":
      	[
        	{"imdb.rating": { $gte: 7 }},
			{"genres": 		{ $nin: ["Crime", "Horror"]}},
			{"rated": 		{ $in:  ["PG", "G"]}},
			{"languages": 	{ $in:  ["English"]}},
			{"languages": 	{ $in:  ["Japanese"]}}
		]
      }
    },
    {
    	"$project":
    	{
      		_id: 0,
      		title: 1,
      		rated: 1
      	}
    }
    ]
db.movies.aggregate(pipeline).pretty()


// COMPUTING FIELDS
/////////////////////
var pipeline = [
{
    "$project":
    {
    	"_id": 0,
        "nbWordsTitle":
        {
            "$eq": [
            {
                "$size":
                {
                    "$split": ["$title", " "]
                }
            }, 1]
        }
    }
},
{
    "$match":
    {
        "nbWordsTitle": true
    }
}]
db.movies.aggregate(pipeline).itcount()
