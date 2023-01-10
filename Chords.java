import java.io.*;
import java.util.ArrayList;

public class Chords {
    int[][] STRINGS = new int[][] {
        {20, 25, 30, 35, 40, 45, -1},
        {55, 0,   5, 10, 15, 20, -1},
        {35, 40, 45, 50, 55,  0, -1},
        {10, 15, 20, 25, 30, 35, -1},
        {45, 50, 55, 0,   5, 10, -1},
        {20, 25, 30, 35, 40, 45, -1}
    };
/* 
    String[][] FRETS = new String[][] {
            {"E", "F", "F#", "G", "G#", "A", "x"},
            {"B", "C", "C#", "D", "D#", "E", "x"},
            {"G", "G#", "A", "A#", "B", "C", "x"},
            {"D", "D#", "E", "F", "F#", "G", "x"},
            {"A", "A#", "B", "C", "C#", "D", "x"},
            {"E", "F", "F#", "G", "G#", "A", "x"}
    };
*/
    private int[] fretNums = new int[6];
    private int[] fretNote = new int[6];
    private String[] chordNames = new String[6]; 

    public int readFrets() throws IOException {
        // reads the chord's frets from stdin
        int STR_NUM = 6;
        int i = 1;
        int r;
        System.out.println("Enter frets for the strings. 'x' means the string is muted.");
        System.out.print("Fret #" + i + ": ");
        do {
            r = System.in.read();
            if (r > 32) {
                if (r == 120) {
                    System.out.println(" Got 'x'");
                    fretNums[i-1] = 6;
                    i++;
                } else if ((r-'0' <= 5) && (r-'0' >= 0)) {
                    //System.out.println("Got " + String.valueOf(r));
                    fretNums[i-1] = r - '0';
                    i++;
                } else {
                    System.out.println("Fret number should be between 0 and 5. Please enter the correct value.");
                }
                if (i <= 6) {
                    System.out.print("Fret #" + i + ": ");
                }
            }

        } while (i <= STR_NUM);

        //for (int j = 1; j <= 6; j++) {
        //    System.out.println("Fret: " + j + ", Note: " + FRETS[j-1][fretNums[j-1]]);
        //}

        return 0;
    }

    public int drawFrets() {
        // draws the chord
        String chordLine;
        System.out.println("");

        for (int j = 1; j <= 6; j++) {
            chordLine = fretNums[j-1] + "|";
            if (fretNums[j-1] == 6) {
                chordLine = "X|---|---|---|---|---|";
            } else if (fretNums[j-1] == 0) {
                chordLine = "o|---|---|---|---|---|";
            } else {
                for (int k = 1; k < 6; k++) {
                    if (k == fretNums[j-1]) {
                        chordLine = chordLine + "-o-|";
                    } else {
                        chordLine = chordLine + "---|";
                    }
                }
            }
            System.out.println(chordLine + "-");
        }
        return 0;
    }

    public void fillNotes() {
        // fills the fretNote structure with notes' int representations
        for (int i = 0; i < 6; i++) {
            this.fretNote[i] = this.STRINGS[i][fretNums[i]]; 
        }
        //for (int i: this.fretNote) {
        //    System.out.println("Note "+i);
        //}
    }

    public void buildChords() {
    // iterates thru strings and builds chords for each string as a root
        int i;
        String chordName;
        ArrayList<String> chordNamesList = new ArrayList<String>();

        for (i = 0; i < 6; i++) {
            chordName = this.calcChord(i);
            if (!chordNamesList.contains(chordName)) {
                chordNamesList.add(chordName);
            }
        }
        System.out.println("\nPossible chords are:");
        for (String s: chordNamesList) {
            if (s.indexOf("(Oops)") < 0) {
                System.out.println(s);
            }    
        }
        System.out.println("");
        
    }

    public String calcChord(int strNum) {
        // fills chordNames[strNum] field
        int i;
        int root = this.fretNote[strNum];
        int[] intervals = new int[6];

        for (i = 0; i < 6; i++) {
            if (root == -1) {
                intervals[i] = -1;
                continue;
            }
            if (this.fretNote[i] != -1) {
                intervals[i] = this.fretNote[i] - root;
            } else {
                intervals[i] = -1;
            }
            if (intervals[i] < -1) {
                intervals[i] += 60;
            }
        }
        //System.out.println("Intervals:"+intervals[0]+","+intervals[1]+","+intervals[2]+","+intervals[3]+","+intervals[4]+","+intervals[5]+".");

        this.chordNames[0] = this.is3(intervals);
        this.chordNames[1] = this.is5(intervals);
        this.chordNames[2] = this.is7(intervals);
        this.chordNames[3] = this.is9(intervals);
        this.chordNames[4] = this.is11(intervals);
        this.chordNames[5] = this.is6(intervals);

        return this.convRoot2Note(root)+this.chordNames[0]+this.chordNames[1]+this.chordNames[2]+this.chordNames[3]+this.chordNames[4]+this.chordNames[5];

    }
    public String convRoot2Note(int root) {
        // converts int into the symbol
        switch (root) {
            case 0:  return "C";
            case 5:  return "C#";
            case 10: return "D";
            case 15: return "D#";
            case 20: return "E";
            case 25: return "F";
            case 30: return "F#";
            case 35: return "G";
            case 40: return "G#";
            case 45: return "A";
            case 50: return "A#";
            case 55: return "B";
            default: return "(Oops)";
        }
    }

    public boolean isInArray(int[] intervals, int interval) {
        // checks if an interval is present in the intervals array
        for (int i = 0; i < 6; i++) {
            if (interval == intervals[i]) {
                return true;
            }
        }
        return false;
    }

    public String is3(int[] intervals) {
        if ((isInArray(intervals, 20) == true) 
        && (isInArray(intervals, 10) == false) 
        && (isInArray(intervals, 15) == false)
        && (isInArray(intervals, 25) == false)
        ) {
            return ""; // major
        }
        if ((isInArray(intervals, 15) == true) 
        && (isInArray(intervals, 10) == false) 
        && (isInArray(intervals, 20) == false)
        && (isInArray(intervals, 25) == false)
        ) {
             return "m"; // minor
        }
        if ((isInArray(intervals, 10) == true) 
        && (isInArray(intervals, 15) == false) 
        && (isInArray(intervals, 20) == false)
        && (isInArray(intervals, 25) == false)
        ) {
            return "sus2";
        }
        if ((isInArray(intervals, 25) == true) 
        && (isInArray(intervals, 10) == false) 
        && (isInArray(intervals, 20) == false)
        && (isInArray(intervals, 15) == false)
        ) {
            return "sus4";
        }
        return "(No3)";
    }

    public String is5(int[] intervals) {
        if ((isInArray(intervals, 35) == true) 
        && (isInArray(intervals, 30) == false) 
        && (isInArray(intervals, 40) == false)) {
            return "";
        }
        if ((isInArray(intervals, 30) == true) 
        && (isInArray(intervals, 35) == false) 
        && (isInArray(intervals, 40) == false)) {
            return "dim5";
        }
        if ((isInArray(intervals, 40) == true) 
        && (isInArray(intervals, 30) == false) 
        && (isInArray(intervals, 35) == false)) {
            return "aug5";
        }
        return "(No5)";
    }

    public String is7(int[] intervals) {
        if (isInArray(intervals, 45) == true) {
            return "/b7";
        }
        if (isInArray(intervals, 50) == true) {
            return "/7";
        }
        if (isInArray(intervals, 55) == true) {
            return "/maj7";
        }
        return "";
    }

    public String is9(int[] intervals) {
        if (isInArray(intervals, 05) == true) {
            return "/b9";
        }
        if ((isInArray(intervals, 10) == true) && (chordNames[0] != "sus2")) {
            return "/9";
        }
        return "";
    }

    public String is11(int[] intervals) {
        if ((isInArray(intervals, 25) == true) && (chordNames[0] != "sus4")) {
            return "/11";
        }
        return "";
    }

    public String is6(int[] intervals) {
        if ((isInArray(intervals, 40) == true) && (chordNames[1] != "aug5")) {
            return "/6";
        }
        return "";
    }

}