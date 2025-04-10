/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("0a0sjuocjldexu6")

  collection.listRule = "@request.auth.id != \"\""

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("0a0sjuocjldexu6")

  collection.listRule = "@request.auth.id != user_id.id"

  return dao.saveCollection(collection)
})
