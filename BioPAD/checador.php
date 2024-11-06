<?php
// URL de la API
$url = "http://148.204.9.88:8090/newFindRecords?pass=1409&personId=-1&startTime=2024-10-12%2000:01:00&endTime=2024-10-18%2023:00:00&length=1000&model=-1&order=1&index=0";

// Obtener los datos JSON
$response = file_get_contents($url);

// Comprobar si la respuesta fue exitosa
if ($response !== false) {
    // Decodificar el JSON
    $data = json_decode($response, true);
    
    // Verificar si hay registros
    if (isset($data['data']['records'])) {
        // Arreglo para contar los registros por persona
        $recordCounts = [];

        foreach ($data['data']['records'] as $record) {
            // Extraer la información deseada
            $name = $record['name'];
            $path = $record['path'];
            $personId = $record['personId'];
            $temperature = $record['temperature'];
            $time = $record['time'];

            // Formatear el tiempo (convertir de milisegundos a segundos)
            $dateTime = new DateTime("@".($time / 1000)); // Dividir por 1000 para obtener segundos
            $dateTime->setTimezone(new DateTimeZone('America/Mexico_City'));
            $formattedTime = $dateTime->format('Y-m-d H:i:s');

            // Contar los registros por persona
            if (!isset($recordCounts[$personId])) {
                $recordCounts[$personId] = 0; // Inicializa el contador si no existe
            }
            $recordCounts[$personId]++; // Incrementa el contador

            // Determinar si es entrada o salida
            if ($recordCounts[$personId] % 2 != 0) {
                $entryOrExit = "Hora de entrada";
            } else {
                $entryOrExit = "Hora de salida";
            }

            // Verificar si la hora es posterior a las 11 AM
            $isAfterEleven = ($dateTime->format('H') >= 11);
            if ($isAfterEleven) {
                $entryOrExit .= " - Posterior a las 11 (Posible salida)";
            } else {
                $entryOrExit .= " - Anterior a las 11 (Posible Entrada)";
            }

            // Mostrar la información
            echo "Nombre: $name\n";
            echo "Ruta de imagen: $path\n";
            echo "ID de persona: $personId\n";
            echo "Temperatura: $temperature\n";
            echo "Tiempo: $formattedTime\n";
            echo "$entryOrExit\n"; // Indicar si es entrada o salida
            echo "---------------------------\n"; // Separador entre registros
        }
    } else {
        echo "No se encontraron registros.";
    }
} else {
    echo "Error al obtener los datos.";
}
?>