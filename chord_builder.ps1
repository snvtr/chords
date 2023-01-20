$notes = @(0,1,2,3,4,5);
$notes[0] = @(20,25,30,35,40,45,-1)
$notes[1] = @(55, 0, 5,10,15,20,-1)
$notes[2] = @(35,40,45,50,55, 0,-1)
$notes[3] = @(10,15,20,25,30,35,-1)
$notes[4] = @(45,50,55, 0, 5,10,-1)
$notes[5] = @(20,25,30,35,40,45,-1)

Function Read-Frets() {
    $frets = @()
    $i = 0
    while ($i -lt 6) {
        $x = (Read-Host -Prompt "Enter fret #$i")
        if ($x -eq "x") {
            $frets += -1
            $i++
        } elseif ((([int]$x) -ge 0) -and (([int]$x) -le 5)) {
            $frets += [int]$x
            $i++
        } else {
            continue
        }
    }
    return $frets
}

Function Get-Note($note_no) {
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

Function Initialize-FretNotes($frets) {
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

Function Initialize-Intervals($numNotes, $root) {
    
    #param (
    #    $numNotes,
    #    $root
    #)

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
    return ($intervals | Sort-Object | Get-Unique)
}

Function Show-Frets() {

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
        $n = Get-Note($m)
        $out = $out + "- " + $n
        Write-Output $out
    }
}

Function Test-InArray($array, $interval_value) {
    for ($i = 0; $i -lt 6; $i++) {
        if ($array[$i] -eq $interval_value) {
            return $true
        }
    }
    return $false
}

Function Set-Chord($intervals) {
    $chord = ""
    $chord += Test-Is3 $intervals
    $chord += Test-Is5 $intervals
    $chord += Test-Is7 $intervals
    $chord += Test-Is9 $intervals $chord
    $chord += Test-Is11 $intervals $chord
    $chord += Test-Is6 $intervals $chord
    return $chord    
}

Function Test-Is3($intervals) {
    if (Test-InArray $intervals 20 -eq $true -and Test-InArray $intervals 15 -eq $false -and Test-InArray $intervals 25 -eq $false) {
        return "" # major
    }
    if (Test-InArray $intervals 15 -eq $true -and Test-InArray $intervals 20 -eq $false -and Test-InArray $intervals 25 -eq $false) {
        return "m" # minor
    }
    if (Test-InArray $intervals 10 -eq $true -and Test-InArray $intervals 15 -eq $false -and Test-InArray $intervals 20 -eq $false -and Test-InArray $intervals 25 -eq $false) {
        return "sus2"
    }
    if (Test-InArray $intervals 25 -eq $true -and Test-InArray $intervals 10 -eq $false -and Test-InArray $intervals 20 -eq $false -and Test-InArray $intervals 15 -eq $false) {
        return "sus4"
    }
    return "(No3)"
}

Function Test-Is5($intervals) {
    if (Test-InArray $intervals 35 -eq $true -and Test-InArray $intervals 30 -eq $false -and Test-InArray $intervals 40 -eq $false) {
         return ""
    }
    if (Test-InArray $intervals 30 -eq $true -and Test-InArray $intervals 35 -eq $false -and Test-InArray $intervals 40 -eq $false) {
        return "dim5"
    }
    if (Test-InArray $intervals 40 -eq $true -and Test-InArray $intervals 30 -eq $false -and Test-InArray $intervals 35 -eq $false) {
        return "aug5"
    }
    return "(No5)"
}

Function Test-Is7($intervals) {
    if (Test-InArray $intervals 45 -eq $true) {
        return "/b7"
    }
    if (Test-InArray $intervals 50 -eq $true) {
        return "/7"
    }
    if (Test-InArray $intervals 55 -eq $true) {
        return "/maj7"
    }
    return ""
}

Function Test-Is9($intervals, $chord) {
    if (Test-InArray $intervals 5 -eq $true) {
        return "/b9";
    }
    if (Test-InArray $intervals 10 -eq $true) {
        if ($chord -NotMatch "sus2") {
            return "/9";
        }
    }
    return "";
}

Function Test-Is11($intervals, $chord) {
    if (Test-InArray $intervals 25 -eq $true) {
        if ($chord -NotMatch "sus4") {
            return "/11";
        }
    }
    return "";
}

Function Test-Is6($intervals, $chord) {
    if (Test-InArray $intervals 40 -eq $true) {
        if ($chord -NotMatch "aug5") {
            return "/6";
        }
    }
    return "";
}


# debug Function
Function Show-Intervals($intervals) {

   Write-Host "`n[debug]Intervals:"
   For ($i = 0; $i -lt $intervals.Length; $i++) {
       $x = $intervals[$i] -Split ""
       if (([int]$intervals[$i]) -lt 10) {
           Write-Host ("0,"+$x[1]+"; ") -Nonewline
       } else {
           Write-Host ($x[1]+","+$x[2]+"; ") -Nonewline
       }
   }
   Write-Host ""

}

$frets = Read-Frets
#$frets = @(1,1,2,1,3,-1)
$numNotes = Initialize-FretNotes $frets
Show-Frets $frets

$chords = @()
for ($i = 0; $i -lt 6; $i++) {
    if ($numNotes[$i] -ne -1) {
        $intervals = Initialize-Intervals $numNotes $i
        Show-Intervals $intervals
        $rootNote = Get-Note $numNotes[$i] 
        $chord = Set-Chord $intervals
        $chord = $rootNote + $chord
        $chords += $chord
    }    
}

Write-Output "`nChord names are:"
foreach ($unique in $($chords | Sort-Object | Get-Unique)) {
    Write-Output $unique
}
