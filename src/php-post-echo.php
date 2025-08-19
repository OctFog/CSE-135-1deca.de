<?php
header("Cache-Control: no-cache");
header("Content-Type: text/html");
?>
<!DOCTYPE html>
<html>
<head>
    <title>POST Request Echo</title>
    <style>
        th, td { border: 1px solid black; }
    </style>
</head>
<body>
    <h1>POST Request Echo</h1>
    <?php if (!empty($_POST)): ?>
        <table>
            <tr><th>Parameter</th><th>Value</th></tr>
            <?php foreach ($_POST as $key => $value): ?>
                <tr>
                    <td><?= htmlspecialchars($key) ?></td>
                    <td><?= htmlspecialchars($value) ?></td>
                </tr>
            <?php endforeach; ?>
        </table>
    <?php else: ?>
        <p style="text-align:center; font-style:italic;">No POST parameters were sent.</p>
    <?php endif; ?>
</body>
</html>