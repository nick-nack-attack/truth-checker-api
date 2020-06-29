# Facts Endpoint

Editing a specific fact requires the fact id as a  parameter and any fields that need to be changed in the body.

**URL** : `/api/facts/id/:fact_id`

**Method** : `PATCH`

**Auth required** : NO

**Permissions required** : None

**Data constraints**

Must contain `fact_id` as an integer and a parameter and field(s) in body.

`~/api/facts/id/:fact_id`

**Data example**

`~/api/facts/id/16`

```json
{
    "title": "Pineapples again",
}
```

## Success Response

**Condition** : If everything is OK, will return fact.

**Code** : `201 CREATED`

**Content example**

```json
{
    "fact_id": 16,
    "title": "pineapples",
    "user_id": 2,
    "status": "Pending",
    "date_submitted": "2020-06-27T13:59:01.220Z",
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
