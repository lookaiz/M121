// Which alliance from air_alliances flies the most routes
// with either a Boeing 747 or an Airbus A380 (abbreviated 747 and 380 in air_routes) ?

var pipeline = [
	{
		"$match":
		{
			"airplane": { $in: ["747", "380"] }
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
