var pipeline = [
	{
    	"$match": {	"a": {"$type": "int"} }
  	},
  	{
    	"$project":
    	{
      		"_id": 0,
      		"a_times_b": {"$multiply": ["$a", "$b"]}
    	}
  	},
  	{
    	"$facet":
    	{
        	"facet_1": [{"$sortByCount": "$a_times_b"}],
        	"facet_2": [{"$project": { "abs_facet1": {"$abs": "$facet_1._id"}}}],
        	"facet_3":
        	[
        		{
        			"$facet":
        			{
          				"facet_3_1":
          				[
          					{
          						"$bucketAuto":
          						{
          							"groupBy": "$_id", "buckets": 2
          						}
          					}
          				]
        			}
        		}
        	]
    	}
  	}
  ]

// ERROR STATEMANTS

* can not nest a $facet stage as a sub-pipeline
"TRUE": $facet stage cannot be nested

* $sortByCount cannot be used within $facet stage
"FALSE" : $sortByCount is an allowed stage in $facet stage

* a $type expression does not take a string as its value;
	only the BSON numeric values can be  specified to identify the types.
"FALSE"

* facet_2 uses the output of a parallel sub-pipeline, facet_1, to compute an expression
"FALSE": Each sub-pipeline within $facet is passed the exact same set of input documents
		 These sub-pipelines are completely independent of one another

* a $multiply expression takes a document as input, not an array
"FALSE" : $multiply takes an array as input
