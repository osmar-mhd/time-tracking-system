// Xampp, checadas registradas por fecha y por sede 
import React, { useEffect, useState } from 'react';
import CurrentDate from '../Article/CurrentDate';

const Home = () => {
    const [groupedRecords1, setGroupedRecords1] = useState({});
    const [groupedRecords2, setGroupedRecords2] = useState({});
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchData = (url, setGroupedRecords) => {
            fetch(url)
                .then(response => response.json())
                .then(data => {
                    if (data && data.data && data.data.records) {
                        processRecords(data.data.records, setGroupedRecords);  // Procesar los registros recibidos
                    } else {
                        console.error('No se encontraron registros válidos en la respuesta.');
                    }
                })
                .catch(error => console.error('Error al cargar los datos:', error));
        };

        // Obtener la fecha actual en formato YYYY-MM-DD
        const getCurrentDate = () => {
            const today = new Date();
            const year = today.getFullYear();
            const month = String(today.getMonth() + 1).padStart(2, '0');
            const day = String(today.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        };

        const currentDate = getCurrentDate();  // Fecha actual para el parámetro endTime

        // URLs con la fecha actual en endTime
        const url1 = `http://148.204.9.88:8090/newFindRecords?pass=1409&personId=-1&startTime=2024-10-01%2000:01:00&endTime=${currentDate}%2023:59:59&length=1000&model=-1&order=1&index=0`;
        const url2 = `http://148.204.148.124:8090/newFindRecords?pass=1409&personId=-1&startTime=2024-10-01%2000:01:00&endTime=${currentDate}%2023:59:59&length=1000&model=-1&order=1&index=0`;

        fetchData(url1, setGroupedRecords1);
        fetchData(url2, setGroupedRecords2);

        const interval = setInterval(() => {
            fetchData(url1, setGroupedRecords1);
            fetchData(url2, setGroupedRecords2);
        }, 60000);

        return () => clearInterval(interval);
    }, []);

    const processRecords = (records, setGroupedRecords) => {
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

    const filterRecords = (groupedRecords) => {
        return Object.keys(groupedRecords).reduce((filtered, date) => {
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
    };

    const calculateHoursWorked = (entrada, salida) => {
        if (!salida) return 'N/A';

        const entradaTime = new Date(entrada.time);
        const salidaTime = new Date(salida.time);
        const differenceInMilliseconds = salidaTime - entradaTime;
        const hoursWorked = Math.floor(differenceInMilliseconds / 1000 / 60 / 60);
        const minutesWorked = Math.floor((differenceInMilliseconds / 1000 / 60) % 60);

        return `${hoursWorked}h ${minutesWorked}m`;
    };

    const renderTable = (filteredRecords) => (
        Object.keys(filteredRecords).map((date, index) => (
            <div key={index}>
                <h2>{date}</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Entrada</th>
                            <th>Salida</th>
                            <th>Horas Totales</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.keys(filteredRecords[date]).map((personId, index) => {
                            const personRecords = filteredRecords[date][personId];
                            const entrada = personRecords[0];
                            const salida = personRecords.length > 1 ? personRecords[1] : null;

                            return (
                                <tr key={index}>
                                    <td>{entrada.name}</td>
                                    <td>{new Date(entrada.time).toLocaleTimeString()}</td>
                                    <td>{salida ? new Date(salida.time).toLocaleTimeString() : 'No Registrada'}</td>
                                    <td>{calculateHoursWorked(entrada, salida)}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        ))
    );

    return (
        <div>
            <aside>
                <CurrentDate />
            </aside>

            <div>
                <label htmlFor="search">Buscar por nombre: </label>
                <input
                    type="text"
                    id="search"
                    placeholder="Buscar por nombre"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <h1>Registros DIET - ZAC - IPN</h1>
            {Object.keys(filterRecords(groupedRecords1)).length > 0 ? (
                renderTable(filterRecords(groupedRecords1))
            ) : (
                <p>No se encontraron registros para la API 1.</p>
            )}

            <h1>Registros DIET - STO - IPN</h1>
            {Object.keys(filterRecords(groupedRecords2)).length > 0 ? (
                renderTable(filterRecords(groupedRecords2))
            ) : (
                <p>No se encontraron registros para la API 2.</p>
            )}
        </div>
    );
}

export default Home;