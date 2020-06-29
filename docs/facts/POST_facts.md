# Facts Endpoint

Posting a fact can be done by authenticated and non-authenticated users.

**URL** : `/api/facts`

**Method** : `POST`

**Auth required** : NO

**Permissions required** : None

**Data constraints**

Must contain `title` and `user_id`. 
MVP `user_id` expects either `user_id: 1` or `user_id: 2`.

```json
{
    "title": "[unicode no char max]",
    "user_id": "[integer]"
}
```

**Data example** All fields must be sent.

```json
{
    "title": "Pineapples are the best fruit",
    "user_id": 2
}
```

## Success Response

**Condition** : If everything is OK, will return `fact_id`, `date_submitted`, and status `Pending`.

**Code** : `201 CREATED`

**Content example**

```json
{
    "fact_id": 18,
    "title": "Pineapples are the best fruit",
    "user_id": 2,
    "status": "Pending",
    "date_submitted": "2020-06-29T02:50:51.565Z",
    "date_under_review": null,
    "date_approved": null,
    "date_not_true": null
}
```

## Error Responses

**Condition** : Title not provided.

**Code** : `400 BAD REQUEST`

**Content example**

```json
{
    "error": "Missing title in request"
}
```

### Or

**Condition** : User_id not provided.

**Code** : `400 BAD REQUEST`

**Content example**

```json
{
    "error": "Missing user_id in request"
}
```

### Or

**Condition** : Invalid User_id. 

**Code** : `400 BAD REQUEST`

**Content example**

```json
{
    "message": "server error"
}
```
