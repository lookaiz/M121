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

// ERROR STATEMENTS

* can not nest a $facet stage as a sub-pipeline
"TRUE": $facet does not accept all sub-pipelines that include other $facet stages

* $sortByCount cannot be used within $facet stage
"FALSE" : $facet does accept $sortByCount as a sub-pipeline stage

* a $type expression does not take a string as its value;
	only the BSON numeric values can be  specified to identify the types.
"FALSE" : We can use either the numeric BSON representation, as well as a string alias to evaluate a field type

* facet_2 uses the output of a parallel sub-pipeline, facet_1, to compute an expression
"TRUE": Each sub-pipeline are completely independent of one another.
		The output of one sub-pipeline cannot be used as the input for different sub-pipelines.

* a $multiply expression takes a document as input, not an array
"FALSE" : $multiply takes an array of expressions as input
