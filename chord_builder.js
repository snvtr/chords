"use strict";

// it runs on windows scripting host.

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
    var iSet, chordName;
    var chords = new Array();
    var chordTypes = new Object();
    chordTypes = ({"II":  "",
                   "III": "",
                   "IV":  "",
                   "V":   "",
                   "VI":  "",
                   "VII": ""});
    for (var i = 0; i < 6; i++) {
        iSet = intervals[i].sort();
        chordName = FRETS[i][frets[i]];
        //for (var j = 0; j < iSet.length; j++) { alert(iSet); }    
        chordTypes["III"] = is_3(iSet);
        chordTypes["V"]   = is_5(iSet);
        chordTypes["VII"] = is_7(iSet);
        chordTypes["VI"]  = is_6(iSet, chordTypes);
        chordTypes["II"]  = is_9(iSet, chordTypes);
        chordTypes["IV"]  = is_11(iSet, chordTypes);

        chordName += chordTypes["III"] 
                   + chordTypes["V"] 
                   + chordTypes["VII"]
                   + chordTypes["VI"]
                   + chordTypes["II"]
                   + chordTypes["IV"];
        chords.push(chordName);
    }
    return chords;
}

function is_5(iSet) {
    if ((isInArray(iSet, 3.5) == true) && (isInArray(iSet, 3.0) == false) && (isInArray(iSet, 4.0) == false)) {
        return "";
    }
    if ((isInArray(iSet, 3.0) == true) && (isInArray(iSet, 3.5) == false) && (isInArray(iSet, 4.0) == false)) {
        return "dim5";
    }
    if ((isInArray(iSet, 4.0) == true) && (isInArray(iSet, 3.0) == false) && (isInArray(iSet, 3.5) == false)) {
        return "aug5";
    }
    return "(No5)";
}

function is_3(iSet) {
    if ((isInArray(iSet, 2.0) == true) && (isInArray(iSet, 1.5) == false) && (isInArray(iSet, 2.5) == false)) { //&& (isInArray(iSet, 1.0) == false) 
        return ""; // major
    }
    if ((isInArray(iSet, 1.5) == true) && (isInArray(iSet, 2.0) == false) && (isInArray(iSet, 2.5) == false)) { //&& (isInArray(iSet, 1.0) == false) 
        return "m"; // minor
    }
    if ((isInArray(iSet, 1.0) == true) && (isInArray(iSet, 1.5) == false) && (isInArray(iSet, 2.0) == false) && (isInArray(iSet, 2.5) == false)) {
        return "sus2";
    }
    if ((isInArray(iSet, 2.5) == true) && (isInArray(iSet, 1.0) == false) && (isInArray(iSet, 2.0) == false) && (isInArray(iSet, 1.5) == false)) {
        return "sus4";
    }
    return "(No3)";
}

function is_7(iSet) {
    if (isInArray(iSet, 4.5) == true) {
        return "/b7";
    }
    if (isInArray(iSet, 5.0) == true) {
        return "/7";
    }
    if (isInArray(iSet, 5.5) == true) {
        return "/maj7";
    }
    return "";
}

function is_9(iSet, chordTypes) {
    if (isInArray(iSet, 0.5) == true) {
        return "/b9";
    }
    if (isInArray(iSet, 1.0) == true) {
        if (chordTypes["III"].search(/sus2/) < 0) {
            return "/9";
        }
    }
    return "";
}

function is_6(iSet, chordTypes) {
    if (isInArray(iSet, 4.0) == true) {
        if (chordTypes["V"].search(/aug5/) < 0) {
            return "/6";
        }
    }
    return "";
}

function is_11(iSet, chordTypes) {
    if (isInArray(iSet, 2.5) == true) {
        if (chordTypes["III"].search(/sus4/) < 0) {
            return "/11";
        }
    }
    return "";
}

// aka console.log():
function alert(message) {
    WScript.StdOut.writeline(message);
}
