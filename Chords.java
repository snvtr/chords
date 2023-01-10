//import java.io.IOException;

public class Chords {

    int[] chordStruct = new int[6];
    int[] notes = new int[] {0, 20, 35, 20, 35, -1};
    String[] chordNames = new String[6];
    
    public Chords () {
        //;
    }

    public void buildChords() {
    // iterates thru strings
        int i;

        for (i = 0; i < 6; i++) {
            System.out.println(this.calcChord(i));
        }

    }

    public String convRoot2Note(int root) {
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

    public String calcChord(int strNum) {
        // fills chordNames[strNum] field

        int i;
        int root = this.notes[strNum];
        int[] intervals = new int[6];

        for (i = 0; i < 6; i++) {
            if (root == -1) {
                intervals[i] = -1;
                continue;
            }
            if (notes[i] != -1) {
                intervals[i] = notes[i] - root;
            } else {
                intervals[i] = -1;
            }
            if (intervals[i] < -1) {
                intervals[i] += 60;
            }
        }
        System.out.println("Intervals:"+intervals[0]+","+intervals[1]+","+intervals[2]+","+intervals[3]+","+intervals[4]+","+intervals[5]+".");

        this.chordNames[0] = this.is3(intervals);
        this.chordNames[1] = this.is5(intervals);
        this.chordNames[2] = this.is7(intervals);
        this.chordNames[3] = this.is9(intervals);
        this.chordNames[4] = this.is11(intervals);
        this.chordNames[5] = this.is6(intervals);

        return this.convRoot2Note(root)+this.chordNames[0]+this.chordNames[1]+this.chordNames[2]+this.chordNames[3]+this.chordNames[4]+this.chordNames[5];

    }

    public boolean isInArray(int[] intervals, int interval) {
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
