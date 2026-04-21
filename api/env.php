<?php

$lines = file(__DIR__ . '/.env');

foreach ($lines as $line) {
    $line = trim($line);

    if ($line === '' || strpos($line, '#') === 0) {
        continue;
    }

    [$key, $value] = explode('=', $line, 2);

    $_ENV[$key] = trim($value);
}