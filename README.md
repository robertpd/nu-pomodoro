http://nu-pomodoro.herokuapp.com/

## Getting Started

Requirement:

- NodeJS 0.10+

Install dependencies:
```
npm install
```

---

## Running development server

Run webpack dev server (for assets):
```
npm run dev-server
```

Run server:
```
npm run start-dev
```

### Testing

To run tests, use:
```
npm test
```

To start a watch test task:
```
npm run test-watch
```

---

## Running production server

Build assets:
```
npm run build
```

Start server:
```
npm start
```

---

## Setting up Heroku for deployment

1. Install the [Heroku toolbelt](https://toolbelt.heroku.com/).

2. Login to the account using `heroku login`:
    - email: engineering@nulogy.com
    - password: *refer to passwords*

3. Add remote: `heroku git:remote nu-pomodoro`.

### Deploying to production

1. Build production assets:
    ```
    npm run build
    ```

2. Bump up asset revisions.
    ```
    npm run bump
    ```

3. Deploy to Heroku:
    ```
    npm run deploy
    ```

