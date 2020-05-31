<?php
$path = "{$_SERVER['DOCUMENT_ROOT']}/{$_REQUEST['path']}";

$terserList = shell_exec("ps aux | pgrep -f terser 2>&1 & echo $!");
$terserListExplode = explode(PHP_EOL, $terserList);

foreach ($terserListExplode as $key => $value) {
    $pid = intval($value);
    
    if ($pid != 0)
        shell_exec("echo \"PASS\" | sudo -u root -S kill {$pid}");
}

$result = shell_exec("bash {$_SERVER['DOCUMENT_ROOT']}/_system/bash/terser.sh {$path} 2>&1 & echo $?");

echo $result;