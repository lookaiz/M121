// imdb.rating is at least 7
// genres does not contain "Crime" or "Horror"
// rated is either "PG" or "G"
// languages contains "English" and "Japanese"

db.movies.aggregate([{
  "$match": { "imdb.rating": { "$gte": "7" } }
}]).pretty()
