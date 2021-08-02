export default {
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageProvider: "v8",
  preset: "ts-jest",
  moduleNameMapper: {
    "@libs/(.*)": "<rootDir>/src/libs/$1",
  },
};
