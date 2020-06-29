# Login

Collect a Token for registered User.

• POST `/api/auth/login`

**URL** : `/api/login/`

**Method** : `POST`

**Data constraints**

```json
{
    "email": "[valid email address]",
    "password": "[ password in plain text]"
}
```

**Data example**

```json
{
    "email": "iloveauth@example.com",
    "password": "abcd1234"
}
```

## Success Response

**Code** : `200 OK`

**Content example**

```json
{
    "authToken": "93144b288eb1fdccbe46d6fc0f241a51766ecd3d",
    "user_id": 2
}
```

## Error Response

**Condition** : If 'email' or 'password' is missing.

**Code** : `400 BAD REQUEST`

**Content** :

```json
{
    "error": [
        "Missing [email, password] in request body"
    ]
}
```

**Condition** : If 'email' and 'password' combination is wrong.

**Code** : `400 BAD REQUEST`

**Content** :

```json
{
    "error": [
        "Incorrect email or password"
    ]
}
```

**Condition** : If some issue not previously defined.

**Code** : `500 SERVER ERROR`

**Content** :

```json
{
    "error": [
        "Couldn't create JWTToken"
    ]
}
```