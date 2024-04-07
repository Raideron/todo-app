/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("0a0sjuocjldexu6")

  collection.listRule = "@request.auth.id != user_id.id"
  collection.viewRule = "@request.auth.id != user_id.id"
  collection.createRule = "@request.auth.id != user_id.id"
  collection.updateRule = "@request.auth.id != user_id.id"
  collection.deleteRule = "@request.auth.id != user_id.id"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("0a0sjuocjldexu6")

  collection.listRule = "@request.auth.id != \"\""
  collection.viewRule = "@request.auth.id != \"\""
  collection.createRule = "@request.auth.id != \"\""
  collection.updateRule = "@request.auth.id != \"\""
  collection.deleteRule = "@request.auth.id != \"\""

  return dao.saveCollection(collection)
})
