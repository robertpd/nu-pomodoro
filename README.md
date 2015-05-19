http://nu-pomodoro.herokuapp.com/

## Getting Started

Requirement:

- NodeJS 0.12+


Install dependencies:

```
npm install
```

## Running development server

Run gulp:

```
gulp watch
```

Run server:

```
npm run start-dev
```

## Testing

```
npm test
```

---

### Setting up Heroku for deployment

1. Install the [Heroku toolbelt](https://toolbelt.heroku.com/).

2. Login to the account using `heroku login` (email: **engineering@nulogy.com**, password: *usual engineering password*).

3. Add remote: `heroku git:remote nu-pomodoro`.


## Deploying to production

1. Build production assets:

    ```
    npm run build
    ```

2. Deploy to Heroku:

    ```
    heroku push origin master
    ```

