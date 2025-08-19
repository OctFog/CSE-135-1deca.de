<?php
header("Cache-Control: no-cache");
header("Content-Type: text/html");

$method = $_SERVER['REQUEST_METHOD'];
$input = file_get_contents('php://input');
parse_str($input, $parsedInput);
?>
<!DOCTYPE html>
<html>
<head>
    <title>General Request Echo</title>
    <style>
        th, td { border: 1px solid black}
    </style>
</head>
<body>
    <h1>General Request Echo</h1>
    <p>HTTP Method: <?= htmlspecialchars($method) ?></p>

    <?php if (!empty($parsedInput)): ?>
        <h2>Parsed Payload</h2>
        <table>
            <tr><th>Field</th><th>Value</th></tr>
            <?php foreach ($parsedInput as $key => $value): ?>
                <tr>
                    <td><?= htmlspecialchars($key) ?></td>
                    <td><?= htmlspecialchars($value) ?></td>
                </tr>
            <?php endforeach; ?>
        </table>
    <?php else: ?>
        <h2>Raw Payload</h2>
        <pre><?= htmlspecialchars($input) ?></pre>
    <?php endif; ?>
</body>
</html>
