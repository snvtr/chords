import java.io.IOException;

public class Main {
    public static void main(String[] args) throws IOException {

        Chords chords = new Chords();

        chords.readFrets();
        chords.drawFrets();
        chords.fillNotes();
        chords.buildChords();
    }
}
