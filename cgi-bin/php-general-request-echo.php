<?php
header("Cache-Control: no-cache");
header("Content-Type: text/html");

echo "<!DOCTYPE html><html><head><title>PHP General Request Echo</title></head><body>";
echo "<h1>PHP General Request Echo</h1>";

echo "<h2>Request Line</h2>";
echo "HTTP Method: " . htmlspecialchars($_SERVER['REQUEST_METHOD']) . "<br>";
echo "Protocol: " . htmlspecialchars($_SERVER['SERVER_PROTOCOL']) . "<br>";
echo "Request URI: " . htmlspecialchars($_SERVER['REQUEST_URI']) . "<br>";

echo "<h2>Headers</h2>";
$headers = getallheaders();
echo "<ul>";
foreach ($headers as $key => $value) {
    echo "<li>" . htmlspecialchars($key) . ": " . htmlspecialchars($value) . "</li>";
}
echo "</ul>";

echo "<h2>Message Body</h2>";
$body = file_get_contents("php://input");
if ($body) {
    echo "<pre>" . htmlspecialchars($body) . "</pre>";
} else {
    echo "<i>No Body</i>";
}

echo "</body></html>";
?>