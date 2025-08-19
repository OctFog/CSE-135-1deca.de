#!/usr/bin/env node

console.log("Cache-Control: no-cache");
console.log("Content-Type: text/html\n");

console.log(`<!DOCTYPE html>
<html>
<head><title>Environment Variables</title></head>
<body>
    <h1>Environment Variables</h1>
    <table border="1">
        <tr><th>Variable</th><th>Value</th></tr>`);

for (const key in process.env) {
  console.log(`<tr><td>${key}</td><td>${process.env[key]}</td></tr>`);
}

console.log(`</table>
</body>
</html>`);
