"use strict";

var STRINGS = new Array(6);
for (var i = 0; i < 6; i++) {
    STRINGS[i] = new Array(6);
}

STRINGS[0] = new Array(2.0, 2.5, 3.0, 3.5, 4.0, 4.5);
STRINGS[1] = new Array(5.5, 0.0, 0.5, 1.0, 1.5, 2.0);
STRINGS[2] = new Array(3.5, 4.0, 4.5, 5.0, 5.5, 0.0);
STRINGS[3] = new Array(1.0, 1.5, 2.0, 2.5, 3.0, 3.5);
STRINGS[4] = new Array(4.5, 5.0, 5.5, 0.0, 0.5, 1.0);
STRINGS[5] = new Array(2.0, 2.5, 3.0, 3.5, 4.0, 4.5);

var FRETS = new Array(6);
for (var i = 0; i < 6; i++) {
    FRETS[i] = new Array(6);
}

FRETS[0] = new Array("E", "F", "F#", "G", "G#", "A");
FRETS[1] = new Array("B", "C", "C#", "D", "D#", "E");
FRETS[2] = new Array("G", "G#", "A", "A#", "B", "C");
FRETS[3] = new Array("D", "D#", "E", "F", "F#", "G");
FRETS[4] = new Array("A", "A#", "B", "C", "C#", "D");
FRETS[5] = new Array("E", "F", "F#", "G", "G#", "A");

var NOTES = new Object({
0.0: "C",
0.5: "C#",
1.0: "D",
1.5: "D#",
2.0: "E",
2.5: "F",
3.0: "F#",
3.5: "G",
4.0: "G#",
4.5: "A",
5.0: "A#",
5.5: "B"});

//************************ main() ***********************//

var frets = readFrets();
drawFrets(frets);
var notes = fillNotes(frets);
var intervals = buildIntervals(notes);
var chords    = buildChords(intervals, frets).sort();
for (var i = 0; i < chords.length; i++) {
    if (frets[i] == -1) {
        continue;
    }
    if (chords[i+1] == chords[i]) {
        continue;
    } else {
        alert(chords[i]);
    }
}

//********************* functions() *********************//

function readFrets() {
    var i = 0;
    var frets = new Array();
    while (i < 6) {
        WScript.StdOut.write("Enter fret # for string #" + i + ":");
        var input = WScript.StdIn.readline();
        var inputInt = parseInt(input);
        if (input.toLowerCase() == "x") {
            frets.push(-1);
        } else if ((inputInt >= 0) && (inputInt <= 5)) {
            frets.push(inputInt);
        } else {
            continue;
        }
        i++;
    }
    return frets;
}

function fillNotes(frets) {
    var notes = new Array(); 
    for (var i = 0; i < 6; i++) {
        if (frets[i] == "x") {
            notes.push(-1);
        } else {
            notes.push(STRINGS[i][frets[i]]);
        }
    }
    return notes;
}

function buildIntervals(notes) {
    var intervals = new Array();
    for (var i = 0; i < 6; i++) {
        intervals[i] = new Array();
        for (var j = 0; j < 6; j++) {
            interval = notes[j] - notes[i];
            if (notes[j] == -1) {
                continue;
            }
            if (interval < 0) {
                interval += 6;
            }
            if (isInArray(intervals[i], interval) == false) {
                intervals[i].push(interval);
            }
        }
    }
    return intervals;
}

function drawFrets(frets) {
    var out_str = "\n";
    for(var i = 0; i < 6; i++) {
        if (frets[i] == -1) {
            out_str += "x";
        } else {
            out_str += frets[i];
        }
        out_str += "|";
        for (var j = 1; j < 6; j++) {
            if (frets[i] == j) {
                out_str += "-O-|";
            } else {
                out_str += "---|";
            }
        }
        out_str += "\n";
    }
    alert(out_str);
}

function isInArray(array, interval_value) {
    for (var k = 0; k < array.length; k++) {
        if (array[k] == interval_value) {
            return true;
        }
    }
    return false;
}

function buildChords(intervals, frets) {
    var interval_set;
    var chord_name;
    var chords = new Array();
    var chord_types = new Object();
    chord_types = ({"II":  "",
                    "III": "",
                    "IV":  "",
                    "V":   "",
                    "VI":  "",
                    "VII": ""});
    for (var i = 0; i < 6; i++) {
        interval_set = intervals[i].sort();
        chord_name = FRETS[i][frets[i]];
        //alert(chord_name);
        chord_types["III"] = type_III(interval_set);
        chord_types["V"]   = type_V(interval_set);
        chord_types["VII"] = is_7(interval_set, chord_types);
        chord_types["VI"]  = is_6(interval_set, chord_types);
        chord_types["II"]  = is_9(interval_set, chord_types);
        chord_types["IV"]  = is_11(interval_set, chord_types);

        chord_name += chord_types["III"] 
                    + chord_types["V"] 
                    + chord_types["VII"]
                    + chord_types["VI"]
                    + chord_types["II"]
                    + chord_types["IV"];
        chords.push(chord_name);
    }
    return chords;
}

function type_V(interval_set) {
    if ((isInArray(interval_set, 3.5) == true) 
            && (isInArray(interval_set, 3.0) == false) 
            && (isInArray(interval_set, 4.0) == false)) {
        return "";
    }
    if ((isInArray(interval_set, 3.0) == true) 
            && (isInArray(interval_set, 3.5) == false) 
            && (isInArray(interval_set, 4.0) == false)) {
        return "dim5";
    }
    if ((isInArray(interval_set, 4.0) == true) 
            && (isInArray(interval_set, 3.0) == false) 
            && (isInArray(interval_set, 3.5) == false)) {
        return "aug5";
    }
    return "(No5)";
}

function type_III(interval_set) {
    if ((isInArray(interval_set, 2.0) == true) 
            && (isInArray(interval_set, 1.0) == false) 
            && (isInArray(interval_set, 1.5) == false)
            && (isInArray(interval_set, 2.5) == false)
            ) {
        return ""; // major
    }
    if ((isInArray(interval_set, 1.5) == true) 
            && (isInArray(interval_set, 1.0) == false) 
            && (isInArray(interval_set, 2.0) == false)
            && (isInArray(interval_set, 2.5) == false)
            ) {
        return "m"; // minor
    }
    if ((isInArray(interval_set, 1.0) == true) 
            && (isInArray(interval_set, 1.5) == false) 
            && (isInArray(interval_set, 2.0) == false)
            && (isInArray(interval_set, 2.5) == false)
            ) {
        return "sus2";
   }
   if ((isInArray(interval_set, 2.5) == true) 
           && (isInArray(interval_set, 1.0) == false) 
           && (isInArray(interval_set, 2.0) == false)
           && (isInArray(interval_set, 1.5) == false)
           ) {
        return "sus4";
    }
    return "(No3)";
}

function is_7(interval_set, chord_types) {
    if (isInArray(interval_set, 4.5) == true) {
        return "/b7";
    }
    if (isInArray(interval_set, 5.0) == true) {
        return "/7";
    }
    if (isInArray(interval_set, 5.5) == true) {
        return "/maj7";
    }
    return "";
}

function is_9(interval_set, chord_types) {
    if (isInArray(interval_set, 0.5) == true) {
        return "/b9";
    }
    if ((isInArray(interval_set, 1.0) == true) && (chord_types["III"] != "sus2")) {
        return "/9";
    }
    return "";
}

function is_6(interval_set, chord_types) {
    if ((isInArray(interval_set, 4.0) == true) && (chord_types["V"] != "aug5")) {
        return "/6";
    }
    return "";
}

function is_11(interval_set, chord_types) {
    if ((isInArray(interval_set, 2.5) == true) && (chord_types["III"] != "sus4")) {
        return "/11";
    }
    return "";
}

// aka console.log():
function alert(message) {
    WScript.StdOut.writeline(message);
}
