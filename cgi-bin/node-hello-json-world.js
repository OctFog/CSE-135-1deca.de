#!/usr/bin/env node

console.log("Cache-Control: no-cache");
console.log("Content-Type: application/json\n");

const ip = process.env.REMOTE_ADDR || "Unknown";
const now = new Date().toString();

console.log(JSON.stringify({
  message: "Hello, Node JS!",
  date: now,
  ip: ip
}, null, 2));