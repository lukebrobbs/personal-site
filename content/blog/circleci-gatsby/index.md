---
title: Running tests in a pipeline with Gatsby and CircleCi
date: "2019-05-01T22:12:03.284Z"
---

CI/CD is a huge part of modern day development, this guide shows how to set up a basic pipeline for a `Gatsby` project, running a set of unit tests using `CircleCi`.

#### Create a new project

To create a Gatsby project, run the following command:

```shell
npx gatsby new circleci-with-gatsby
```

This will create all the base files needed for a new Gatsby project (in this case in a directory named `circleci-with-gatsby`). For more information about the `npx` command, see the [docs](https://blog.npmjs.org/post/162869356040/introducing-npx-an-npm-package-runner).

#### Install Jest and Create test directory

For this example, we are going to use [Jest](https://jestjs.io/docs/en/getting-started) as our test runner. We will need to install Jest, as well as a few extra packages required for a Gatsby project.

```shell
npm install --save-dev jest babel-jest react-test-renderer babel-preset-gatsby identity-obj-proxy
```

A new Gatsby project is not created with a directory for tests. Create a `__tests__` directory in the root of your project.

#### Create config file for Jest

The following is an extract from the Gatsby docs, as to how to configure Jest to work correctly. The full article can be found [here](https://www.gatsbyjs.org/docs/unit-testing/).

As Gatsby handles its own [Babel](https://babeljs.io/docs/en/) configuration, we will need to manually tell Jest to use `babel-jest`. The easiest way to do this, is to create a `jest.config.js` file in the root of our project:

```js
//jest.config.js

module.exports = {
  transform: {
    "^.+\\.jsx?$": `<rootDir>/jest-preprocess.js`,
  },
  moduleNameMapper: {
    ".+\\.(css|styl|less|sass|scss)$": `identity-obj-proxy`,
    ".+\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": `<rootDir>/__mocks__/file-mock.js`,
  },
  testPathIgnorePatterns: [`node_modules`, `.cache`],
  transformIgnorePatterns: [`node_modules/(?!(gatsby)/)`],
  globals: {
    __PATH_PREFIX__: ``,
  },
  testURL: `http://localhost`,
  setupFiles: [`<rootDir>/loadershim.js`],
}
```

Let’s go over the content of this configuration file:

The `transform` section tells Jest that all `js` or `jsx` files need to be transformed using a `jest-preprocess.js` file in the project root. Go ahead and create this file now. This is where you set up your Babel config. You can start with the following minimal config:

```javascript
// jest-preprocess.js

const babelOptions = {
  presets: ["babel-preset-gatsby"],
}

module.exports = require("babel-jest").createTransformer(babelOptions)
```

The next option is `moduleNameMapper`. This section works a bit like webpack rules, and tells Jest how to handle imports. You are mainly concerned here with mocking static file imports, which Jest can’t handle. A mock is a dummy module that is used instead of the real module inside tests. It is good when you have something that you can’t or don’t want to test. You can mock anything, and here you are mocking assets rather than code. For stylesheets you need to use the package `identity-obj-proxy`. For all other assets you need to use a manual mock called `file-mock.js`. You need to create this yourself. The convention is to create a directory called `__mocks__`in the root directory for this. Note the pair of double underscores in the name(similar to our `__tests__`).

```javascript
// __mocks__/file-mock.js

module.exports = "test-file-stub"
```

- The next config setting is `testPathIgnorePatterns`. You are telling Jest to ignore any tests in the `node_modules` or `.cache` directories.

- The next option is very important, and is different from what you’ll find in other Jest guides. The reason that you need `transformIgnorePatterns` is because Gatsby includes un-transpiled ES6 code. By default Jest doesn’t try to transform code inside `node_modules`, so you will get an error like this:

```text
/my-app/node_modules/gatsby/cache-dir/gatsby-browser-entry.js:1
({"Object.<anonymous>":function(module,exports,require,__dirname,__filename,global,jest){import React from "react"
                                                                                            ^^^^^^
SyntaxError: Unexpected token import
```

This is because `gatsby-browser-entry.js` isn’t being transpiled before running in Jest. You can fix this by changing the default `transformIgnorePatterns` to exclude the `gatsby` module.

The `globals` section sets `__PATH_PREFIX__`, which is usually set by Gatsby, and which some components need.

You need to set testURL to a valid URL, because some DOM APIs such as `localStorage` are unhappy with the default (`about:blank`).

Note: if you’re using Jest 23.5.0 or later, `testURL` will default to `http://localhost` so you can skip this setting.

There’s one more global that you need to set, but as it’s a function you can’t set it here in the JSON. The `setupFiles` array lets you list files that will be included before all tests are run, so it’s perfect for this.

```javascript
// loadershim.js

global.___loader = {
  enqueue: jest.fn(),
}
```

We now need to create a test to run in our pipeline. For the purpose of this exaplce, we will create a test that will always pass.

```javascript
// __tests__/sample.test.js

describe("Sample test", () => {
  it("Should work", () => {
    expect(true).toBe(true)
  })
})
```

Now we are set up with tests, we need to update our `package.json` scripts to run our test.

```json
//package.json

"scripts": {
    "test": "jest"
  }
```

---

#### CircelCi

To run our test in a pipeline, you will first need to create an account at [CircleCI](https://circleci.com), as well as pushing up your code to gihub in a new repo. Next, using the circleCi UI, add a new project, and link it to the newly created repository.

We are now ready to configure our piepline. Create a `.circleci` directory in the project root, and inside there, create a `config.yml` file.

```yml
#  .circleci/config.yml

version: 2.1

jobs:
  test:
    docker:
      - image: circleci/node:latest

    steps:
      - run: npm install
      - run: npm run test

workflows:
  build:
    jobs:
      - test
```

CircleCi config files contain `jobs` and `workflows`. You can think of jobs as being similar to function definitions, and workflows being the calling of these functions in a specific order. There are a huge amount of possibilities when it comes to pipeline, more details and examples can be found in the `CircleCi` [docs](https://circleci.com/docs/).

In our case, we have defined one job named `test`. This job creates a [Docker](https://docs.docker.com/) image, and runs all of the commands defined in `steps:` (installs our `node_modules`, and runs our `test` command).

Pushing this code to Github should trigger our pipeline and run our tests. We should be able to see this running by logging onto the `CirlceCi`UI. All being well, we should be able to see a success badge as our tests passes in the pipeline!

<p align="center">
<img src="https://media.giphy.com/media/nXxOjZrbnbRxS/giphy.gif" alt="Success" />
</p>

#### Get creative

There are a huge amount of possibilities when it comes to CI/CD. The sequential nature of a pipline allows us to define a set of steps our code must go through before it is deployed to production. Go forth and be creative!
