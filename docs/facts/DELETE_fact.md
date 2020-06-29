# Facts Endpoint

Deleting a fact requires the fact id as a  parameter.

**URL** : `/api/facts/id/:fact_id`

**Method** : `DELETE`

**Auth required** : NO

**Permissions required** : None

**Data constraints**

Must contain `fact_id` as an integer and a parameter.

`~/api/facts/id/:fact_id`

**Data example**

`~/api/facts/id/2`

## Success Response

**Condition** : Fact was deleted.

**Code** : `204 NO CONTENT`

## Error Responses

**Condition** : Fact doesn't exist.

**Code** : `404 NOT FOUND`

**Content example** 

```json
{
    "error": "Fact doesn't exist"
}
```