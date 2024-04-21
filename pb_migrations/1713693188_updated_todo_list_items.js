/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("zbbvn5686pj6x8w")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "yoojipah",
    "name": "intervalInDays",
    "type": "number",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "min": 0,
      "max": null,
      "noDecimal": false
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("zbbvn5686pj6x8w")

  // remove
  collection.schema.removeField("yoojipah")

  return dao.saveCollection(collection)
})
