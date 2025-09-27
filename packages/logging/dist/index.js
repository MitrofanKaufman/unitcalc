"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.error = exports.log = void 0;
// Logging utility functions
const log = (message) => {
    console.log();
};
exports.log = log;
const error = (message, error) => {
    console.error(error || '');
};
exports.error = error;
