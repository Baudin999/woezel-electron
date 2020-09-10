Simpel TypeScript + Svelte + Electron Template

Scripts:
```
"build": "rollup -c",
"dev": "rollup -c -w",
"start": "sirv public",
"electron": "run-s build pure-electron",
"pure-electron": "electron ."
```