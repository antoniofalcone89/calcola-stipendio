/** @type {import('jest').Config} */
module.exports = {
  // radice del progetto
  rootDir: ".",

  // dove cercare i file sorgente e di test
  roots: ["<rootDir>/src", "<rootDir>/test"],

  testMatch: ["<rootDir>/test/**/?(*.)+(spec|test).{js,jsx,ts,tsx}"],

  // ignora queste cartelle durante la ricerca dei test
  testPathIgnorePatterns: ["/node_modules/", "/__mocks__/", "/fixtures/"],

  // ambiente di test (usa jsdom se lavori con React/DOM, altrimenti node)
  testEnvironment: "jsdom", // oppure 'node'

  // trasforma i file con babel-jest (supporto TS/JSX)
  transform: {
    "^.+\\.[tj]sx?$": "babel-jest",
  },

  // ignora la trasformazione di node_modules
  transformIgnorePatterns: ["/node_modules/(?!date-fns)"],

  // risoluzione dei moduli (es. alias di path)
  moduleNameMapper: {
    // se usi CSS/SCSS nei tuoi componenti
    "\\.(css|scss|sass)$": "<rootDir>/__mocks__/styleMock.js",
    // se usi immagini
    "\\.(jpg|jpeg|png|gif|svg)$": "<rootDir>/__mocks__/fileMock.js",
  },

  // abilita la raccolta di coverage
  collectCoverage: false, // metti true quando ti serve il coverage
  collectCoverageFrom: [
    "src/**/*.{js,jsx,ts,tsx}",
    "!src/**/*.{spec,test}.{js,jsx,ts,tsx}",
    "!src/**/index.{js,jsx,ts,tsx}",
  ],
  coverageDirectory: "coverage",
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.js"],
};
