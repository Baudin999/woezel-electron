export const baseLibrary = `
"use strict";
function print(...args) {
    console.log(args.join(""));
}
function concat(...params) {
    return params.join("");
}
`;


const eventing = `

function eventStream() {
    const stack = [];
    const subscriptions = [];
    var next;

    async function* _stream() {
        while (true) {
            yield new Promise((resolve, reject) => {
                if (stack.length > 0) {
                    return resolve(stack.shift());
                }
                next = resolve;
            });
        }
    }


    const iterator = {
        ..._stream(),
        submit: (message) => {
            subscriptions.forEach(s => s(message));
            if (next) {
                next(message);
                next = false;
                return;
            }
            stack.push(message);
        },
        subscribe: s => {
            subscriptions.push(s);
            return () => {
                const index = subscriptions.indexOf(s);
                if (index > -1) {
                    subscriptions.splice(index, 1);
                }
            }
        }
    };

    return iterator;
};

`;