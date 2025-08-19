<?php
header("Cache-Control: no-cache");
header("Content-Type: application/json");

echo json_encode([
    'title' => 'Hello, PHP!', 
    'heading' => 'Hello, PHP!', 
    'message' => 'Hello PHP',
    'time' => date('Y-m-d H:i:s'),
    'IP' => $_SERVER['REMOTE_ADDR']
]);
