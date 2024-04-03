/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("zbbvn5686pj6x8w")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "r47yw2yo",
    "name": "isCompleted",
    "type": "bool",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {}
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("zbbvn5686pj6x8w")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "r47yw2yo",
    "name": "completed",
    "type": "bool",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {}
  }))

  return dao.saveCollection(collection)
})
