// PIPELINE 1
--------------
db.coll.aggregate([
	{"$match": {"field_a": {"$gt": 1983}}},

	{"$project": {"field_a": "field_a.1", "field_b": 1, "field_c": 1}},

	{"$replaceRoot":{"newRoot": {"_id": "$field_c", "field_b": "$field_b"}}},

	{"$out": "coll2"},

	{"$match": {"_id.field_f": {"$gt": 1}}},

	{"$replaceRoot":{"newRoot": {"_id": "$field_b", "field_c": "$_id"}}}
])

// PIPELINE 2
--------------
db.coll.aggregate([
	{"$match": {"field_a": {"$gt": 111}}},

	{"$geoNear": {
		"near": {"type": "Point", "coordinates": [ -73.99279 , 40.719296 ] },
		"distanceField": "distance" }
	},

	{ "$project": {"distance": "$distance", "name": 1, "_id": 0}}
])

// PIPELINE 3
--------------
db.coll.aggregate([
	{"$facet": {
		"averageCount": [
			{"$unwind": "$array_field"},
			{"$group": {"_id": "$array_field", "count": {"$sum": 1}}}
		],
		"categorized": [{"$sortByCount": "$array_field"}]}
	},

	{"$facet": {
		"new_shape": [{"$project": {"range": "$categorized._id"}}],
		"stats": [{"$match": {"range": 1}}, {"$indexStats": {}}]
	}}
])

// STATEMENTS
--------------

* Pipeline 2 is incorrect because $neoGear needs to be the first stage of our Pipeline
"TRUE" : $geoNear is required to be the first stage of a pipeline

* Pipeline 2 fails because we cannot project distance field
"FALSE"

* Pipeline 1 is incorrect because you can only have one $replaceRoot stage in your Pipeline
"FALSE" : we can have several $replaceRoot stage in a same pipeline

* Pipeline 1 fails since $out is required to be the last stage of the Pipeline
"TRUE" : the $out stage must be the last stage in a pipeline

* Pipeline 3 fails because $indexStats must be the first stage in a pipeline and may not be usedwithin a $facet
"TRUE" : $indexStats must be the first stage in an aggregation pipeline and cannot be used within a $facet stage

* Pipeline 3 fails since you can only have one $facet stage per pipeline
"FALSE" : we can use many $facet stage within a same aggregation pipeline

* Pipeline 3 executes correctly
"FALSE"



