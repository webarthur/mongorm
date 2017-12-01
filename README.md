# MongORM.js

ORM for MongoDB

## Installation

First install [node.js](http://nodejs.org/) and [mongodb](https://www.mongodb.org/downloads). Then:

```sh
$ npm install mongorm
```

## Connecting to MongoDB and configure MongORM

```javascript
const MongoClient = require('mongodb').MongoClient
const MongoORM = require('mongorm')

MongoClient.connect(mongoString, function (err, db) {
  if (err) return console.error(err)
  MongoORM.setDatabase(db)
})
```

## ORM Example

After connect and configure:

```javascript
// Posts.js

const MongoORM = require('mongorm')

const Posts = module.exports = MongORM('spots', {
  
  // we can use async/await functions
  async getFromUser (user_ai) {
    
    // we can find by ObjectId (even if it is a string)
    const spots = await Posts.find(user_ai)

    // we can use the "hasError" to check if everything is ok
    if (Posts.hasError) return new Error('Get posts from user failed.')

    // return results as array
    return spots
  }

  // or use promises with callbacks
  getFromTag (categoryID, callbackSucess, callbackError) {
    Posts.find({cat: categoryID})
    .then(function (data) {
      callbackSucess(data)
    })
    .catch(function (err) {
      callbackError(err)
    })
  }
})

```
