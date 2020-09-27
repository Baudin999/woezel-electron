interface IEventStream extends AsyncIterator<any> {
    [Symbol.asyncIterator](): AsyncIterator<any>;
    submit: (message: any) => void;
    subscribe: (s: (message: any) => void) => void;
}
export function eventStream() {
    const stack = [];
    const subscriptions = [];
    var next;

    // the async generator
    async function* _stream() {
        while (true) {
            yield new Promise((resolve, reject) => {
                // if there is something on the stack,
                // resolve it immediately
                if (stack.length > 0) {
                    return resolve(stack.shift());
                }

                // if nothing on the stack, store handler
                // to the resolve function and await resolution.
                next = resolve;
            });
        }
    }


    const iterator: IEventStream = {
        ..._stream(),
        submit: (message) => {
            // we'll call the subscriptions first because 
            // the `next` part will `return` and this code will
            // not fire...
            subscriptions.forEach(s => s(message));

            // if there's a next, that means there's a resolver
            // waiting to be called. In this case...resolve...
            if (next) {
                next(message);
                next = false;
                return;
            }

            // no reolver queued up, so push the value to the stack
            // and await the yielding of a new resolver. 
            stack.push(message);

        },
        subscribe: s => {
            subscriptions.push(s);

            // always return a cleanup...wouldn't want to waste memory do we?
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

/**
 * -----------------------------------------------------------------------
 * EXAMPLE USAGE
 * -----------------------------------------------------------------------

(async function () {
    let evts = new eventStream();
    let tracker = 0;
    let interval = setInterval(() => {
        evts.submit(Date.now());
        tracker++;

        if (tracker > 4) clearInterval(interval);
    }, 1000);

    var clear = evts.subscribe(m => {
        console.log(`SUB 1: ${m}`);
        if (tracker == 2) clear();
    });
    evts.subscribe(m => console.log(`SUB 2: ${m}`));

    for await (let evt of evts) {
        console.log("ITERRATED: " + evt);
    }
})();

 */