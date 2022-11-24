# Locations API
Location API provides geographical data of test centres and a geographical search facility.

Azure Function app with multiple functions:

-  **test-centres**: http trigger function for api post 'test-centres' endpoint, which will return the closest test centres based on the term you pass in

Example payload:

```json
{
	"region": "gb",
	"term": "Birmingham",
	"numberOfResults": 5
}
```

  -  **refresh-cache**: http trigger function for api get 'refresh-cache' endpoint, which retrives and caches current test centre locations from Dynamics
  - **refresh-cache-timer**:  timer trigger function to periodically call the 'refresh-cache' endpoint

Each has its own folder in the project root with a `function.json` config

## Versions
All http triggered functions are versioned. The table below shows the latest and all available versions.
|Function| Latest Version  |  Available Versions |  
|--|--|--|
| test-centres | 1 | 1
| refresh-cache | 1 | 1

To use a specific endpoint you must provide the version number as part of the url  for example:
```
https://my-api.com/api/v1/test-centres
```
## Local Settings
To run locally you need to create a local.settings.json file, a example template can be created using:

 `npm run copy-config`

## Build

Install node modules:

```
npm install
```

Compile the ts source:

```
npm run build
```

## Deploy

Deploy via VSCode with the Azure Functions extension

## Tests

All tests are housed in `tests/(unit|int)/(module)/*.test.ts`

Run all the tests:

```
npm run test
```

Watch the tests:

```
npm run test:watch
```

Run test coverage:

```
npm run test:coverage
```

See the generated `coverage` directory for the results. Output types are editable in `package.json`.
