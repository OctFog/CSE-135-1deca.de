<?php
session_start();

if (isset($_POST['name'])) {
    $_SESSION['name'] = $_POST['name'];
}

if (isset($_POST['destroy'])) {
    session_unset();
    session_destroy();
    header("Location: php-state-demo.php");
    exit;
}

$name = $_SESSION['name'] ?? null;
?>
<!DOCTYPE html>
<html>
<head>
    <title>PHP State Demo</title>
</head>
<body>
    <h1>PHP State Demo</h1>

    <?php if ($name): ?>
        <p>Name: <?php echo htmlspecialchars($name); ?></p>
        <form method="post">
            <button type="submit" name="destroy">Destroy Session</button>
        </form>
    <?php else: ?>
        <p>Name: You do not have a name set</p>
        <form method="post">
            <label for="name">Enter your name:</label>
            <input type="text" id="name" name="name" required>
            <button type="submit">Save</button>
        </form>
    <?php endif; ?>
</body>
</html>
