import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class GestorEstadisticas {
    private List<RegistroEvento> historialEventos;
    // Una semana tiene 7 días * 24 horas * 60 minutos = 10,080 minutos totales
    private static final double MINUTOS_SEMANA = 10080.0;

    public GestorEstadisticas() {
        this.historialEventos = new ArrayList<>();
    }

    public void agregarEvento(RegistroEvento evento) {
        this.historialEventos.add(evento);
    }

    // CÁLCULO 1: Total de minutos perdidos en recaídas
    public long getMinutosTotalesRecaida() {
        long totalMinutos = 0;
        for (RegistroEvento e : historialEventos) {
            totalMinutos += e.getDuracionMinutos();
        }
        return totalMinutos;
    }

    // CÁLCULO 2: Porcentaje de tiempo limpio vs recaída
    public double getPorcentajeTiempoLimpio() {
        long minutosRecaida = getMinutosTotalesRecaida();
        double porcentajeRecaida = (minutosRecaida / MINUTOS_SEMANA) * 100.0;
        return 100.0 - porcentajeRecaida;
    }

    // CÁLCULO 3: Distribución de Disparadores (Para el gráfico de torta)
    public Map<String, Double> obtenerPorcentajeDisparadores() {
        Map<String, Integer> conteoTriggers = new HashMap<>();

        if (historialEventos.isEmpty()) {
            return new HashMap<>();
        }

        // Contamos cuántas veces aparece cada disparador
        for (RegistroEvento e : historialEventos) {
            String trigger = e.getDisparador();
            conteoTriggers.put(trigger, conteoTriggers.getOrDefault(trigger, 0) + 1);
        }

        // Convertimos el conteo a porcentaje
        Map<String, Double> porcentajes = new HashMap<>();
        int totalEventos = historialEventos.size();

        for (Map.Entry<String, Integer> entry : conteoTriggers.entrySet()) {
            double porcentaje = (entry.getValue() * 100.0) / totalEventos;
            porcentajes.put(entry.getKey(), porcentaje);
        }

        return porcentajes;
    }

    // REPORTE ANALÍTICO SEMANAL
    public String generarReporteSemanal() {
        long minutosRecaida = getMinutosTotalesRecaida();
        double horasRecaida = minutosRecaida / 60.0;
        double porcentajeLimpio = getPorcentajeTiempoLimpio();

        StringBuilder reporte = new StringBuilder();
        reporte.append("====================================================\n");
        reporte.append("   📊 RESUMEN ANALÍTICO SEMANAL - SANDEV ENGINE     \n");
        reporte.append("====================================================\n");
        reporte.append(String.format("⏱️ Tiempo total en recaídas: %.2f horas (%d min)\n", horasRecaida, minutosRecaida));
        reporte.append(String.format("🛡️ Tiempo limpio esta semana: %.2f%%\n", porcentajeLimpio));
        reporte.append("----------------------------------------------------\n");
        reporte.append("🎯 DESGLOSE DE DISPARADORES (Triggers):\n");

        Map<String, Double> disparadores = obtenerPorcentajeDisparadores();
        for (Map.Entry<String, Double> entry : disparadores.entrySet()) {
            reporte.append(String.format("   • %s: %.1f%% de tus recaídas\n", entry.getKey(), entry.getValue()));
        }

        reporte.append("----------------------------------------------------");
        return reporte.toString();
    }
}