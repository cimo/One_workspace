<?php
ob_start();
include_once("_system/layout/custom/list.html.php");
$layoutCustomContent = ob_get_contents();
ob_end_clean();

$html = <<<XYZ
<div>
    <button class="command" data-event="opcache">OPcache</button>
</div>
<nav>
    <ul>
    	<li><a href="https://www.google.com" target="_blank">Google</a></li>
    </ul>
    {$layoutCustomContent}
</nav>
XYZ;
echo $html;