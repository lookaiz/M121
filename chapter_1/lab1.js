///https://docs.mongodb.com/manual/reference/operator/aggregation/match/

// imdb.rating is at least 7
// genres does not contain "Crime" or "Horror"
// rated is either "PG" or "G"
// languages contains "English" and "Japanese"

// MATCH
//////////
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


{
	"_id" : ObjectId("573a1390f29313caabcd4cf1"),
	"title" : "Ingeborg Holm",
	"year" : 1913,
	"runtime" : 96,
	"released" : ISODate("1913-10-27T00:00:00Z"),
	"cast" : [
		"Hilda Borgstr�m",
		"Aron Lindgren",
		"Erik Lindholm",
		"Georg Gr�nroos"
	],
	"poster" : "http://ia.media-imdb.com/images/M/MV5BMTI5MjYzMTY3Ml5BMl5BanBnXkFtZTcwMzY1NDE2Mw@@._V1_SX300.jpg",
	"plot" : "Ingeborg Holm's husband opens up a grocery store and life is on the sunny side for them and their three children. But her husband becomes sick and dies. Ingeborg tries to keep the store, ...",
	"fullplot" : "Ingeborg Holm's husband opens up a grocery store and life is on the sunny side for them and their three children. But her husband becomes sick and dies. Ingeborg tries to keep the store, but because of the lazy, wasteful staff she eventually has to close it. With no money left, she has to move to the poor-house and she is separated from her children. Her children are taken care of by foster-parents, but Ingeborg simply has to get out of the poor-house to see them again...",
	"lastupdated" : "2015-08-25 00:11:47.743000000",
	"type" : "movie",
	"directors" : [
		"Victor Sj�str�m"
	],
	"writers" : [
		"Nils Krok (play)",
		"Victor Sj�str�m"
	],
	"imdb" : {
		"rating" : 7,
		"votes" : 493,
		"id" : 3014
	},
	"countries" : [
		"Sweden"
	],
	"genres" : [
		"Drama"
	]
}