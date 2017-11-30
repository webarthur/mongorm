var MongORMDB = null
const ObjectID = require('mongodb').ObjectID
const errors = {
  no_collection: 'ORM has no collection configured.',
  no_db_selected: 'ORM has no batabase configured.',
}

const MongORM  = function (collection, obj) {
  const ORM = {

    db: null,
    docs: null,
    hasError: false,

    superMethods: [
      'findOne',
      'find',
      'updateOne',
      'update',
      'deleteOne',
      'delete'
    ],

    isArray: function (arr) {
      return arr instanceof Array
    },

    isString: function (str) {
      return typeof str === 'string'
    },

    setCollection (c, db) {
      if (!db) db = MongORMDB
      if (!db) db = ORM.db
      if (!db) {
        this.hasError = new Error(errors.no_db_selected)
        return Promise.reject(this.hasError)
      }
      ORM.db = db
      ORM.docs = db.collection(c)
      return ORM.docs
    },

    project (fields) {
      let obj = {}
      if (ORM.isString(fields)) fields = [fields]
      for (const field of fields) obj[field] = 1
      return obj
    },

    superArgs (args) {
      if (args[0] && ORM.isString(args[0])) args[0] = {_id: new ObjectID(args[0])}
      if (args[1] && ORM.isArray(args[1])) args[1] = ORM.project(args[1])
      return args
    },

    promised (fn, args) {
      if (!ORM.docs) return Promise.reject(new Error(errors.no_collection))

      // arguments with super powers
      if (args && ORM.superMethods.indexOf(fn) > -1) args = this.superArgs(args)

      // retorn a promessa, cross your fingers!
      return new Promise(function (resolve, reject) {
        var response = ORM.docs[fn].apply(ORM.docs, args)

        // some functions needs one more step to return the promise
        if (['aggregate', 'find', 'listIndexes'].indexOf(fn) > -1) {
          response = response.toArray()
        }

        // check if promise is ok
        response
        .then(function (data) {
          ORM.hasError = false
          return resolve(data)
        })
        .catch(function (err) {
          ORM.hasError = err
          return reject(err)
        })
      })
    },

    set () {
      arguments[1] = {$set: arguments[1]}
      return this.promised('update', arguments)
    },
    setOne () {
      arguments[1] = {$set: arguments[1]}
      return this.promised('updateOne', arguments)
    },
    setMany () {
      arguments[1] = {$set: arguments[1]}
      return this.promised('update', arguments)
    },

    collectionName () { return ORM.docs.collectionName },
    namespace () { return ORM.docs.namespace },
    readConcern () { return ORM.docs.readConcern },
    writeConcern () { return ORM.docs.writeConcern },
    hint () { return ORM.docs.hint },

    aggregate () { return this.promised('aggregate', arguments) },
    bulkWrite () { return this.promised('bulkWrite', arguments) },
    count () { return this.promised('count', arguments) },
    createIndex () { return this.promised('createIndex', arguments) },
    createIndexes () { return this.promised('createIndexes', arguments) },
    deleteMany () { return this.promised('deleteMany', arguments) },
    deleteOne () { return this.promised('deleteOne', arguments) },
    distinct () { return this.promised('distinct', arguments) },
    dropIndex () { return this.promised('dropIndex', arguments) },
    dropIndexes () { return this.promised('dropIndexes', arguments) },
    drop () { return this.promised('drop', arguments) },
    dropAllIndexes () { return this.promised('dropAllIndexes', arguments) },
    ensureIndex () { return this.promised('ensureIndex', arguments) },
    find () { return this.promised('find', arguments) },
    findOne () { return this.promised('findOne', arguments) },
    findOneAndDelete () { return this.promised('findOneAndDelete', arguments) },
    findOneAndReplace () { return this.promised('findOneAndReplace', arguments) },
    findOneAndUpdate () { return this.promised('findOneAndUpdate', arguments) },
    findAndModify () { return this.promised('findAndModify', arguments) },
    findAndRemove () { return this.promised('findAndRemove', arguments) },
    geoNear () { return this.promised('geoNear', arguments) },
    geoHaystackSearch () { return this.promised('geoHaystackSearch', arguments) },
    group () { return this.promised('group', arguments) },
    isCapped () { return this.promised('isCapped', arguments) },
    indexes () { return this.promised('indexes', arguments) },
    indexExists () { return this.promised('indexExists', arguments) },
    indexInformation () { return this.promised('indexInformation', arguments) },
    insert () { return this.promised('insert', arguments) },
    insertOne () { return this.promised('insertOne', arguments) },
    insertMany () { return this.promised('insertMany', arguments) },
    listIndexes () { return this.promised('listIndexes', arguments) },
    options () { return this.promised('options', arguments) },
    parallelCollectionScan () { return this.promised('parallelCollectionScan', arguments) },
    mapReduce () { return this.promised('mapReduce', arguments) },
    reIndex () { return this.promised('reIndex', arguments) },
    removeMany () { return this.promised('removeMany', arguments) },
    remove () { return this.promised('remove', arguments) },
    removeOne () { return this.promised('removeOne', arguments) },
    rename () { return this.promised('rename', arguments) },
    replaceOne () { return this.promised('replaceOne', arguments) },
    save () { return this.promised('save', arguments) },
    stats () { return this.promised('stats', arguments) },
    update () { return this.promised('update', arguments) },
    updateOne () { return this.promised('updateOne', arguments) },
    updateMany () { return this.promised('updateMany', arguments) }

    // TODO
    // initializeUnorderedBulkOp () { return this.promised('initializeUnorderedBulkOp', arguments) },
    // initializeOrderedBulkOp () { return this.promised('initializeOrderedBulkOp', arguments) },

  }

  if (collection) {
    ORM.setCollection(collection)
  }

  return Object.assign(ORM, obj)
}

MongORM.setDatabase = MongORM.setDB = function (db) {
  MongORMDB = db
}

module.exports = MongORM
