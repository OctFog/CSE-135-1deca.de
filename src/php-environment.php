<?php
header("Cache-Control: no-cache");
header("Content-Type: text/html");
?>
<!DOCTYPE html>
<html>
<head>
    <title>Environment Variables</title>
    <style>
         th, td { border: 1px solid black}
    </style>
</head>
<body>
    <h1>Environment Variables</h1>
    <table>
        <tr><th>Variable</th><th>Value</th></tr>
        <?php foreach ($_SERVER as $key => $value): ?>
            <tr>
                <td><?= htmlspecialchars($key) ?></td>
                <td><?= htmlspecialchars(is_array($value) ? json_encode($value) : $value) ?></td>
            </tr>
        <?php endforeach; ?>
    </table>
</body>
</html>