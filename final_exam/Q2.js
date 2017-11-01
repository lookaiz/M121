// Create local collection for test purpose
---------------------------------------------
db.collection.insertOne( {"a": [1, 34, 13]} )

db.collection.find()
{
	"a": [1, 34, 13]
}

// PIPELINE 1
--------------
db.collection.aggregate([
	{"$match": {"a" : {"$sum": 1}}},

	{"$project": {"_id": {"$addToSet": "$a"}}},

	{"$group": { "_id": "", "max_a":{"$max": "$_id"}}}
])

// Local test
db.collection.aggregate([
	{"$group": { "_id": "", "max_a":{"$max": "$_id"}}}
])

// PIPELINE 2
--------------
db.collection.aggregate([
	{"$project": {"a_divided": {"$divide": ["$a", 1]}}}
])

// Local test
db.collection.aggregate([
	{"$project": {"a_divided": {"$divide": ["$a", 1]}}}
])

// PIPELINE 3
--------------
db.collection.aggregate([
	{"$project": {"a": {"$max": "$a"}}},

	{"$group": {"_id": "$$ROOT._id", "all_as": {"$sum": "$a"}}}
])

// STATEMENTS
--------------
* Pipeline 1 is incorrect because you cannot use an accumulator expression in a $match stage
"TRUE": accumulator expressions can only be used in $project or $group stages

* Pipeline 2 is incorrect since $divide cannot operator over field expressions
"FALSE": $divide can operate over field expressions

* Pipeline 2 fails because $divide operator only supports numeric types
"TRUE": $divide only supports numeric types, not array and double

* Pipeline 3 is correct and will execute with no error
"TRUE"

* Pipeline 1 will fail because $max can not operator on _id field
"FALSE": $max can operate on _id field