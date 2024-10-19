import React, { useEffect, useState } from 'react';
import CurrentDate from '../Article/CurrentDate';

const Home = () => {
    const [groupedRecords, setGroupedRecords] = useState({});

    useEffect(() => {
        fetch('http://localhost:5000/api/data')
            .then(response => response.json())
            .then(data => processRecords(data))  // Procesar los registros recibidos
            .catch(error => console.error('Error al cargar los datos:', error));
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
            {Object.keys(groupedRecords).length > 0 ? (
                Object.keys(groupedRecords).map((date, index) => (
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
                                    <th>Horas Trabajadas</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Object.keys(groupedRecords[date]).map((personId, index) => {
                                    const personRecords = groupedRecords[date][personId];
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