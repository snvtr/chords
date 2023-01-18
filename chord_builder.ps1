$notes = @(0,1,2,3,4,5);
$notes[0] = @(20,25,30,35,40,45,-1)
$notes[1] = @(55, 0, 5,10,15,20,-1)
$notes[2] = @(35,40,45,50,55, 0,-1)
$notes[3] = @(10,15,20,25,30,35,-1)
$notes[4] = @(45,50,55, 0, 5,10,-1)
$notes[5] = @(20,25,30,35,40,45,-1)

Function readFrets() {
    $frets = @()
    $i = 0
    while ($i -lt 6) {
        $x = (Read-Host -Prompt "Enter fret #$i")
        if ($x -eq "x") {
            $frets += -1
            $i++
        } elseif (($x -ge 0) -and ($x -le 5)) {
            $frets += [int]$x
            $i++
        } else {
            continue
        }
    }
    return $frets
}

Function getNote($note_no) {
    Switch ($note_no) {
        0 { return "C"  }
        5 { return "C#" }
       10 { return "D"  }
       15 { return "D#" }
       20 { return "E"  }
       25 { return "F"  }
       30 { return "F#" }
       35 { return "G"  }
       40 { return "G#" }
       45 { return "A"  }
       50 { return "A#" }
       55 { return "B"  }
       -1 { return "x"  }
       default { return "(Oops)" }
    }
}

Function fillFretNotes($frets) {
    $numNotes = @()
    for ($i = 0; $i -lt 6; $i++) {
        if ($frets[$i] -ne -1) {
            $numNotes += $notes[$i][$frets[$i]]
        } else {
            $numNotes += -1
        }
    }
    return $numNotes
}

Function buildIntervals() {
    
    param (
        $numNotes,
        $root
    )

    #Write-Host "Root:" $root "numNotes:" $numNotes
    $intervals = @()
    for ($i = 0; $i -lt 6; $i++) {
        if ($numNotes[$i] -eq -1) {
            $intervals += 0
        } else {    
            $x = [int]($numNotes[$i]) - [int]($numNotes[$root])
            if ($x -lt 0) {
                $x += 60
            }
            $intervals += $x
        }    
    }
    #Write-Host "Intervals:" $intervals
    return $intervals
}

Function drawFrets() {

    Write-Output "`n"
    for ($i = 0; $i -lt 6; $i++) {
        if ($frets[$i] -ge 0) {
            $out = " " + [string]$frets[$i] + "||"
        } else {
            $out = " x||"
        }
        for ($s = 1; $s -lt 6; $s++) {
            if ($frets[$i] -eq $s) {
                $out = $out + "-o-|"
            } else {
                $out = $out + "---|"
            }
        }
        # something wrong here. could not compress these four lines into one:
        $m = $notes[$i][$frets[$i]]
        $n = getNote($m)
        $out = $out + "- " + $n
        Write-Output $out
    }
}

Function isInArray($array, $interval_value) {
    for ($i = 0; $i -lt 6; $i++) {
        if ($array[$i] -eq $interval_value) {
            return $true
        }
    }
    return $false
}

Function buildChord($intervals) {
    $chord = ""
    $chord += is3 $intervals
    $chord += is5 $intervals
    $chord += is7 $intervals
    $chord += is9 $intervals $chord
    $chord += is11 $intervals $chord
    $chord += is6 $intervals $chord
    return $chord    
}

Function is3($intervals) {
    if (isInArray $intervals 20 -eq $true -and isInArray $intervals 15 -eq $false -and isInArray $intervals 25 -eq $false) {
        return "" # major
    }
    if (isInArray $intervals 15 -eq $true -and isInArray $intervals 20 -eq $false -and isInArray $intervals 25 -eq $false) {
        return "m" # minor
    }
    if (isInArray $intervals 10 -eq $true -and isInArray $intervals 15 -eq $false -and isInArray $intervals 20 -eq $false -and isInArray $intervals 25 -eq $false) {
        return "sus2"
    }
    if (isInArray $intervals 25 -eq $true -and isInArray $intervals 10 -eq $false -and isInArray $intervals 20 -eq $false -and isInArray $intervals 15 -eq $false) {
        return "sus4"
    }
    return "(No3)"
}

Function is5($intervals) {
    if (isInArray $intervals 35 -eq $true -and isInArray $intervals 30 -eq $false -and isInArray $intervals 40 -eq $false) {
         return ""
    }
    if (isInArray $intervals 30 -eq $true -and isInArray $intervals 35 -eq $false -and isInArray $intervals 40 -eq $false) {
        return "dim5"
    }
    if (isInArray $intervals 40 -eq $true -and isInArray $intervals 30 -eq $false -and isInArray $intervals 35 -eq $false) {
        return "aug5"
    }
    return "(No5)"
}

Function is7($intervals) {
    if (isInArray $intervals 45 -eq $true) {
        return "/b7"
    }
    if (isInArray $intervals 50 -eq $true) {
        return "/7"
    }
    if (isInArray $intervals 55 -eq $true) {
        return "/maj7"
    }
    return ""
}

Function is9($intervals, $chord) {
    if (isInArray $intervals 5 -eq $true) {
        return "/b9";
    }
    if (isInArray $intervals 10 -eq $true) {
        if ($chord -NotMatch "sus2") {
            return "/9";
        }
    }
    return "";
}

Function is11($intervals, $chord) {
    if (isInArray $intervals 25 -eq $true) {
        if ($chord -NotMatch "sus4") {
            return "/11";
        }
    }
    return "";
}

Function is6($intervals, $chord) {
    if (isInArray $intervals 40 -eq $true) {
        if ($chord -NotMatch "aug5") {
            return "/6";
        }
    }
    return "";
}

$frets = readFrets
#$frets = @(1,1,2,1,3,-1)
$numNotes = fillFretNotes($frets)
drawFrets($frets)

$chords = @()
for ($i = 0; $i -lt 6; $i++) {
    if ($numNotes[$i] -ne -1) {
        $intervals = buildIntervals $numNotes $i
        $rootNote = getNote $numNotes[$i] 
        $chord = buildChord $intervals
        $chord = $rootNote + $chord
        $chords += $chord
    }    
}

Write-Output "`nChord names are:"
foreach ($unique in $($chords | Sort-Object | Get-Unique)) {
    Write-Output $unique
}

