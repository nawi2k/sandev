import java.time.LocalDateTime;

public class Main {
    public static void main(String[] args) {
        System.out.println("=== SANDEV - CORE SYSTEM ===");

        // Simulamos la recaída del 16/10/2026 de 15:10 a 17:40
        LocalDateTime inicio = LocalDateTime.of(2026, 10, 16, 15, 10);
        LocalDateTime fin = LocalDateTime.of(2026, 10, 16, 17, 40);

        RegistroEvento evento1 = new RegistroEvento(
            inicio, 
            fin, 
            TipoRecaida.PORNO_Y_MASTURBACION, 
            "Instagram", 
            "Volví de boxeo, me metí a Instagram y de ahí salté a ver porno."
        );

        System.out.println("\n" + evento1.obtenerResumen());
    }
}