// Create local collection for test purpose
---------------------------------------------
db.people.insertOne( {"_id": 0, "name": "Bernice Pope", "age": 69, "state": "WA"} )
db.people.insertOne( {"_id": 1, "name": "Eric Malone", "age": 57, "state": "NJ"} )
db.people.insertOne( {"_id": 2, "name": "Blanche Miller", "age": 35, "state": "TX"} )
db.people.insertOne( {"_id": 3, "name": "Sue Perez", "age": 64, "state": "TX"} )
db.people.insertOne( {"_id": 4, "name": "Ryan White", "age": 39, "state": "WA"} )
db.people.insertOne( {"_id": 5, "name": "Grace Payne", "age": 56, "state": "WA"} )
db.people.insertOne( {"_id": 6, "name": "Jessie Yates", "age": 53, "state": "NJ"} )
db.people.insertOne( {"_id": 7, "name": "Herbert Mason", "age": 37, "state": "TX"} )
db.people.insertOne( {"_id": 8, "name": "Jesse Jordan", "age": 47, "state": "WA"} )
db.people.insertOne( {"_id": 9, "name": "Hulda Fuller", "age": 25, "state": "WA"} )

// PIPELINE 1
--------------
var pipeline = [
	{
		"$project":
		{
			"surname":
			{
				"$arrayElemAt":	[ {"$split": [ "$name", " "]}, 1]
			},
			"name_size": { "$add" : [{"$strLenCP": "$name"}, -1]},
			"name": 1
		}
	},
	{
		"$group":
		{
			"_id": "$name_size",
			"word": {"$addToSet": {"$substr": [{"$toUpper":"$name"}, 3, 2]}},
			"names": {"$push": "$surname"}
		}
	},
	{
		"$sort": {"_id": -1}
	}
]
db.people.aggregate(pipeline)
Pipeline 1 : NO => sort by _id in descending order instead of expected ascending order

// PIPELINE 2
--------------
var pipeline = [
	{
		"$project":
		{
			"surname_capital": { "$substr": [{"$arrayElemAt": [{"$split": ["$name", " "]}, 1]}, 0, 1] },
			"name_size": { "$add" : [{"$strLenCP": "$name"}, -1]},
			"name": 1
		}
	},
	{
		"$group":
		{
			"_id": "$name_size",
			"word": {"$push": "$surname_capital" },
			"names": {"$push": "$name"}
		}
	},
	{
		"$project":
		{
			"word":
			{
				"$reduce":
				{
					"input": "$word",
					"initialValue": "",
					"in": { "$concat": ["$$value", "$$this"]}
				}
			},
			"names": 1
		}
	},
	{
		"$sort": {"_id": 1}
	}
]
db.people.aggregate(pipeline)
Pipeline 2 : YES






