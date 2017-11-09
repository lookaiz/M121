var pipeline = [{
    "$project": {
      "surname_capital": { "$substr": [{"$arrayElemAt": [ {"$split": [ "$name", " " ] }, 1]}, 0, 1 ] },
      "name_size": {  "$add" : [{"$strLenCP": "$name"}, -1]},
      "name": 1
    }
  },
  {
    "$group": {
      "_id": "$name_size",
      "word": { "$push": "$surname_capital" },
      "names": {"$push": "$name"}
    }
  },
  {
    "$project": {
      "word": {
        "$reduce": {
          "input": "$word",
          "initialValue": "",
          "in": { "$concat": ["$$value", "$$this"] }
        }
      },
      "names": 1
    }
  },
  {
    "$sort": { "_id": 1}
  }
]

// For this lab we picked the first letter of each person surname, surname_capital,
// by splitting the name into an array
{"$split": [ "$name", " " ] }

// And by gathering the first letter of the surname using $substr and $arrayElemAt:
{ "$substr": [{"$arrayElemAt": [ {"$split": [ "$name", " " ] }, 1]}, 0, 1 ] }

// We've also captured the number of all alphanumeric characters of the name field,
// except " ":

"name_size": {  "$add" : [{"$strLenCP": "$name"}, -1]}

// After grouping all first capital letters into word array,
// and all name into names values by the name_size:
{
  "$group": {
    "_id": "$name_size",
    "word": { "$push": "$surname_capital" },
    "names": {"$push": "$name"}
  }
},

// We then $reduced the resulting word array into a single string:
{
  "$project": {
    "word": {
      "$reduce": {
        "input": "$word",
        "initialValue": "",
        "in": { "$concat": ["$$value", "$$this"] }
      }
    },
    "names": 1
  }
}

// And finally sort the result:
{
  "$sort": { "_id": 1}
}