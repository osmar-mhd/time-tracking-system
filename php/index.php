<?php
function getCurrentDate() {
    return date('Y-m-d');
}

// Obtener fechas seleccionadas del formulario o usar la fecha actual si no se selecciona ninguna
$startDate = isset($_POST['start_date']) ? $_POST['start_date'] : getCurrentDate();
$endDate = isset($_POST['end_date']) ? $_POST['end_date'] : getCurrentDate();

// Configuración de URLs para la API y credenciales
$url1 = 'http://148.204.9.88:8090/newFindRecords?pass=1409&personId=-1&startTime=' . $startDate . '%2000:01:00&endTime=' . $endDate . '%2023:59:59&length=1000&model=-1&order=1&index=0';
$url2 = 'http://148.204.148.124:8090/newFindRecords?pass=1409&personId=-1&startTime=' . $startDate . '%2000:01:00&endTime=' . $endDate . '%2023:59:59&length=1000&model=-1&order=1&index=0';

// JSON
// $url1 = './resourses/sto.json';
// $url2 = './resourses/zac.json';

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
    
    // Calcular horas y minutos
    $hours = floor($diff / 3600); // Horas completas
    $minutes = floor(($diff % 3600) / 60); // Minutos restantes
    
    return sprintf("%d hr %d min", $hours, $minutes); // Retornar el formato deseado
}

// Función para renderizar la tabla de registros
function renderTable($groupedRecords, $location) {
    if (empty($groupedRecords)) {
        return "<section class='location-section'><h1>No se encontraron registros para $location.</h1></section>";
    }
    
    $html = '';
    $html .= "<section class='location-section'>";
    $html .= "<h1>Registros - $location</h1>";
    
    setlocale(LC_TIME, 'es_ES.UTF-8');
    
    foreach ($groupedRecords as $date => $persons) {
        $html .= '<h2>' . strftime('%d de %B de %Y', strtotime($date)) . '</h2>';
        $html .= '<table><tr><th>Nombre</th><th>Evento Inicial</th><th>Evento Final</th><th>Horas Totales</th></tr>';
        
        foreach ($persons as $personId => $personData) {
            $records = $personData['records'];
            $entry = count($records) > 0 ? date('h:i A', strtotime($records[0]['time'])) : '-';
            $exit = count($records) > 1 ? date('h:i A', strtotime($records[count($records) - 1]['time'])) : '-';
            $hoursWorked = calculateHoursWorked($records);

            // Aplicar la clase a cada <td> en lugar de al <tr>
            $highlightClass = ($hoursWorked === "N/A") ? "highlight-yellow" : "";

            $html .= "<tr>";
            $html .= "<td class='$highlightClass'>{$personData['name']}</td>";
            $html .= "<td class='$highlightClass'>$entry</td>";
            $html .= "<td class='$highlightClass'>$exit</td>";
            $html .= "<td class='$highlightClass'>$hoursWorked</td>";
            $html .= "</tr>";
        }
        $html .= '</table>';
    }
    
    $html .= "</section>";
    return $html;
}


// Obtener datos de ambas API
$records1 = fetchData($url1);
$records2 = fetchData($url2);

// Procesar registros obtenidos
$nameFilter = isset($_POST['search']) ? trim($_POST['search']) : ''; // Obtener el nombre del formulario
$groupedRecords1 = processRecords($records1, $nameFilter);
$groupedRecords2 = processRecords($records2, $nameFilter);

?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>DIET - Registros</title>
    <link rel="stylesheet" href="./assets/css/styles.css">
    <link rel="stylesheet" href="./assets/css/header.css">
    <link rel="stylesheet" href="./assets/css/main.css">
    <link rel="stylesheet" href="./assets/css/section.css">
</head>
<body>
    <header>
        <div class="banner">
            <h1>DIET</h1>
            <div id="clock"></div> 
        </div>
        <div class="search-form">
            <form method="post">
                <label for="search">Buscar por nombre: </label>
                <input type="text" id="search" name="search" placeholder="Buscar por nombre" value="<?= htmlspecialchars($nameFilter) ?>">
                <label for="start_date">Fecha de inicio: </label>
                <input type="date" id="start_date" name="start_date" value="<?= htmlspecialchars($startDate) ?>">
                <label for="end_date">Fecha de término: </label>
                <input type="date" id="end_date" name="end_date" value="<?= htmlspecialchars($endDate) ?>">
                <button type="submit">Buscar</button>
            </form>
        </div>
    </header>
    <main>
        <?= renderTable($groupedRecords1, 'Zacatenco'); ?> <!-- Renderizar tabla para Zacatenco -->
        <?= renderTable($groupedRecords2, 'Santo Tomás'); ?> <!-- Renderizar tabla para Santo Tomás -->
    </main>
    <footer>
    </footer>
</body>
<script>
    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    function updateClock() {
        const now = new Date();
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        let dateString = now.toLocaleDateString('es-ES', options); // Fecha en español
        const timeString = now.toLocaleTimeString(); // Hora con minutos y segundos
        
        dateString = capitalizeFirstLetter(dateString);

        document.getElementById('clock').innerText = `${dateString}, ${timeString}`;
    }

    setInterval(updateClock, 1000); // Actualiza cada segundo
    updateClock(); // Llama a la función al cargar
</script>
</html>