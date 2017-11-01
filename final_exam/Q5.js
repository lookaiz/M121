db.people.insertOne( {"_id": 0, "name": "Bernice Pope", "age": 69, "state": "WA"} );
db.people.insertOne( {"_id": 1, "name": "Eric Malone", "age": 57, "state": "NJ"} );
db.people.insertOne( {"_id": 2, "name": "Blanche Miller", "age": 35, "state": "TX"} );
db.people.insertOne( {"_id": 3, "name": "Sue Perez", "age": 64, "state": "TX"} );
db.people.insertOne( {"_id": 4, "name": "Ryan White", "age": 39, "state": "WA"} );
db.people.insertOne( {"_id": 5, "name": "Grace Payne", "age": 56, "state": "WA"} );
db.people.insertOne( {"_id": 6, "name": "Jessie Yates", "age": 53, "state": "NJ"} );
db.people.insertOne( {"_id": 7, "name": "Herbert Mason", "age": 37, "state": "TX"} );
db.people.insertOne( {"_id": 8, "name": "Jesse Jordan", "age": 47, "state": "WA"} );
db.people.insertOne( {"_id": 9, "name": "Hulda Fuller", "age": 25, "state": "WA"} );

db.people.createIndex({name : 1})
db.people.createIndex({state : 1})

var pipeline = [
    {"$project": { "state": 1, "name": 1, "age": 1}},
    {"$group" : { "_id": "$state", "avg_age": {"$avg": "$age"}}},
    {"$sort": {"_id": 1}}
  ]
db.people.aggregate(pipeline, {explain: true})