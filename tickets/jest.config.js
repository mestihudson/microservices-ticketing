const { compilerOptions } = require('./tsconfig');
const { resolve } = require('path');

module.exports = {
  "preset": "ts-jest",
  "testEnvironment": "node",
  "setupFilesAfterEnv": [
    "./src/test/setup.ts"
  ],
  "moduleNameMapper":{
    "^@/(.*)$": resolve(__dirname, "./src/$1")
  }
};
