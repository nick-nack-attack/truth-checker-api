# Facts Endpoint

Getting a specific fact requires the fact id as a  parameter.

**URL** : `/api/facts/id/:fact_id`

**Method** : `GET`

**Auth required** : NO

**Permissions required** : None

**Data constraints**

Must contain `fact_id` as an integer and a parameter.

`~/api/facts/id/:fact_id`

**Data example**

`~/api/facts/id/2`

## Success Response

**Condition** : If everything is OK, will return fact.

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
}
```

## Error Responses

**Condition** : Fact doesn't exist.

**Code** : `404 NOT FOUND`

**Content example**

```json
{
    "error": "Fact doesn't exist"
}
```
