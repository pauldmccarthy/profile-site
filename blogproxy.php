<?php
$url = "http://pauldmccarthy.github.io/atom.xml";
if ($url) {
    $handle = fopen($url, "r");
    if ($handle) {
      while (!feof($handle)) {
          $buffer = fgets($handle, 4096);
          echo $buffer;
      }
      fclose($handle);
  }
}
?>
