<?php

// your action code goes here


$chaineMesures="min : %.2f / moy : %.2f / max = %.2f";
// ====  Temperature/humidite actuelles ====
$sql = $this['db']->prepare("SELECT * FROM d_temphumi ORDER BY id DESC LIMIT 0,1");

$sql->execute();
$currentValues = $sql->fetch();

// ====  Temperature/humidite du jour ====
$sql = $this['db']->prepare("SELECT MAX(temp) as tempMax, AVG(temp) as tempMoy, MIN(temp) as tempMin, MAX(humidity) as humiMax, AVG(humidity) as humiMoy, MIN(humidity) as humiMin FROM d_temphumi WHERE time > ?");

$sql->execute(array(strtotime('yesterday midnight')));
$minMaxValues = $sql->fetch();

$chaineTemp=sprintf($chaineMesures,$minMaxValues['tempMin'],$minMaxValues['tempMoy'],$minMaxValues['tempMax']);
$chaineHumi=sprintf($chaineMesures,$minMaxValues['humiMin'],$minMaxValues['humiMoy'],$minMaxValues['humiMax']);

// ====  Temperature/humidite Globale ====
$sql = $this['db']->prepare("SELECT MAX(temp) as tempMax, AVG(temp) as tempMoy, MIN(temp) as tempMin, MAX(humidity) as humiMax, AVG(humidity) as humiMoy, MIN(humidity) as humiMin FROM d_temphumi");

$sql->execute();
$minMaxValues = $sql->fetch();

$chaineGlobaleTemp=sprintf($chaineMesures,$minMaxValues['tempMin'],$minMaxValues['tempMoy'],$minMaxValues['tempMax']);
$chaineGlobaleHumi=sprintf($chaineMesures,$minMaxValues['humiMin'],$minMaxValues['humiMoy'],$minMaxValues['humiMax']);
