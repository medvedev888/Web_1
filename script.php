<?php

session_start();

$x = floatval($_POST["x"]);
$y = floatval($_POST["y"]);
$r = floatval($_POST["r"]);
$inArea = "false";
function checkPoint($x, $y, $r) {

    $ans = "false";

    if($x >= 0 && $y >= 0 && (($x * $x + $y * $y) <= ($r * $r))) {
        $ans = "true";
    } else if($x >= 0 && $y <= 0 && $x <= $r && $y >= (-1) * $r) {
        $ans = "true";
    } else if($x <= 0 && $x >= -1 * ($r / 2) && $y <= 0 && $y >= -1 * $r && $y >= (-2 * $x) - $r){
        $ans = "true";
    }

    return $ans;

}

function validation($x, $y, $r) {
    if($x == -5 || $x == -4 || $x == -3 || $x == -2 || $x == -1 || $x == 0 || $x == 1 || $x == 2 || $x == 3) {
        if($y >= -3 && $y <= 3) {
            if($r == 1 || $r == 1.5 || $r == 2 || $r == 2.5 || $r == 3) {
                $inArea = checkPoint($x, $y, $r);

                $executionTime = microtime(true) - $_SERVER['REQUEST_TIME_FLOAT'];
                date_default_timezone_set('Europe/Moscow');
                $current_time = date("H:i:s");

                $htmlResult = '<tr>';
                $htmlResult .= "<td>{$x}</td>";
                $htmlResult .= "<td>{$y}</td>";
                $htmlResult .= "<td>{$r}</td>";
                $htmlResult .= "<td>{$inArea}</td>";
                $htmlResult .= "<td>{$current_time}</td>";
                $htmlResult .= "<td>" . number_format($executionTime * 1000, 2) . " мс</td>";
                $htmlResult .= '</tr>';

                if (!isset($_SESSION['results'])) {
                    $_SESSION['results'] = array();
                }

                $_SESSION['results'][] = $htmlResult;

                echo $htmlResult;
            }
            else {
                error_log("Error, not valid parameters");
            }
        }
        else {
            error_log("Error, not valid parameters");
        }
    }
    else {
        error_log("Error, not valid parameters");
    }
}

validation($x, $y, $r);

?>