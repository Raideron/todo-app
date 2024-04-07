/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("zbbvn5686pj6x8w")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "3vrdv7ht",
    "name": "startDate",
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
  const collection = dao.findCollectionByNameOrId("zbbvn5686pj6x8w")

  // remove
  collection.schema.removeField("3vrdv7ht")

  return dao.saveCollection(collection)
})
