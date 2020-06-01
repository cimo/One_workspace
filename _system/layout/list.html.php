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
    	<br>
        <li class="title"><b>GitHub:</b></li>
        <li><a href="https://localhost:1443" target="_blank">TensorFlowJs example</a></li>
        <li>
            <a href="https://localhost/project/ipcamera_cp/root/symfony_fw/public/index.php" target="_blank">IpCamera cp</a>
            <div>
                <button class="command" data-event="sass" data-path="project/ipcamera_cp/root/symfony_fw/public">Sass</button>
                <button class="command" data-event="terser" data-path="project/ipcamera_cp/root/symfony_fw/public">Terser</button>
            </div>
        </li>
        <li>
            <a href="https://localhost/project/uebusaito/root/symfony_fw/public/index.php" target="_blank">Uebusaito</a>
            <div>
                <button class="command" data-event="sass" data-path="project/uebusaito/root/symfony_fw/public">Sass</button>
                <button class="command" data-event="terser" data-path="project/uebusaito/root/symfony_fw/public">Terser</button>
            </div>
        </li>
        <li>
            <a href="https://localhost/project/material_design_sk/root/public/index.php" target="_blank">Material design sk</a>
            <div>
                <button class="command" data-event="sass" data-path="project/material_design_sk/root/public">Sass</button>
                <button class="command" data-event="terser" data-path="project/material_design_sk/root/public">Terser</button>
            </div>
        </li>
    </ul>
    {$layoutCustomContent}
</nav>
XYZ;
echo $html;