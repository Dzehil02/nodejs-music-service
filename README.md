# Home Library Music Service
- Authentication and Authorization
- Error Handling
- Logging
- Docker
- Prisma
### 1. Download this repository

```
git clone {repository URL} or Download ZIP
```

### 2. Create _.env_ file

Add **environment variables** (see _.env.example_ file) **or just rename _.env.example_ file to _.env_ file**

### 3. Run Application

> _***- We can use Docker:***_<br>

1. Open Docker Desktop
2. Run Docker Container:
    - _Open terminal and run app:_
    - `npm run docker:up (or docker-compose up)`

> _***- We can start app in local machine:***_

1. Set up DATABASE_URL in the .env file to connect to the database
2. Install dependencies `npm install`
3. Start application `npm run start:dev`

### 4. Use Home Library Service

-   After starting the app on port (**4000 as default**) you can open
    in your browser OpenAPI documentation by typing http://localhost:4000/doc

-   **Sign up and login to get access token** and use it for requests
-   All requests are available by URL http://localhost:4000/

_Examples:_

```
get request -> http://localhost:4000/artist

response -> [
    {
        "id": "80458200-dd5d-11ee-a97d-c5cef3c97348",
        "name": "Freddie Mercury",
        "grammy": false
    }
]
------------------------------------------------------
get request -> http://localhost:4000/track

response -> [
    {
        "id": "7fbbae03-dd5c-11ee-a686-ed5a6659a3e1",
        "name": "The Show Must Go On",
        "artistId": "80458200-dd5d-11ee-a97d-c5cef3c97348",
        "albumId": "201702a0-dd5d-11ee-82b9-f35a2947a09a",
        "duration": 262
    }
]
```

-   To change the logging level, set the **LOG_LEVEL** environment variable (verbose | debug | log | warn | error)
-   The file size for rotation can be configured using the **MAX_FILE_SIZE** environment variable

### 5. Run vulnerabilities scanning

```
npm run docker:scout:app
npm run docker:scout:db
```

### 6. Run tests

**After application running open new terminal and enter:**

_To run all tests with authorization_

```
npm run test:auth (or npm run docker:test)
```

_To run refresh tests_

```
npm run test:refresh (or npm run docker:test:refresh)
```

### 7. For auto-fix and format you can use:

```
npm run lint
```

```
npm run format
```
