// The correct answer is the following :

var pipeline = [
    {"$sort": {"state": 1}},
    {"$project": { "state": 1, "name": 1, "age": 1}},
    {"$group" : { "_id": "$state", "avg_age": {"$avg": "$age"}}},
  ]

// In this case, by moving the $sort stage to be execute before the $project, allow the usage of the index on the state field.

// We can see this improvement by explaining the pipeline:

* Executing the original pipeline we get the following explain output
db.people.explain().aggregate([
    {"$project": { "state": 1, "name": 1, "age": 1}},
    {"$group" : { "_id": "$state", "avg_age": {"$avg": "$age"}}},
    {"$sort": {"state": 1}},
  ])
  {
  "stages": [
    {
      "$cursor": {
        "query": {

        },
        "fields": {
          "age": 1,
          "name": 1,
          "state": 1,
          "_id": 1
        },
        "queryPlanner": {
          "plannerVersion": 1,
          "namespace": "test.people",
          "indexFilterSet": false,
          "parsedQuery": {

          },
          "winningPlan": {
            "stage": "COLLSCAN",
            "direction": "forward"
          },
          "rejectedPlans": [ ]
        }
      }
    },
    {
      "$project": {
        "_id": true,
        "name": true,
        "age": true,
        "state": true
      }
    },
    {
      "$group": {
        "_id": "$state",
        "avg_age": {
          "$avg": "$age"
        }
      }
    },
    {
      "$sort": {
        "sortKey": {
          "_id": 1
        }
      }
    }
  ],
  "ok": 1
}

// In this case the winning plan would be a COLLSCAN, which is the least performant plan to execute.

* Executing an explain on the optimized pipeline we get a different picture

db.people.explain().aggregate( [
    {"$sort": {"state": 1}},
    {"$project": { "state": 1, "name": 1, "age": 1}},
    {"$group" : { "_id": "$state", "avg_age": {"$avg": "$age"}}},
  ]
)
{
"stages": [
  {
    "$cursor": {
      "query": {

      },
      "sort": {
        "state": 1
      },
      "fields": {
        "age": 1,
        "name": 1,
        "state": 1,
        "_id": 1
      },
      "queryPlanner": {
        "plannerVersion": 1,
        "namespace": "test.people",
        "indexFilterSet": false,
        "parsedQuery": {

        },
        "winningPlan": {
          "stage": "FETCH",
          "inputStage": {
            "stage": "IXSCAN",
            "keyPattern": {
              "state": 1
            },
            "indexName": "state_1",
            "isMultiKey": false,
            "multiKeyPaths": {
              "state": [ ]
            },
            "isUnique": false,
            "isSparse": false,
            "isPartial": false,
            "indexVersion": 2,
            "direction": "forward",
            "indexBounds": {
              "state": [
                "[MinKey, MaxKey]"
              ]
            }
          }
        },
        "rejectedPlans": [ ]
      }
    }
  },
  {
    "$project": {
      "_id": true,
      "name": true,
      "age": true,
      "state": true
    }
  },
  {
    "$group": {
      "_id": "$state",
      "avg_age": {
        "$avg": "$age"
      }
    }
  }
],
"ok": 1
}
// In this case, we can see that the selected query plan is an IXSCAN,
// which means that we will be using the index "indexName": "state_1" to support our pipeline.

// The two other options do not affect the overall execution plan of the pipeline.
