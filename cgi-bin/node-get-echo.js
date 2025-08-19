#!/usr/bin/env node

console.log("Cache-Control: no-cache");
console.log("Content-Type: text/html\n");

function parseQuery(qs) {
  let params = {};
  qs.split("&").forEach(p => {
    let [k, v] = p.split("=");
    if (k) params[decodeURIComponent(k)] = decodeURIComponent(v || "");
  });
  return params;
}

const params = parseQuery(process.env.QUERY_STRING || "");

console.log(`<!DOCTYPE html>
<html>
<head><title>GET Echo</title></head>
<body>
    <h1>GET Request Echo</h1>
    <table border="1">
        <tr><th>Parameter</th><th>Value</th></tr>`);

if (Object.keys(params).length === 0) {
  console.log(`<tr><td>No GET parameters received</td></tr>`);
} else {
  for (const key in params) {
    console.log(`<tr><td>${key}</td><td>${params[key]}</td></tr>`);
  }
}

console.log(`</table>
</body>
</html>`);
