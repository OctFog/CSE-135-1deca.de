#!/usr/bin/env node

function readStdin(callback) {
  let data = "";
  process.stdin.on("data", chunk => data += chunk);
  process.stdin.on("end", () => callback(data));
}

readStdin(body => {
  console.log("Cache-Control: no-cache");
  console.log("Content-Type: text/html\n");

  console.log(`<!DOCTYPE html>
  <html>
  <head><title>General Request Echo</title></head>
  <body>
      <h1>General Request Echo</h1>
      <p><strong>HTTP Method:</strong> ${process.env.REQUEST_METHOD}</p>
      <p><strong>Protocol:</strong> ${process.env.SERVER_PROTOCOL}</p>
      <h2>Message Body</h2>
      <pre>${body || "No Body"}</pre>
  </body>
  </html>`);
});