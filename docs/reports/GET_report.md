# Reports Endpoint

Facts can be reported i.e. for spam or content. These reports are available upon signing in to the admin account. If a fact has been reported more than once, it will increment `number_of_reports`,

**URL** : `/api/reports/id/:report_id`

**Method** : `GET`

**Auth required** : NO

**Permissions required** : None

**Data constraints**

Must contain `report_id` as an integer and a parameter.

`~/api/reports/id/:report_id`

**Data example**

`~/api/reports/id/13`

## Success Response

**Condition** : If everything is OK, will return report.

**Code** : `200 OK`

**Content example**

```json
{
    "report_id": 13,
    "fact_id": 5,
    "date_created": "2020-06-24T14:18:47.971Z",
    "report_status": "Processing"
}
```

## Error Responses

**Condition** : Fact doesn't exist.

**Code** : `404 NOT FOUND`

**Content example**

```json
{
    "error": "Report doesn't exist"
}
```
