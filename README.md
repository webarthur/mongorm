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

const Posts = module.exports = MongORM('posts', {
  
  // we can use async/await functions
  async getFromUser (user_id) {
    
    // we can find by ObjectId (even if it is a string)
    const posts = await Posts.find(user_id)

    // we can use the "hasError" to check if everything is ok
    if (Posts.hasError) return new Error('Get posts from user failed.')

    // return results as array
    return posts
  }

  // or use promises with callbacks
  getFromCategory (categoryID, callbackSucess, callbackError) {
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

## Using the ORM

```javascript
// index.js

const MongoClient = require('mongodb').MongoClient
const MongoORM = require('mongorm')

MongoClient.connect(mongoString, async function (err, db) {
  if (err) return console.error(err)
  MongoORM.setDatabase(db)
	
  // with callback
  Posts.getFromCategory(15, function (data) {
    console.log(data)
  })

  // with async/await
  const posts = await Posts.getFromUser('5a208716aa97e3107751b041')
  if (Posts.hasError) return console.error(Posts.hasError)
  console.log(posts)
})

```
