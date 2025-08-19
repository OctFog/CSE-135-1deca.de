<?php
header("Cache-Control: no-cache");
header("Content-Type: text/html");

$ip = $_SERVER['REMOTE_ADDR'];
$date = date('Y-m-d H:i:s');
?>
<!DOCTYPE html>
<html>
<head>
    <title>Hello, PHP!</title>
</head>
<body>
    <h1>Hello, PHP</h1>
    <p>Current Time: <?= $date ?></p>
    <p>Your IP Address: <?= $ip ?></p>
</body>
</html>
