// Datos de ejemplo
const sampleSessions = [
    { id: 1, startTime: '2023-04-01 10:00:00', endTime: '2023-04-01 10:15:00', duration: 900, interactions: 25, page: '/home' },
    { id: 2, startTime: '2023-04-02 11:20:00', endTime: '2023-04-02 11:35:00', duration: 900, interactions: 18, page: '/products' },
    { id: 3, startTime: '2023-04-03 15:45:00', endTime: '2023-04-03 16:00:00', duration: 900, interactions: 32, page: '/contact' },
    { id: 4, startTime: '2023-04-04 09:30:00', endTime: '2023-04-04 09:50:00', duration: 1200, interactions: 21, page: '/about' },
    { id: 5, startTime: '2023-04-05 14:10:00', endTime: '2023-04-05 14:30:00', duration: 1200, interactions: 27, page: '/blog' }
];

// Estados
let currentSession = {
    id: null,
    startTime: null,
    interactions: 0,
    currentPage: window.location.pathname
};

let historicalData = {
    sessions: sampleSessions,
    statistics: calculateStatistics(sampleSessions)
};

// Iniciar nueva sesión
startNewSession();

// Eventos
document.getElementById('end-session').addEventListener('click', endCurrentSession);
document.addEventListener('click', trackInteraction);

// Funciones
function startNewSession() {
    currentSession = {
        id: Date.now(),
        startTime: new Date(),
        interactions: 0,
        currentPage: window.location.pathname
    };

    // Iniciar actualización del tiempo de sesión en tiempo real
    setInterval(updateCurrentSessionUI, 1000);
    updateCurrentSessionUI();
}

function trackInteraction(event) {
    // Evitar contar interacciones en el botón de "Finalizar Sesión"
    if (event.target.id !== 'end-session') {
        currentSession.interactions++;
        updateCurrentSessionUI();
    }
}

function endCurrentSession() {
    const endTime = new Date();
    const duration = Math.floor((endTime - currentSession.startTime) / 1000);

    // Solo agregar la sesión si la duración es mayor que cero
    if (duration > 0) {
        const newSession = {
            id: currentSession.id,
            startTime: currentSession.startTime,
            endTime,
            duration,
            interactions: currentSession.interactions,
            page: currentSession.currentPage
        };

        historicalData.sessions.push(newSession);
        historicalData.statistics = calculateStatistics(historicalData.sessions);
        updateHistoricalDataUI();
    }

    startNewSession();
}

function calculateStatistics(sessions) {
    if (sessions.length === 0) return {};

    const durations = sessions.map(s => s.duration);
    const total = durations.reduce((a, b) => a + b, 0);
    const avg = total / durations.length;
    const sorted = [...durations].sort((a, b) => a - b);

    // Calcular percentiles
    const getPercentile = (arr, p) => {
        const index = Math.floor(arr.length * p);
        return arr[index];
    };

    // Calcular varianza y desviación estándar
    const variance = durations.reduce((a, b) => a + Math.pow(b - avg, 2), 0) / durations.length;
    const stdDev = Math.sqrt(variance);

    return {
        totalSessions: sessions.length,
        averageTime: avg,
        percentiles: {
            p25: getPercentile(sorted, 0.25),
            p50: getPercentile(sorted, 0.50),
            p75: getPercentile(sorted, 0.75),
            p90: getPercentile(sorted, 0.90)
        },
        variance,
        stdDev
    };
}

function updateCurrentSessionUI() {
    document.getElementById('session-time').textContent = Math.floor((new Date() - currentSession.startTime) / 1000);
    document.getElementById('session-interactions').textContent = currentSession.interactions;
}

function updateHistoricalDataUI() {
    document.getElementById('total-sessions').textContent = historicalData.statistics.totalSessions;
    document.getElementById('avg-time').textContent = Math.round(historicalData.statistics.averageTime);
    document.getElementById('std-deviation').textContent = Math.round(historicalData.statistics.stdDev);

    document.getElementById('p25').textContent = Math.round(historicalData.statistics.percentiles.p25);
    document.getElementById('p50').textContent = Math.round(historicalData.statistics.percentiles.p50);
    document.getElementById('p75').textContent = Math.round(historicalData.statistics.percentiles.p75);
    document.getElementById('p90').textContent = Math.round(historicalData.statistics.percentiles.p90);

    // Actualizar gráfico de sesiones
    updateSessionChart();
}

function updateSessionChart() {
    // Código para actualizar el gráfico de sesiones utilizando una biblioteca como Chart.js
}
