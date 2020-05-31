<?php
$path = "{$_SERVER['DOCUMENT_ROOT']}/{$_REQUEST['path']}";

$scssList = shell_exec("ps aux | pgrep -f sass 2>&1 & echo $!");
$scssListExplode = explode(PHP_EOL, $scssList);

foreach ($scssListExplode as $key => $value) {
    $pid = intval($value);
    
    if ($pid != 0)
        shell_exec("echo \"PASS\" | sudo -u root -S kill {$pid}");
}

$sassList = shell_exec("ps aux | pgrep -f sass 2>&1 & echo $!");
$sassListExplode = explode(PHP_EOL, $sassList);

foreach ($sassListExplode as $key => $value) {
    $pid = intval($value);
    
    if ($pid != 0)
        shell_exec("echo \"PASS\" | sudo -u root -S kill {$pid}");
}

$pid = shell_exec("bash {$_SERVER['DOCUMENT_ROOT']}/_system/bash/sass.sh {$path} >/dev/null 2>&1 & echo $!");

if ($pid != 0)
	echo "Sass completed.";