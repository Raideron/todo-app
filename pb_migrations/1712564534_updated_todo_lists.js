/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("0a0sjuocjldexu6")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "7obi6x8z",
    "name": "last_opened",
    "type": "date",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "min": "",
      "max": ""
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("0a0sjuocjldexu6")

  // remove
  collection.schema.removeField("7obi6x8z")

  return dao.saveCollection(collection)
})
