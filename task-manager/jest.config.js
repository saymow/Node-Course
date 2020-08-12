module.exports = {
  roots: ["./__tests__"],
  testEnvironment: "node",
  testMatch: [
    // "**/__tests__/**/*.+(ts|tsx|js)",
    "**/?(*.)+(spec|test).+(ts|tsx|js)",
  ],
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
  },
};
