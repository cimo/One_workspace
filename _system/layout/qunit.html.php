<?php
$html = <<<XYZ
<iframe id="qunit_iframe" src="https://localhost/project/uebusaito/root/symfony_fw/public/files/microservice/qunit/run/test_design.html"></iframe>
<script nonce="{$nonceCsp}" id="qunit_script" src="_system/module/Qunit.js"></script>
XYZ;
echo $html;