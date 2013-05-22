<?php
header('Content-type: application/xml');
$daurl = 'http://pauldmccarthy.github.io/atom.xml';
$handle = fopen($daurl, "r");

if ($handle) {
    while (!feof($handle)) {
        $buffer = fgets($handle, 4096);
        echo $buffer;
    }
    fclose($handle);
}
?>