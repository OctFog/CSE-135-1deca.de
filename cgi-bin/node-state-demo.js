#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

function getPostData(callback) {
  let data = "";
  process.stdin.on("data", chunk => (data += chunk));
  process.stdin.on("end", () => callback(data));
}

const sessionDir = "/tmp/node-sessions";
if (!fs.existsSync(sessionDir)) fs.mkdirSync(sessionDir);

function parseCookies(header) {
  const cookies = {};
  if (header) {
    header.split(";").forEach(cookie => {
      const parts = cookie.split("=");
      cookies[parts[0].trim()] = (parts[1] || "").trim();
    });
  }
  return cookies;
}

const headers = {};
for (let line of process.argv.slice(2)) {
  const [key, value] = line.split("=");
  headers[key] = value;
}

const cookies = parseCookies(process.env.HTTP_COOKIE);
let sessionId = cookies["NODESESSION"];

if (!sessionId) {
  sessionId = crypto.randomBytes(16).toString("hex");
}
const sessionFile = path.join(sessionDir, sessionId + ".json");

let session = {};
if (fs.existsSync(sessionFile)) {
  session = JSON.parse(fs.readFileSync(sessionFile, "utf8"));
}

getPostData(postData => {
  const params = new URLSearchParams(postData);

  if (params.has("destroy")) {
    if (fs.existsSync(sessionFile)) fs.unlinkSync(sessionFile);
    session = {};
  } else if (params.has("name")) {
    session.name = params.get("name");
    fs.writeFileSync(sessionFile, JSON.stringify(session));
  }

  let body = `
  <html><body>
    <h2>Node.js State Demo</h2>
  `;

  if (session.name) {
    body += `<p><strong>Name:</strong> ${session.name}</p>`;
    body += `
      <form method="POST">
        <input type="hidden" name="destroy" value="1">
        <input type="submit" value="Destroy Session">
      </form>
    `;
  } else {
    body += `<p><strong>Name:</strong> You do not have a name set</p>`;
    body += `
      <form method="POST">
        <input type="text" name="name" placeholder="Enter your name">
        <input type="submit" value="Save Name">
      </form>
    `;
  }

  body += `</body></html>`;

  console.log("Content-Type: text/html");
  console.log("Set-Cookie: NODESESSION=" + sessionId);
  console.log("");
  console.log(body);
});
