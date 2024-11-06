<?php
// Timestamp en segundos
// Imprimir el nombre, entrada y salida 
// Ejecutar peticion de los datos de hoy
// Info general
// Checador
// http://148.204.9.88:8090/newFindRecords?pass=1409&personId=-1&startTime=2024-10-18%2000:01:00&endTime=2024-10-18%2023:00:00&length=1000&model=-1&order=1&index=0

$timestamp = 1729172119; // Entrada
$timeout = 1729188629; // Salida (corregido el nombre de la variable)

// Crear un objeto DateTime en la zona horaria de Ciudad de México
$date = new DateTime("@$timestamp"); // Crear un objeto DateTime a partir del timestamp
$date->setTimezone(new DateTimeZone('America/Mexico_City')); // Establecer la zona horaria

// Formatear la fecha y hora
echo "Fecha y hora en Ciudad de México (Entrada): " . $date->format('Y-m-d H:i:s') . PHP_EOL;

// Si deseas mostrar también el timeout
$timeoutDate = new DateTime("@$timeout"); // Crear un objeto DateTime a partir del timeout
$timeoutDate->setTimezone(new DateTimeZone('America/Mexico_City')); // Establecer la zona horaria

// Formatear la fecha y hora del timeout
echo "Fecha y hora en Ciudad de México (Salida): " . $timeoutDate->format('Y-m-d H:i:s') . PHP_EOL;
?>