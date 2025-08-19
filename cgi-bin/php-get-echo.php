<?php
header("Cache-Control: no-cache");
header("Content-Type: text/html");
?>
<!DOCTYPE html>
<html>
    <head>
        <title>GET Request Echo</title>
    </head>
    <body>
        <h1>GET Echo</h1>
        <table>
            <tr><th>Parameter</th><th>Value</th></tr>
            <?php foreach ($_GET as $key => $value): ?>
                <tr>
                    <td><?= htmlspecialchars($key) ?></td>
                    <td><?= htmlspecialchars($value) ?></td>
                </tr>
            <?php endforeach; ?>
        </table>
    </body>
</html>
