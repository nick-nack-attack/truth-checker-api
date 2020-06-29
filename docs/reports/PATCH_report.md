# Reports Endpoint

Facts can be reported i.e. for spam or content. These reports are available upon signing in to the admin account. If a fact has been reported more than once, it will increment `number_of_reports`,

**URL** : `/api/reports/id/:report_id`

**Method** : `PATCH`

**Auth required** : NO

**Permissions required** : None

**Data constraints**

Must contain `report_id` as an integer and a parameter and the report_status of either `Processing`, `Approved`, or `Denied` the report.

`~/api/reports/id/:report_id`

```json
{
    "report_status": "[Processing, Approved, Denied]"
}
```

**Data example**

`~/api/reports/id/10`

```json
{
    "report_status": "Approved"
}
```

## Success Response

**Condition** : If everything is OK, will return status.

**Code** : `201 CREATED`

## Error Responses

**Condition** : Report_status not included in request body.

**Code** : `400 BAD REQUEST`

**Content example**

```json
{
    "error": "Request body must include report_status 'Processing', 'Approved', or 'Denied'"
}
```

### Or

**Condition** : Report doesn't exist.

**Code** : `404 NOT FOUND`

**Content example**

```json
{
    "error": "Report doesn't exist"
}
```