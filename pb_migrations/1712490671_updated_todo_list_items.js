/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("zbbvn5686pj6x8w")

  collection.listRule = "@request.auth.id != todo_list_id.user_id.id"
  collection.viewRule = "@request.auth.id != todo_list_id.user_id.id"
  collection.createRule = "@request.auth.id != todo_list_id.user_id.id"
  collection.updateRule = "@request.auth.id != todo_list_id.user_id.id"
  collection.deleteRule = "@request.auth.id != todo_list_id.user_id.id"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("zbbvn5686pj6x8w")

  collection.listRule = "@request.auth.id != \"\""
  collection.viewRule = "@request.auth.id != \"\""
  collection.createRule = "@request.auth.id != \"\""
  collection.updateRule = "@request.auth.id != \"\""
  collection.deleteRule = "@request.auth.id != \"\""

  return dao.saveCollection(collection)
})
