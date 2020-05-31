<?php
$nonceCsp = base64_encode(openssl_random_pseudo_bytes(20));
$headerCsp = "Content-Security-Policy: script-src 'strict-dynamic' 'nonce-{$nonceCsp}' 'unsafe-inline' http: https:; object-src 'none'; base-uri 'none';";
header($headerCsp);

$layoutInfoContent = "";
$layoutListLs1Content = "";
$layoutListLs2Content = "";
$layoutQunitContent = "";

ob_start();
include_once("_system/layout/info.html.php");
$layoutInfoContent = ob_get_contents();
ob_end_clean();

ob_start();
include_once("_system/layout/list.html.php");
$layoutListContent = ob_get_contents();
ob_end_clean();

ob_start();
include_once("_system/layout/qunit.html.php");
$layoutQunitContent = ob_get_contents();
ob_end_clean();

$html = <<<XYZ
<!DOCTYPE html>
<html lang="en">
    <head>
        <title>Workspace</title>

        <!-- Meta -->
        <meta charset="utf-8"/>
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5, user-scalable=1">
        <meta name="description" content="..."/>
        <meta name="keywords" content="..."/>
        <meta name="robots" content="index, follow"/>

        <!-- Favicon -->
        <link href="_system/images/favicon.ico" rel="icon" type="image/x-icon">
        
        <!-- Css -->
        <link href="_system/style/basic.css" rel="stylesheet"/>
    </head>
    <body>
        <table style="width: 100%;">
            <tr>
                <td class="column_left">
                    {$layoutListContent}
                </td>
                <td class="column_right">
                    {$layoutInfoContent}
                    {$layoutQunitContent}
                </td>
            </tr>
        </table>
        <img class="logo_background" src="_system/images/logo.png" alt="logo.png"/>
        <script nonce="{$nonceCsp}" src="_system/module/Ajax.js"></script>
    </body>
</html>
XYZ;
echo $html;