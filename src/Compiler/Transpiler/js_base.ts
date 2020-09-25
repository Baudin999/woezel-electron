export const baseLibrary = `
"use strict";
function print(...args) {
    console.log(args.join(""));
}
function concat(...params) {
    return params.join("");
}
`;