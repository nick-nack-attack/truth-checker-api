# Reports Endpoint

Facts can be reported i.e. for spam or content. These reports are available upon signing in to the admin account. If a fact has been reported more than once, it will increment `number_of_reports`,

**URL** : `/api/reports`

**Method** : `POST`

**Auth required** : NO

**Permissions required** : None

**Data constraints**

Must contain `fact_id` in body as integer. 

```json
{
    "fact_id": "[integer]"
}
```

**Data example** All fields must be sent.

```json
{
    "fact_id": 2
}
```

## Success Response

**Condition** : If everything is OK, will return `report_id`, `date_created`, and `report_status` as `"Processing"`.

**Code** : `201 CREATED`

**Content example**

```json
{
    "report_id": 19,
    "fact_id": 3,
    "date_created": "2020-06-29T04:00:57.722Z",
    "report_status": "Processing"
}
```

## Error Responses

**Condition** : Fact_id not provided in request body as an integer.

**Code** : `400 BAD REQUEST`

**Content example**

```json
{
    "error": "Must include fact_id as integer"
}
```

### Or

**Condition** : Fact being reported doesn't exist.

**Code** : `400 BAD REQUEST`

**Content example**

```json
{
    "error": "Fact doesn't exist"
}
```