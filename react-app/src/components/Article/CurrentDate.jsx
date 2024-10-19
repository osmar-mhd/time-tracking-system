import React, { useState, useEffect } from 'react';

const CurrentDate = () => {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const intervalId = setInterval(() => {
            setTime(new Date());
        }, 1000); // Actualiza cada segundo

        return () => clearInterval(intervalId); // Limpia el intervalo cuando el componente se desmonte
    }, []);

    // Formatear la fecha y hora
    const formattedTime = time.toLocaleTimeString('es-MX', {
        timeZone: 'America/Mexico_City',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    });

    const formattedDate = time.toLocaleDateString('es-MX', {
        timeZone: 'America/Mexico_City',
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    return (
        <div>
            <h1>Hora Oficial - Ciudad de México: {formattedTime}</h1>
            <h2>{formattedDate}</h2>
        </div>
    );
};

export default CurrentDate;
