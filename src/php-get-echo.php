<?php
header("Cache-Control: no-cache");
header("Content-Type: text/html");
?>
<!DOCTYPE html>
<html>
<head>
    <title>GET Request Echo</title>
    <style>
        th, td { border: 1px solid black; }
    </style>
</head>
<body>
    <h1>GET Echo</h1>
    <?php if (!empty($_GET)): ?>
        <table>
            <tr><th>Parameter</th><th>Value</th></tr>
            <?php foreach ($_GET as $key => $value): ?>
                <tr>
                    <td><?= htmlspecialchars($key) ?></td>
                    <td><?= htmlspecialchars($value) ?></td>
                </tr>
            <?php endforeach; ?>
        </table>
    <?php else: ?>
        <p style="text-align:center; font-style:italic;">No GET parameters were sent.</p>
    <?php endif; ?>
</body>
</html>
