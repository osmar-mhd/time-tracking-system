import React, { useState, useEffect } from 'react';
import CurrentDate from '../Article/CurrentDate';

const RecordViewer = () => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [nameFilter, setNameFilter] = useState('');
    const [groupedRecords1, setGroupedRecords1] = useState({});
    const [groupedRecords2, setGroupedRecords2] = useState({});

    // Obtener fecha actual para establecer fechas predeterminadas
    const getCurrentDate = () => new Date().toISOString().split('T')[0];

    // Función para obtener datos de la API
    const fetchData = async (url) => {
        try {
            const response = await fetch(url);
            const data = await response.json();
            return data.data.records || [];
        } catch (error) {
            console.error("Error al obtener datos:", error);
            return [];
        }
    };

    // Función para procesar registros
    const processRecords = (records, filter) => {
        const grouped = {};
        records.forEach(record => {
            const { personId, name, path, time } = record;
            if (filter && !name.toLowerCase().includes(filter.toLowerCase())) return;

            const date = new Date(time / 1000).toISOString().split('T')[0];
            if (!grouped[date]) grouped[date] = {};
            if (!grouped[date][personId]) grouped[date][personId] = { name, path, records: [] };

            grouped[date][personId].records.push({
                time: new Date(time / 1000).toLocaleTimeString('es-MX', { timeZone: 'America/Mexico_City' }),
                timestamp: time
            });
        });
        return grouped;
    };

    // Obtener y procesar datos al enviar el formulario
    const handleSearch = async (e) => {
        e.preventDefault();
        const sDate = startDate || getCurrentDate();
        const eDate = endDate || getCurrentDate();

        const url1 = `http://148.204.9.88:8090/newFindRecords?pass=1409&personId=-1&startTime=${sDate} 00:01:00&endTime=${eDate} 23:59:59&length=1000&model=-1&order=1&index=0`;
        const url2 = `http://148.204.148.124:8090/newFindRecords?pass=1409&personId=-1&startTime=${sDate} 00:01:00&endTime=${eDate} 23:59:59&length=1000&model=-1&order=1&index=0`;

        const records1 = await fetchData(url1);
        const records2 = await fetchData(url2);

        setGroupedRecords1(processRecords(records1, nameFilter));
        setGroupedRecords2(processRecords(records2, nameFilter));
    };

    return (
        <div>
            <header>
                <CurrentDate />
                <form onSubmit={handleSearch}>
                    <label>
                        Buscar por nombre:
                        <input type="text" value={nameFilter} onChange={(e) => setNameFilter(e.target.value)} />
                    </label>
                    <label>
                        Fecha de inicio:
                        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                    </label>
                    <label>
                        Fecha de término:
                        <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                    </label>
                    <button type="submit">Buscar</button>
                </form>
            </header>
            <main>
                <RenderTable groupedRecords={groupedRecords1} location="Zacatenco" />
                <RenderTable groupedRecords={groupedRecords2} location="Santo Tomás" />
            </main>
        </div>
    );
};

// Componente para renderizar la tabla
const RenderTable = ({ groupedRecords, location }) => {
    const calculateHoursWorked = (records) => {
        if (records.length < 2) return "N/A";
        const entryTime = new Date(records[0].timestamp / 1000).getTime();
        const exitTime = new Date(records[records.length - 1].timestamp / 1000).getTime();
        const diff = exitTime - entryTime;
        const hours = Math.floor(diff / 3600 / 1000);
        const minutes = Math.floor((diff % 3600) / 60000);
        return `${hours} hr ${minutes} min`;
    };

    return (
        <section>
            <h2>Registros - {location}</h2>
            {Object.keys(groupedRecords).length === 0 ? (
                <p>No se encontraron registros para {location}.</p>
            ) : (
                Object.entries(groupedRecords).map(([date, persons]) => (
                    <div key={date}>
                        <h3>{new Date(date).toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</h3>
                        <table>
                            <thead>
                                <tr>
                                    <th>Nombre</th>
                                    <th>Evento Inicial</th>
                                    <th>Evento Final</th>
                                    <th>Horas Totales</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Object.values(persons).map(({ name, records, path }, idx) => {
                                    const entry = records[0]?.time || '-';
                                    const exit = records[records.length - 1]?.time || '-';
                                    const hoursWorked = calculateHoursWorked(records);

                                    return (
                                        <tr key={idx}>
                                            <td>{name}</td>
                                            <td>{entry}</td>
                                            <td>{exit}</td>
                                            <td>{hoursWorked}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                ))
            )}
        </section>
    );
};

export default RecordViewer;