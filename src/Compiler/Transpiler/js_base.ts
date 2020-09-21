export const baseLibrary = `
"use strict";
function print(...args) {
    console.log(args.join(""));
}
function concat(param1, param2) {
    return [param1, param2].join("");
}
`;