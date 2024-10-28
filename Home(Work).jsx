//
import React, { useEffect, useState } from 'react';
import CurrentDate from '../Article/CurrentDate';

const Home = () => {
    const [groupedRecords, setGroupedRecords] = useState({});
    const [searchTerm, setSearchTerm] = useState(""); // Estado para el término de búsqueda

    useEffect(() => {
        const fetchData = () => {
            const url = "http://148.204.9.88:8090/newFindRecords?pass=1409&personId=-1&startTime=2024-10-12%2000:01:00&endTime=2024-10-22%2023:00:00&length=1000&model=-1&order=1&index=0";

            fetch(url)
                .then(response => response.json())
                .then(data => {
                    if (data && data.data && data.data.records) {
                        processRecords(data.data.records);  // Procesar los registros recibidos
                    } else {
                        console.error('No se encontraron registros válidos en la respuesta.');
                    }
                })
                .catch(error => console.error('Error al cargar los datos:', error));
        };

        // Ejecutar la primera llamada a la API
        fetchData();

        // Establecer un intervalo para actualizar los datos cada 60 segundos (60000 ms)
        const interval = setInterval(fetchData, 60000);

        // Limpiar el intervalo cuando el componente se desmonte
        return () => clearInterval(interval);
    }, []);

    const processRecords = (records) => {
        const grouped = records.reduce((acc, record) => {
            const recordDate = new Date(record.time).toLocaleDateString();
            const personId = record.personId;

            if (!acc[recordDate]) {
                acc[recordDate] = {};
            }

            if (!acc[recordDate][personId]) {
                acc[recordDate][personId] = [];
            }

            acc[recordDate][personId].push(record);
            return acc;
        }, {});

        for (let date in grouped) {
            for (let person in grouped[date]) {
                grouped[date][person].sort((a, b) => new Date(a.time) - new Date(b.time));
            }
        }

        setGroupedRecords(grouped);
    };

    // Filtrar registros por nombre usando el término de búsqueda
    const filteredRecords = Object.keys(groupedRecords).reduce((filtered, date) => {
        const filteredByDate = Object.keys(groupedRecords[date]).reduce((personAcc, personId) => {
            const personRecords = groupedRecords[date][personId];
            const personName = personRecords[0].name.toLowerCase();
            
            if (personName.includes(searchTerm.toLowerCase())) {
                if (!personAcc[date]) {
                    personAcc[date] = {};
                }
                personAcc[date][personId] = personRecords;
            }
            return personAcc;
        }, {});

        return { ...filtered, ...filteredByDate };
    }, {});

    const calculateHoursWorked = (entrada, salida) => {
        if (!salida) return 'N/A';  // Si no hay salida registrada, retornar 'N/A'

        const entradaTime = new Date(entrada.time);
        const salidaTime = new Date(salida.time);
        const differenceInMilliseconds = salidaTime - entradaTime;  // Diferencia en milisegundos
        const hoursWorked = Math.floor(differenceInMilliseconds / 1000 / 60 / 60);  // Convertir a horas
        const minutesWorked = Math.floor((differenceInMilliseconds / 1000 / 60) % 60);  // Obtener minutos

        return `${hoursWorked}h ${minutesWorked}m`;  // Retornar en formato 'Xh Ym'
    };

    return (
        <div>
            <aside>
                <CurrentDate />
            </aside>

            {/* Campo de búsqueda */}
            <div>
                <label htmlFor="search">Buscar por nombre: </label>
                <input
                    type="text"
                    id="search"
                    placeholder="Buscar por nombre"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)} // Actualizar el término de búsqueda
                />
            </div>

            {Object.keys(filteredRecords).length > 0 ? (
                Object.keys(filteredRecords).map((date, index) => (
                    <div key={index}>
                        <h2>{date}</h2>
                        <table>
                            <thead>
                                <tr>
                                    <th>Nombre</th>
                                    <th>Entrada</th>
                                    <th>Salida</th>
                                    <th>Temperatura Entrada</th>
                                    <th>Temperatura Salida</th>
                                    <th>Horas Totales</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Object.keys(filteredRecords[date]).map((personId, index) => {
                                    const personRecords = filteredRecords[date][personId];
                                    const entrada = personRecords[0];
                                    const salida = personRecords.length > 1 ? personRecords[1] : null;  // Si hay más de un registro, usar el segundo como salida

                                    return (
                                        <tr key={index}>
                                            <td>{entrada.name}</td>
                                            <td>{new Date(entrada.time).toLocaleTimeString()}</td>
                                            <td>{salida ? new Date(salida.time).toLocaleTimeString() : 'No Registrada'}</td>
                                            <td>{entrada.temperature}</td>
                                            <td>{salida ? salida.temperature : 'N/A'}</td>
                                            <td>{calculateHoursWorked(entrada, salida)}</td> {/* Nueva columna para horas trabajadas */}
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                ))
            ) : (
                <p>No se encontraron registros.</p>
            )}
        </div>
    );
}

export default Home;