# API Documentation
## Fetch All Posts
API endpoint to fetch all posts in database  
**Endpoint**: `GET /posts`  

### Response
#### 200 OK
Returned when request success
```
{
    code: number,
    result: string,
    data: Post[]
}
```
#### 500 Internal Server Error
Returned when server have unexpected internal error
```
{
    code: number,
    result: string,
    message: string,
}
```

## Fetch a Post
Endpoint to fetch a post, where `id` is a post identifier as integer  
**Endpoint**: `GET /posts/:id`

### Response
#### 200 OK
Returned when request success
```
{
    code: number,
    result: string,
    data: Post
}
```
#### 400 Bad Request
Returned when path parameter (`id`) is missing or invalid
```
{
    code: number,
    result: string,
    message: string,
}
```
#### 404 Not Found
Returned when server cannot find post with id: `id`
```
{
    code: number,
    result: string,
    message: string,
}
```
#### 500 Internal Server Error
Returned when server have unexpected internal error
```
{
    code: number,
    result: string,
    message: string,
}
```

## Create a Post
Endpoint to create a post  
**Endpoint**: `POST /posts`

### Body Structure
Request must have this object in its body
```
{
    title: string -- max 55
    content: string -- max 255
}
```

### Response
#### 200 OK
Returned when request success
```
{
    code: number,
    result: string,
    data: Post
}
```
#### 400 Bad Request
Returned when request body is missing or invalid
```
{
    code: number,
    result: string,
    message: string,
}
```
#### 500 Internal Server Error
Returned when server have unexpected internal error
```
{
    code: number,
    result: string,
    message: string,
}
```

## Modify a Post
Endpoint to modify a post, where `id` is post identifier in integer  
**Endpoint**: `PUT /posts/:id`

### Body Structure
Request must have this object in its body
```
{
    title: string -- max 55
    content: string -- max 255
}
```

### Response
#### 200 OK
Returned when request success
```
{
    code: number,
    result: string,
    data: Post
}
```
#### 400 Bad Request
Returned when request body or path parameter is missing or invalid
```
{
    code: number,
    result: string,
    message: string,
}
```
#### 404 Not Found
Returned when server cannot find post with id: `id`
```
{
    code: number,
    result: string,
    message: string,
}
```
#### 500 Internal Server Error
Returned when server have unexpected internal error
```
{
    code: number,
    result: string,
    message: string,
}
```

## Delete a Post
Endpoint to delete a post, where `id` is post identifier in integer  
**Endpoint**: `DELETE /posts/:id`

### Response
#### 200 OK
Returned when request success
```
{
    code: number,
    result: string,
    data: Post
}
```
#### 400 Bad Request
Returned when path parameter is missing or invalid
```
{
    code: number,
    result: string,
    message: string,
}
```
#### 404 Not Found
Returned when server cannot find post with id: `id`
```
{
    code: number,
    result: string,
    message: string,
}
```
#### 500 Internal Server Error
Returned when server have unexpected internal error
```
{
    code: number,
    result: string,
    message: string,
}
```