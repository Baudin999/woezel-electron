

export const debounce = (f, i = 500) => {
    console.log("debouncing");
    let timeout;
    if (timeout) clearTimeout(timeout);
    return (...args) => {
        timeout = setTimeout(f, i, ...args);
    }
}