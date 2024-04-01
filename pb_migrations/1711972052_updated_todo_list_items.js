/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("zbbvn5686pj6x8w")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "upntik3s",
    "name": "todo_list_id",
    "type": "relation",
    "required": true,
    "presentable": false,
    "unique": false,
    "options": {
      "collectionId": "0a0sjuocjldexu6",
      "cascadeDelete": true,
      "minSelect": null,
      "maxSelect": 1,
      "displayFields": null
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("zbbvn5686pj6x8w")

  // remove
  collection.schema.removeField("upntik3s")

  return dao.saveCollection(collection)
})
