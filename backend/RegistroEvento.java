package backend;
import java.time.Duration;
import java.time.LocalDateTime;

public class RegistroEvento {
    private LocalDateTime inicio;
    private LocalDateTime fin;
    private TipoRecaida tipo;
    private String disparador; // Ej: "Instagram", "Aburrimiento", "Estrés"
    private String notaContexto;

    // CONSTRUCTOR
    public RegistroEvento(LocalDateTime inicio, LocalDateTime fin, TipoRecaida tipo, String disparador, String notaContexto) {
        this.inicio = inicio;
        this.fin = fin;
        this.tipo = tipo;
        this.disparador = disparador;
        this.notaContexto = notaContexto;
    }

    // MÉTODO DE NEGOCIO: Calcula la duración en minutos de la recaída
    public long getDuracionMinutos() {
        return Duration.between(inicio, fin).toMinutes();
    }

    // GETTERS
    public LocalDateTime getInicio() {
        return inicio;
    }

    public LocalDateTime getFin() {
        return fin;
    }

    public TipoRecaida getTipo() {
        return tipo;
    }

    public String getDisparador() {
        return disparador;
    }

    public String getNotaContexto() {
        return notaContexto;
    }

    public String obtenerResumen() {
        return "📅 Registro: " + inicio.toLocalDate() + " [" + inicio.toLocalTime() + " hs - " + fin.toLocalTime() + " hs]\n" +
               "⏱️ Duración: " + getDuracionMinutos() + " minutos\n" +
               "⚠️ Tipo: " + tipo.getDescripcion() + "\n" +
               "🎯 Disparador: " + disparador + "\n" +
               "📝 Contexto: " + notaContexto;
    }
}