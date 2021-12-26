# Order Service

[online url: https://github.com/bsdfzzzy/order-service](https://github.com/bsdfzzzy/order-service)

## Commands

1. install dependencies: `npm i`, using npm ci on the workflows so keep the package-lock.json.
2. run locally: `npm run docker:dev`
3. run unit test: `npm run unit-test`
4. run integration test:
   1. `npm run prepare-for-integration-test`
   2. `npm run migration:run:dev`
   3. `npm run jest-integration-test`
   4. There is still an issue with supertest and axios. Less of time to fix that... The functionality can also be tested by hand. Apologize for that...
