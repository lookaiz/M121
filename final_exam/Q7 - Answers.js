// The correct answer is OneWorld, with 4 carriers

// A pipeline that can be used to get these results is

db.air_routes.aggregate([
  {
    $match: {
      src_airport: { $in: ["LHR", "JFK"] },
      dst_airport: { $in: ["LHR", "JFK"] }
    }
  },
  {
    $lookup: {
      from: "air_alliances",
      foreignField: "airlines",
      localField: "airline.name",
      as: "alliance"
    }
  },
  {
    $match: { alliance: { $ne: [] } }
  },
  {
    $addFields: {
      alliance: { $arrayElemAt: ["$alliance.name", 0] }
    }
  },
  {
    $group: {
      _id: "$airline.id",
      alliance: { $first: "$alliance" }
    }
  },
  {
    $sortByCount: "$alliance"
  }
])

// We begin with a $match stage, filtering out routes that do not originate or end at either LHR and JFK
{
  $match: {
    src_airport: { $in: ["LHR", "JFK"] },
    dst_airport: { $in: ["LHR", "JFK"] }
  }
},

// We then $lookup into the air_alliances collection, matching member airline names
// in the airlines field to the local airline.name field in the route
{
  $lookup: {
    from: "air_alliances",
    foreignField: "airlines",
    localField: "airline.name",
    as: "alliance"
  }
},

// We follow with a $match stage to remove routes that are not members of an alliance.
// We use $addFields to cast just the name of the alliance and extract a single element in one go
{
  $addFields: {
    alliance: { $arrayElemAt: ["$alliance.name", 0] }
  }
},

// Lastly, we $group on the airline.id, since we don't want to count the same airline twice.
// We take the $first alliance name to avoid duplicates. Then, we use $sortByCount to get our answer from the results
{
  $group: {
    _id: "$airline.id",
    alliance: { $first: "$alliance" }
  }
},
{
  $sortByCount: "$alliance"
}

// This produces the following output
{ "_id": "OneWorld", "count": 4 }
{ "_id": "SkyTeam", "count": 2 }
