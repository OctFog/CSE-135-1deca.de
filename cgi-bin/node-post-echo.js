#!/usr/bin/env node

function readStdin(callback) {
  let data = "";
  process.stdin.on("data", chunk => data += chunk);
  process.stdin.on("end", () => callback(data));
}

function parseQuery(qs) {
  let params = {};
  qs.split("&").forEach(p => {
    let [k, v] = p.split("=");
    if (k) params[decodeURIComponent(k)] = decodeURIComponent(v || "");
  });
  return params;
}

readStdin(body => {
  console.log("Cache-Control: no-cache");
  console.log("Content-Type: text/html\n");

  const params = parseQuery(body);

  console.log(`<!DOCTYPE html>
  <html>
  <head><title>POST Echo</title></head>
  <body>
      <h1>POST Request Echo</h1>
      <table border="1">
          <tr><th>Parameter</th><th>Value</th></tr>`);

  if (Object.keys(params).length === 0) {
    console.log(`<tr><td>No POST data received</td></tr>`);
  } else {
    for (const key in params) {
      console.log(`<tr><td>${key}</td><td>${params[key]}</td></tr>`);
    }
  }

  console.log(`</table>
  </body>
  </html>`);
});
