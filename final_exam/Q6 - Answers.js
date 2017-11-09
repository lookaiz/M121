// The correct answer is :

var pipeline = [
  {
    "$sort": {"name": 1}
  },
  {
    "$project": {"name":1,
    "phone": {
      "$concat": [
        {"$arrayElemAt": [{"$split": ["$phone", " "]}, 0]} ,
        "*********"  ]
      },
    "ssn": {
      "$concat": [
        "********",
        {"$arrayElemAt": [{"$split": ["$ssn", "-"]}, 2]}
      ]
    }
  }
}
];
db.createView("people_contacts", "people", pipeline);

// people_contacts view was created using an initial $sort stage.
// We can see this when comparing the find results between people collection and the view.

// After sorting the results the people_contacts presents the documents with two computed (redacted) fields, phone and ssn.
{
  "$project": {"name":1,
  "phone": {
    "$concat": [
      {"$arrayElemAt": [{"$split": ["$phone", " "]}, 0]} ,
      "*********"  ]
    },
  "ssn": {
    "$concat": [
      "********",
      {"$arrayElemAt": [{"$split": ["$ssn", "-"]}, 2]}
    ]
  }
}

// And finally, to create the view using command createView
db.createView("people_contacts", "people", pipeline);

// All other options are incorrect, either because they do not use the correct pipeline
// or due to the fact that the view creation command is incorrect.

