public enum TipoRecaida {
    PORNO_Y_MASTURBACION("Porno + Masturbación / Eyaculación"),
    SOLO_PORNO("Solo Porno / Peeking (Sin eyaculación)");

    private final String descripcion;

    TipoRecaida(String descripcion) {
        this.descripcion = descripcion;
    }

    public String getDescripcion() {
        return descripcion;
    }
}