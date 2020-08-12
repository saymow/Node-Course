"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    roots: ["/__tests__"],
    testMatch: [
        "**/__tests__/**/*.+(ts|tsx|js)",
        "**/?(*.)+(spec|test).+(ts|tsx|js)",
    ],
    transform: {
        "^.+\\.(ts|tsx)$": "ts-jest",
    },
};
