#!/usr/bin/env node

console.log("Cache-Control: no-cache");
console.log("Content-Type: text/html\n");

const ip = process.env.REMOTE_ADDR || "Unknown";
const now = new Date().toString();

console.log(`<!DOCTYPE html>
<html>
<head><title>Hello Node JS</title></head>
<body>
    <h1>Hello, Node JS!</h1>
    <p><strong>Date/Time:</strong> ${now}</p>
    <p><strong>Your IP Address:</strong> ${ip}</p>
</body>
</html>`);
