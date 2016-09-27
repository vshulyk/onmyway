#### Developer help #####
**!!!Please lint your code before commit!!!**

Build status:

[![CircleCI](https://circleci.com/bb/vshulyk/onmyway.svg?style=svg&circle-token=ac9ebf6506a224c957a925815b55db360f1fae0c)](https://circleci.com/bb/vshulyk/onmyway)

Live demo: [https://onmyway.ga](https://onmyway.ga)

As we use gps and https is required by google, you will need to connect to https both webpack server and backend.
https://localhost:8080

**To prevent untrasted cert issue, until we will have our own good one, please go to the 
https://localhost:3090 and accept this one**

```
	> git clone git@bitbucket.org:vshulyk/reduxmapdemo.git
	> cd ReduxSimpleStarter
	> npm install
	> npm start
	> cd server
	> node index.js
```

**Tests**

```
#Lint: 
npm run lint

#Coverage
npm run test:cover
```