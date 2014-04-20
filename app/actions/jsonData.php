<?php

//Atomik::get('debugbar')->addCollector(new DebugBar\DataCollector\TimeDataCollector());

$database = "d_temphumi";
$startDate = null;
$endDate = null;

if (isset($this['request.db'])) {
    $database=$this['request.db'];
} 
if (isset($this['request.start'])) {
    $startDate=$this['request.start'];
} 
if (isset($this['request.end'])) {
    $endDate=$this['request.end'];
} 
$sql = "";

if ($database == "d_teleinfo") {
    $columns = "time,indexHP,indexHC,periode,iInst";
} else {
    $columns = "time,temp,humidity";
}

if (isset($startDate) && isset($endDate)){
    $sql=sprintf("SELECT %s FROM %s WHERE time > %d AND time < %d ORDER BY time", $columns, $database, $startDate, $endDate);
} elseif (isset($startDate)){
    $sql=sprintf("SELECT %s FROM %s WHERE time > %d ORDER BY time", $columns, $database, $startDate);
} elseif (isset($endDate)){
    $sql=sprintf("SELECT %s FROM %s WHERE time < %d ORDER BY time", $columns, $database, $endDate);
} else {
    $sql=sprintf("SELECT %s FROM %s ORDER BY time", $columns, $database);
}

//Atomik::get('debugbar')['time']->startMeasure('execQuery', 'Execute querry');

$query = $this['db']->prepare($sql);
$query->execute();

$datas = $query->fetchAll();
//$ajax=array($query->fetchAll());
//Atomik::get('debugbar')['time']->stopMeasure('execQuery');
//$debugbar['time']->stopMeasure('execQuery');

// Traitement des données 

if ($database == "d_temphumi") {
    $temp = array();
    $humi = array();
    foreach ($datas as $data) {
        $t = [adjustTime($data['time']),round(floatval($data['temp']),2)];
        $h = [adjustTime($data['time']),round(floatval($data['humidity']))];
        $temp[] = $t;
        $humi[] = $h;

        $rep = (Object) ["temp" => $temp, "humi" => $humi];

    }
} elseif ($database == "d_teleinfo") {
    $indexHP = array();
    $indexHC = array();
    $periode = array();
    $pIndexHP = 0;
    $pIndexHC = 0;
    $firstTime = true;
    foreach ($datas as $data) {
        if ($firstTime) {
            $firstTime = false;
            $pIndexHP = $data['indexHP'];
            $pIndexHC = $data['indexHC'];
            continue;
        }
        $fillColor = "#2F7ED8";
        if (strpos($data['periode'], "P") !== false) {
            $fillColor = "#AA4643";
        }

        $indexHP[] = [adjustTime($data['time']),(intval($data['indexHP']) - intval($pIndexHP) + intval($data['indexHC']) - intval($pIndexHC))];
        $pIndexHP = $data['indexHP'];
        $pIndexHC = $data['indexHC'];
    }
    $rep = $indexHP;
}





$ajax=array($rep);

function adjustTime($time) {
    return ((intval($time)*1000)/120000)*120000;
}
