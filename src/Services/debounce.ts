

export const debounce = (f, i = 1000) => {
    console.log("debouncing");
    let timeout;
    if (timeout) clearTimeout(timeout);
    return (...args) => {
        timeout = setTimeout(f, i, ...args);
    }
}