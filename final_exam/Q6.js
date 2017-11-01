// PIPELINE 1
--------------
var pipeline = [
	{
		"$sort": {"name": 1}
	},
	{
		"$project":
		{
			"$name": 1,
			"phone":
			{
				"$concat": [
					{"arrayElemAt": [{"$split": ["$phone", " "]}, 0]},
					"*********"
				]
			},
			"ssn":
			{
				"$concat": [
					"********",
					{"$arrayElemAt": [{"$split": ["$ssn", "-"]}, 2]}
				]
			}
		}
	}
]
db.createView("people", "people_contacts", pipeline);
PIPELINE 1 : NO => wrong method signature (db.createView(<view>, <source>, <pipeline>, <collation>)


// PIPELINE 2
--------------
var pipeline = [
	{
		"$project":
		{
			"$name": 1,
			"phone":
			{
				"$concat": [
					{"arrayElemAt": [{"$split": ["$phone", " "]}, 0]},
					"*********"
				]
			},
			"ssn":
			{
				"$concat": [
					"********",
					{"$arrayElemAt": [{"$split": ["$ssn", "-"]}, 2]}
				]
			}
		}
	}
]
db.runCommand({
	"create": "people_contacts",
	"viewOn": "people",
	"pipeline": pipeline
}
PIPELINE 2 : NO => people should be sort by 'name'

// PIPELINE 3
--------------
var pipeline = [
	{
		"$sort": {"state": 1}
	},
	{
		"$project":
		{
			"$name": 1,
			"phone":
			{
				"$concat": [
					{"arrayElemAt": [{"$split": ["$phone", " "]}, 0]},
					"*********"
				]
			},
			"ssn":
			{
				"$concat": [
					"********",
					{"$arrayElemAt": [{"$split": ["$ssn", "-"]}, 2]}
				]
			}
		}
	}
]
db.runCommand({
	"create": "people",
	"viewOn": "people",
	"pipeline": pipeline
})
PIPELINE 3 : NO => 	people should not be sort by 'state'
					<source> and <view> cannot be the same	

// PIPELINE 4 (exactly the same than pipeline 1)
--------------
var pipeline = [
	{
		"$sort": {"name": 1}
	},
	{
		"$project":
		{
			"$name": 1,
			"phone":
			{
				"$concat": [
					{"arrayElemAt": [{"$split": ["$phone", " "]}, 0]},
					"*********"
				]
			},
			"ssn":
			{
				"$concat": [
					"********",
					{"$arrayElemAt": [{"$split": ["$ssn", "-"]}, 2]}
				]
			}
		}
	}
]
db.createView("people_contacts", "people", pipeline);
PIPELINE 4 : YES => method signature is correct (db.createView(<view>, <source>, <pipeline>, <collation>)








