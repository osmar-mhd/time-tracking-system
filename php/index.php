<?php
// Configuración de URLs para la API y credenciales
$url1 = 'http://148.204.9.88:8090/newFindRecords?pass=1409&personId=-1&startTime=' . getCurrentDate() . '%2000:01:00&endTime=' . getCurrentDate() . '%2023:59:59&length=1000&model=-1&order=1&index=0';
$url2 = 'http://148.204.148.124:8090/newFindRecords?pass=1409&personId=-1&startTime=' . getCurrentDate() . '%2000:01:00&endTime=' . getCurrentDate() . '%2023:59:59&length=1000&model=-1&order=1&index=0';

// Función para obtener la fecha actual en formato YYYY-MM-DD
function getCurrentDate() {
    return date('Y-m-d');
}

// Función para obtener y procesar los datos de la API
function fetchData($url) {
    $response = @file_get_contents($url); // Manejar errores con '@'
    if ($response === false) {
        return []; // Maneja el error si no se obtienen datos
    }
    $data = json_decode($response, true);
    return $data['data']['records'] ?? [];
}

// Función para procesar registros y agrupar por persona y día
function processRecords($records, $nameFilter = '') {
    $grouped = [];
    foreach ($records as $record) {
        $personId = $record['personId'];
        $name = $record['name'];
        $path = $record['path'];
        $time = $record['time'];

        // Filtrar por nombre
        if ($nameFilter && stripos($name, $nameFilter) === false) {
            continue; // Saltar este registro si no coincide con el filtro
        }

        // Formatear el tiempo (convertir de milisegundos a segundos)
        $dateTime = new DateTime("@".($time / 1000)); // Dividir por 1000 para obtener segundos
        $dateTime->setTimezone(new DateTimeZone('America/Mexico_City'));
        $formattedTime = $dateTime->format('Y-m-d H:i:s');
        $formattedDate = $dateTime->format('Y-m-d'); // Fecha formateada para agrupación

        // Inicializar el grupo si no existe
        if (!isset($grouped[$formattedDate])) {
            $grouped[$formattedDate] = [];
        }

        // Inicializar el registro de la persona si no existe
        if (!isset($grouped[$formattedDate][$personId])) {
            $grouped[$formattedDate][$personId] = [
                'name' => $name,
                'records' => [],
                'path' => $path,
                'temperature' => null, // Inicializar la temperatura como null
            ];
        }

        // Almacenar el registro
        $grouped[$formattedDate][$personId]['records'][] = [
            'time' => $formattedTime,
            'timestamp' => $time,
        ];
    }
    return $grouped;
}

// Función para calcular horas trabajadas
function calculateHoursWorked($records) {
    if (count($records) < 2) return "N/A"; // Si solo hay un registro de entrada, se devuelve "N/A"
    $entryTime = new DateTime("@".($records[0]['timestamp'] / 1000)); // Hora de entrada
    $exitTime = new DateTime("@".($records[count($records) - 1]['timestamp'] / 1000)); // Hora de salida
    $diff = $exitTime->getTimestamp() - $entryTime->getTimestamp(); // Diferencia en segundos
    $hours = $diff / 3600; // Convertir a horas
    return number_format($hours, 2) . ' horas';
}

// Función para renderizar la tabla de registros
function renderTable($groupedRecords, $location) {
    if (empty($groupedRecords)) {
        return "<p>No se encontraron registros para $location.</p>"; // Mensaje si no hay registros
    }
    $html = ''; // Renderizar tablas separadas por día
    $html .= "<main>";
    $html .= "<section>";
    foreach ($groupedRecords as $date => $persons) {
        $html .= '<h2>' . date('d F Y', strtotime($date)) . '</h2>'; // Título de la fecha
        $html .= '<table><tr><th>Nombre</th><th>Evento Inicial</th><th>Evento Final</th><th>Horas Totales</th></tr>';
        foreach ($persons as $personId => $personData) {
            $records = $personData['records'];
            $entry = count($records) > 0 ? $records[0]['time'] : '-'; // Hora de entrada o guion si no hay registros
            $exit = count($records) > 1 ? $records[count($records) - 1]['time'] : '-'; // Hora de salida o guion si no hay registros
            $hoursWorked = calculateHoursWorked($records); // Calcular horas trabajadas

            $html .= "<tr>";
            $html .= "<td>{$personData['name']}</td>";
            $html .= "<td>$entry</td>";
            $html .= "<td>$exit</td>";
            $html .= "<td>$hoursWorked</td>";
            $html .= "</tr>";
        }
        $html .= '</table>';
    }
    $html .= "</section>";
    $html .= "</main>";
    return $html;
}

// Obtener datos de ambas API
$records1 = fetchData($url1);
$records2 = fetchData($url2);

// Procesar registros obtenidos
$nameFilter = isset($_POST['search']) ? trim($_POST['search']) : ''; // Obtener el nombre del formulario
$groupedRecords1 = processRecords($records1, $nameFilter);
$groupedRecords2 = processRecords($records2, $nameFilter);

// Renderizar tablas para cada ubicación
echo renderTable($groupedRecords1, 'Ubicación 1');
echo renderTable($groupedRecords2, 'Ubicación 2');
?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Registros DIET - IPN</title>
    <link rel="stylesheet" href="./assets/css/styles.css">
    <link rel="stylesheet" href="./assets/css/header.css">
    <link rel="stylesheet" href="./assets/css/main.css">
    <link rel="stylesheet" href="./assets/css/section.css">
</head>
<body>
    <header>
        <aside>
            <p>Fecha actual: <?= getCurrentDate() ?></p>
        </aside>
        <div>
            <form method="post">
                <label for="search">Buscar por nombre: </label>
                <input type="text" id="search" name="search" placeholder="Buscar por nombre" value="<?= htmlspecialchars($nameFilter) ?>">
                <button type="submit">Buscar</button>
            </form>
        </div>
    </header>
    <footer>
    </footer>
</body>
</html>
