from sys import stdin
from pprint import pprint
from os import system

class Tab(object):

    STRINGS = {
        6: [2,   2.5, 3,   3.5, 4,   4.5],
        5: [4.5, 5,   5.5, 0,   0.5, 1],
        4: [1,   1.5, 2,   2.5, 3,   3.5],
        3: [3.5, 4,   4.5, 5,   5.5, 0],
        2: [5.5, 0,   0.5, 1,   1.5, 2],
        1: [2,   2.5, 3,   3.5, 4,   4.5]
    }

    FRETS = {
        1: ['E', 'F', 'F#', 'G', 'G#', 'A'],
        2: ['B', 'C', 'C#', 'D', 'D#', 'E'],
        3: ['G', 'G#', 'A', 'A#', 'B', 'C'],
        4: ['D', 'D#', 'E', 'F', 'F#', 'G'],
        5: ['A', 'A#', 'B', 'C', 'C#', 'D'],
        6: ['E', 'F', 'F#', 'G', 'G#', 'A']
    }

    NOTES = {
        'C':  0,
        'C#': 0.5, 
        'D':  1,
        'D#': 1.5,
        'E':  2,
        'F':  2.5,
        'F#': 3,
        'G':  3.5,
        'G#': 4,
        'A':  4.5,
        'A#': 5,
        'B':  5.5
    }

    frets = {
        1: -1,
        2: -1,
        3: -1,
        4: -1,
        5: -1,
        6: -1
    }

    def read_frets(self):
        i = 1
        while i < 7:
            print('enter fret # for line ' + str(i) + ': ', flush=True, end='')
            fret_str = stdin.readline().strip()
            if fret_str == 'x':
                self.frets[i] = -1
                i += 1
            elif fret_str.isnumeric() and (int(fret_str) >= 0 and int(fret_str) <= 5):
                self.frets[i] = int(fret_str)
                i += 1
        #pprint(self.frets)

    def draw_frets(self):
        system('cls')
        for i in range(1, 7):
            if self.frets[i] == -1:
                out_str = 'x'
            else:
                out_str = str(self.frets[i])
            out_str += '╟'
            for f in range(1, 6):
                if self.frets[i] == f:
                    out_str += '─O─┼'
                else:
                    out_str += '───┼'
            if self.frets[i] == -1:
                pass
            else:
                out_str += self.FRETS[i][self.frets[i]]
            print(out_str)

    def build_chords(self):
        notes = {}
        for i in range(1, 7):
            if self.frets[i] == -1:
                notes[i] = -1
            else:
                notes[i] = self.STRINGS[i][self.frets[i]]
        ints = []
        for s in range(1, 7):
            if self.frets[s] == -1:
                continue
            for i in range(1, 7):
                if notes[i] == -1:
                    continue
                if notes[1] - notes[i] < 0:
                    ints.append(6 + notes[1] - notes[i])
                else:
                    ints.append(notes[1] - notes[i])
            intervals = set(sorted(ints))
            c_name = self.FRETS[self.frets[s]]
            for i in intervals:
                if i == 0.0:
                    continue
                if i == 0.5:
                    pass # /b9
                if i == 1:
                    pass # sus2 or /9 (if 1.5/2 exist)
                if i == 1.5:
                    pass # basic min
                if i == 2:
                    pass # basic maj
                if i == 2.5:
                    pass # sus4 or /11 (if 1.5/2 exist)
                if i == 3:
                    pass # dim (if min) else ?
                if i == 3.5:
                    pass # basic min/maj == ''
                if i == 4:
                    pass # aug
                if i == 4.5:
                    pass # 6
                if i == 5:
                    pass # 7
                if i == 5.5:
                    pass # maj7

        #print(set(intervals))



if __name__ == '__main__':
    tab = Tab()
    tab.read_frets()
    tab.draw_frets()
    tab.build_chords()
