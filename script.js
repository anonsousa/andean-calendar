const paises = {
    'BR': 'Brasil',
    'CL': 'Chile',
    'PE': 'Peru',
    'CO': 'Colômbia',
    'AR': 'Argentina',
    'PY': 'Paraguai'
};

async function buscarFeriados(anoInicio, anoFim) {
    let feriados = [];
    for (let ano = anoInicio; ano <= anoFim; ano++) {
        for (const [codigo, nome] of Object.entries(paises)) {
            try {
                const response = await fetch(`https://date.nager.at/Api/v2/PublicHolidays/${ano}/${codigo}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const dadosFeriados = await response.json();
                feriados = feriados.concat(dadosFeriados.map(f => ({
                    date: f.date,
                    title: `${nome}: ${f.localName}`,
                    details: `Feriado em ${nome}: ${f.localName}` // Detalhes do feriado
                })));
            } catch (error) {
                console.error(`Erro ao buscar feriados para ${nome} no ano ${ano}:`, error);
            }
        }
    }
    console.log("Feriados carregados:", feriados); // Verifica se os feriados estão sendo carregados
    return feriados;
}

document.addEventListener('DOMContentLoaded', async () => {
    const calendarEl = document.getElementById('calendar');
    const feriadosAnoAtual = await buscarFeriados(2024, 2030); // Busca de 2024 a 2030

    const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        events: feriadosAnoAtual,
        eventColor: '#FF0000', // Cor dos feriados
        dateClick: function(info) {
            const clickedDate = info.dateStr;
            const eventosDoDia = feriadosAnoAtual.filter(event => event.date === clickedDate);
            const resultadoDiv = document.getElementById('resultado');
            if (eventosDoDia.length > 0) {
                resultadoDiv.innerHTML = eventosDoDia.map(event => event.title).join('<br>');
            } else {
                resultadoDiv.innerHTML = "Nenhum feriado encontrado neste dia.";
            }
        },
        eventMouseEnter: function(info) {
            const event = info.event;
            const tooltip = document.getElementById('tooltip');
            tooltip.innerHTML = `<strong>${event.title}</strong><br>${event.extendedProps.details}`;
            tooltip.style.display = 'block';
            tooltip.style.left = `${info.el.getBoundingClientRect().left}px`;
            tooltip.style.top = `${info.el.getBoundingClientRect().bottom}px`;
        },
        eventMouseLeave: function() {
            const tooltip = document.getElementById('tooltip');
            tooltip.style.display = 'none';
        },
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,dayGridWeek,dayGridDay'
        },
        editable: true,
        selectable: true,
        themeSystem: 'bootstrap', // Use o tema Bootstrap para melhorar a aparência
    });

    calendar.render();
});
