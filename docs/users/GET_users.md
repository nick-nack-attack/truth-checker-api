# Users Endpoint

The MVP release has two users. The public user account and admin account.

**URL** : `/api/users`

**Method** : `GET`

**Auth required** : NO

**Permissions required** : None

**Data constraints** : None

### Success Response

**Condition** : Should get all the users.

**Code** : `200 OK`

**Content example**

```json
    {
        "user_id": 1,
        "role": "Admin",
        "email": "admin@dtf.gov",
        "password": "$2a$12$fWlkA.PfrRTQaG2Gqu1trO/JXF7R7biva7Wk98MAQ1ua/X6/bWLJy",
        "date_created": "2020-01-01T00:00:00.000Z"
    },
    ...
```

### Error Response

Not currently supported.
