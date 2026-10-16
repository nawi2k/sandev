import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        GestorEstadisticas gestor = new GestorEstadisticas();
        
        // Formato Argentino: DD/MM/YYYY HH:mm
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");

        int opcion = -1;

        System.out.println("====================================================");
        System.out.println("         SANDEV SYSTEM - CONTROL DE HABITOS         ");
        System.out.println("====================================================");

        while (opcion != 0) {
            System.out.println("\n--- MENU PRINCIPAL ---");
            System.out.println("1. Registrar Evento de Recaida");
            System.out.println("2. Generar Reporte Analitico Semanal");
            System.out.println("0. Salir");
            System.out.print("Seleccione una opcion: ");

            try {
                opcion = Integer.parseInt(scanner.nextLine());

                switch (opcion) {
                    case 1:
                        System.out.println("\n--- NUEVO REGISTRO DE EVENTO ---");
                        
                        // Ejemplo: 16/10/2026 15:10
                        System.out.print("Fecha y hora de INICIO (Formato: DD/MM/YYYY HH:MM, ej: 16/10/2026 15:10): ");
                        String inicioStr = scanner.nextLine();
                        LocalDateTime inicio = LocalDateTime.parse(inicioStr, formatter);

                        System.out.print("Fecha y hora de FIN (Formato: DD/MM/YYYY HH:MM, ej: 16/10/2026 17:40): ");
                        String finStr = scanner.nextLine();
                        LocalDateTime fin = LocalDateTime.parse(finStr, formatter);

                        System.out.println("\nTipo de Recaida:");
                        System.out.println("1. Porno + Masturbacion / Eyaculacion (X Rojo)");
                        System.out.println("2. Solo Porno / Peeking (Linea Verde/Roja)");
                        System.out.print("Elija tipo (1 o 2): ");
                        int tipoSel = Integer.parseInt(scanner.nextLine());

                        TipoRecaida tipo = (tipoSel == 1) 
                            ? TipoRecaida.PORNO_Y_MASTURBACION 
                            : TipoRecaida.SOLO_PORNO;

                        System.out.print("Disparador / Trigger (ej: Instagram, Aburrimiento, Cansancio): ");
                        String disparador = scanner.nextLine();

                        System.out.print("Nota de contexto (¿Que paso antes?): ");
                        String notas = scanner.nextLine();

                        RegistroEvento nuevoEvento = new RegistroEvento(inicio, fin, tipo, disparador, notas);
                        gestor.agregarEvento(nuevoEvento);

                        System.out.println("\n✅ Evento registrado correctamente en Sandev.");
                        break;

                    case 2:
                        System.out.println("\n" + gestor.generarReporteSemanal());
                        break;

                    case 0:
                        System.out.println("\n👋 Cerrando Sandev Engine. ¡Mantene la disciplina, Nahuel!");
                        break;

                    default:
                        System.out.println("\n❌ Opcion invalida. Elija 0, 1 o 2.");
                        break;
                }

            } catch (NumberFormatException e) {
                System.out.println("\n❌ ERROR: Debe ingresar un valor numerico valido.");
            } catch (DateTimeParseException e) {
                System.out.println("\n❌ ERROR DE FECHA: Usa el formato 'DD/MM/YYYY HH:MM' (ej: 16/10/2026 15:10).");
            }
        }

        scanner.close();
    }
}