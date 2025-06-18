import React, { useEffect, useState } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import { es } from 'date-fns/locale';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './Calendario.css'; // Import custom CSS
import supabase from '../connection/supabaseClient';

const locales = {
    es: es,
};

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales,
});

const messages = { // Spanish messages for calendar controls
    allDay: 'Todo el día',
    previous: 'Anterior',
    next: 'Siguiente',
    today: 'Hoy',
    month: 'Mes',
    week: 'Semana',
    day: 'Día',
    agenda: 'Agenda',
    date: 'Fecha',
    time: 'Hora',
    event: 'Evento',
    noEventsInRange: 'No hay eventos en este rango.',
    showMore: total => `+ Ver más (${total})`
};

const Calendario = () => {
    const [eventos, setEventos] = useState([]);
    const [view, setView] = useState('week'); // Mantener 'week' como vista inicial o cambiar a 'month' si se prefiere
    const [currentDate, setCurrentDate] = useState(new Date());
    // const [gym, setGym] = useState([]); // gym no se usa, se puede eliminar si no es necesario

    useEffect(() => {
        const fetchReservas = async () => {
            try {
                const { data: reservas, error: reservasError } = await supabase
                    .from('reservas')
                    .select(`
                        *,
                        ring_id (nombre),
                        user_profiles (first_name, last_name, email) 
                    `);

                if (reservasError) {
                    console.error('Error fetching reservas:', reservasError.message);
                    // Considerar mostrar un mensaje de error al usuario aquí
                    return;
                }
                if (!reservas) {
                    console.log('No reservations found.');
                    setEventos([]);
                    return;
                }

                const opponentEmails = [...new Set(
                    reservas.map(r => r.opponent_email).filter(Boolean)
                )];

                let opponentMap = {};
                if (opponentEmails.length > 0) {
                    const { data: opponents, error: opponentsError } = await supabase
                        .from('user_profiles')
                        .select('email, first_name, last_name')
                        .in('email', opponentEmails);

                    if (opponentsError) {
                        console.error('Error fetching opponent names:', opponentsError.message);
                        // No es crítico, los nombres de oponentes pueden faltar
                    } else if (opponents) {
                        opponents.forEach(user => {
                            opponentMap[user.email] = `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'Oponente Desconocido';
                        });
                    }
                }

                const mapped = reservas.map((r) => ({
                    title: `Ring: ${r.ring_id?.nombre || 'N/A'}`,
                    sparring: `${r.user_profiles?.last_name || ''} vs ${opponentMap[r.opponent_email]?.split(' ').slice(-1)[0] || 'Oponente por confirmar'}`,
                    start: new Date(`${r.fecha}T${r.hora_inicio}`),
                    end: new Date(`${r.fecha}T${r.hora_fin}`),
                    allDay: false, // Asegurar que los eventos no se marquen como de día completo por defecto
                    resource: r.ring_id?.nombre // Podría usarse para agrupar por ring si se implementa vista de recursos
                }));

                setEventos(mapped);

            } catch (error) {
                console.error("Error general en fetchReservas:", error.message);
            }
        };

        fetchReservas();
    }, []);

    return (
        <div className="calendario-container"> {/* Apply CSS class */}
            <h2 className="calendario-header">Calendario de reservas</h2> {/* Apply CSS class */}
            <div className="calendario-height-container"> {/* Apply CSS class */}
                <Calendar
                    localizer={localizer}
                    events={eventos}
                    startAccessor="start"
                    endAccessor="end"
                    date={currentDate}
                    onNavigate={(date) => setCurrentDate(date)}
                    views={['month', 'week', 'day']}
                    culture="es"
                    messages={messages} // Add Spanish messages
                    view={view}
                    onView={(newView) => { 
                        console.log('View changed to:', newView);
                        setView(newView);
                    }}
                    dayLayoutAlgorithm="no-overlap" // Add day layout algorithm
                    components={{
                        event: ({ event }) => (
                            <div>
                                <div className="custom-event-title">{event.title}</div>
                                <div className="custom-event-sparring">{event.sparring}</div>
                            </div>
                        ),
                    }}
                    eventPropGetter={(event, start, end, isSelected) => {
                        let newStyle = {
                            // backgroundColor: "#0D203F", // Ya se define en CSS
                            // color: 'white',
                            // borderRadius: "0px", // Ya se define en CSS
                            // border: "none" // Ya se define en CSS
                        };
                        // Podrías añadir lógica para cambiar estilos basados en el evento aquí si es necesario
                        return {
                            className: "", // Clases adicionales si es necesario
                            style: newStyle
                        };
                    }}
                />
            </div>
        </div>
    );
};

export default Calendario;

