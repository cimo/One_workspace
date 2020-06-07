<?php
ob_start();
include_once("_system/layout/custom/qunit.html.php");
$layoutQunitContent = ob_get_contents();
ob_end_clean();

$html = <<<XYZ
{$layoutQunitContent}
XYZ;
echo $html;