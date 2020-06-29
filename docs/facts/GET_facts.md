# Facts Endpoint

Facts are available for logged in and public users.

**URL** : `/api/facts`

**Method** : `GET`

**Auth required** : NO

**Permissions required** : None

**Data constraints** : None

### Success Response

**Condition** : Should get all the facts.

**Code** : `200 OK`

**Content example**

```json
    {
        "fact_id": 3,
        "title": "Chocolate is sweet",
        "user_id": 2,
        "status": "Approved",
        "date_submitted": "2020-06-20T04:37:37.232Z",
        "date_under_review": null,
        "date_approved": null,
        "date_not_true": null
    },
    ...
```

### Error Response

Not currently supported.
