# Reports Endpoint

Facts can be reported i.e. for spam or content. These reports are available upon signing in to the admin account. If a fact has been reported more than once, it will increment `number_of_reports`,

**URL** : `/api/reports`

**Method** : `GET`

**Auth required** : NO

**Permissions required** : None

**Data constraints** : None

### Success Response

**Condition** : Should get all the reports.

**Code** : `200 OK`

**Content example**

```json
    {
        "fact_id": 5,
        "title": "The Moon is a spaceship",
        "user_id": 2,
        "fact_status": "Pending",
        "date_submitted": "2020-06-20T06:19:49.267+00:00",
        "number_of_reports": 2
    },
    ...
```

### Error Response

Not currently supported.
