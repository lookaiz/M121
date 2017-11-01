// Using the air_alliances and air_routes collections,
// find which alliance has the most unique carriers operating
// between the airports JFK and LHR.

// src_airport and dst_airport contain the originating and terminating airport information.

1 => Star Alliance, with 6 carriers
2 => SkyTeam, with 4 carriers
3 => OneWorld, with 4 carriers
4 => OneWorld, with 8 carriers

var pipeline = [
	{
		"$match":
		{
			"src_airport": { $in: ["JFK"] },
			"dst_airport": { $in: ["LHR"] },
		}
	},
	{
		"$lookup":
	    {
	      "from": "air_alliances",
	      "localField": "airline.name",
	      "foreignField": "airlines",
	      "as": "airlines"
	    }
	},
	{	
	    "$group":
	    {
	      _id:
	      {
	        "name" : "$airlines.name"
	      },
	      "nbRoutes" : { "$sum": 1 }
	    }
	},
  	{
    	"$sort": { "nbRoutes": -1 }
  	}
]
db.air_routes.aggregate(pipeline)

=> Response 3: OneWorld, 4 carriers
