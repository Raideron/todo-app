/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "0a0sjuocjldexu6",
    "created": "2024-04-01 11:44:04.495Z",
    "updated": "2024-04-01 11:44:04.495Z",
    "name": "todo_lists",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "xit3hor9",
        "name": "name",
        "type": "text",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      }
    ],
    "indexes": [],
    "listRule": null,
    "viewRule": null,
    "createRule": null,
    "updateRule": null,
    "deleteRule": null,
    "options": {}
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("0a0sjuocjldexu6");

  return dao.deleteCollection(collection);
})
