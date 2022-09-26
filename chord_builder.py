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
        0:   'C',
        0.5: 'C#', 
        1:   'D',
        1.5: 'D#',
        2:   'E',
        2.5: 'F',
        3:   'F#',
        3.5: 'G',
        4:   'G#',
        4.5: 'A',
        5:   'A#',
        5.5: 'B'
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
        print('')
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

    def build_intervals(self):
        notes = []
        chords = []
        for i in range(1, 7):
            if self.frets[i] == -1:
                continue
            else:
                notes.append(self.STRINGS[i][self.frets[i]])
        #print('build_intervals(): notes ', notes)
        for j in notes:
            ints_tmp = []
            types = {}
            for i in notes:
                diff = i - j
                if diff < 0:
                    diff += 6
                #print('build_intervals(): current note:', self.NOTES[j], 'note:', self.NOTES[i], 'diff:', diff)
                if diff == 0:
                    continue
                ints_tmp.append(diff)
            intervals = set(sorted(ints_tmp))
            #print('build_intervals(): root', self.NOTES[j], intervals)
            chord_name = self.NOTES[j]
            types['V']   = self.type_V(intervals)
            types['III'] = self.type_III(intervals)
            chord_name += types['III']
            chord_name += types['V']
            chord_name += self.is_7(intervals, types)
            chord_name += self.is_9(intervals, types)
            chord_name += self.is_11(intervals, types)
            chord_name += self.is_6(intervals, types)
            chords.append(chord_name)
        return sorted(set(chords))

    def type_V(self, intervals):
        ''' возвращает тип по ступени V - доминантный, уменьшенный, увеличенный '''
        if 3.5 in intervals and (3.0 not in intervals or 4.0 not in intervals):
            intervals.remove(3.5)
            return ''
        if 3.0 in intervals and (3.5 not in intervals or 4.0 not in intervals):
            intervals.remove(3.0)
            return '/dim5'
        if 4.0 in intervals and (3.0 not in intervals or 3.5 not in intervals):
            intervals.remove(4.0)
            return '/aug5'
        return '(No5)'

    def type_III(self, intervals):
        ''' возвращает тип по ступени III - мажор, минор, sus2, sus4 '''
        if 1.5 in intervals: # and (1.0 not in intervals and 2.0 not in intervals and 2.5 not in intervals):
            intervals.remove(1.5)
            return 'm'
        if 2.0 in intervals: # and (1.0 not in intervals and 1.5 not in intervals and 2.5 not in intervals):
            intervals.remove(2.0)
            return ''
        if 1.0 in intervals: # and (1.5 not in intervals and 2.0 not in intervals and 2.5 not in intervals):
            intervals.remove(1.0)
            return 'sus2'
        if 2.5 in intervals: # and (1.0 not in intervals and 1.5 not in intervals and 2.0 not in intervals):
            intervals.remove(2.5)
            return 'sus4'
        return '(No3)'
            
    def is_9(self, intervals, types): 
        ''' только если есть III '''
        if types['III'] == '(No3)':
            return ''
        if 0.5 in intervals and 1.0 not in intervals:
            intervals.remove(0.5)
            return '/b9'
        if 1.0 in intervals and 0.5 not in intervals:
            intervals.remove(1.0)
            return '/9'
        return ''

    def is_11(self, intervals, types):
        ''' только если есть III '''
        if types['III'] == '(No3)':
            return ''
        if 2.5 in intervals:
            intervals.remove(2.5)
            return '/11'
        return ''

    def is_6(self, intervals, types):
        if 4.0 in intervals and 4.5 not in intervals and types['V'] != 'Aug5':
            intervals.remove(4.0)
            return '/b6'
        if 4.5 in intervals and 4.0 not in intervals:
            intervals.remove(4.5)
            return '/6'
        return ''

    def is_7(self, intervals, types):
        if 4.5 in intervals and (5.0 not in intervals and 5.5 not in intervals):
            intervals.remove(4.5)
            return '/b7'
        if 5.0 in intervals and (4.5 not in intervals and 5.5 not in intervals):
            intervals.remove(5.0)
            return '/7'
        if 5.5 in intervals and (4.5 not in intervals and 5.0 not in intervals):
            intervals.remove(5.5)
            return '/maj7'
        return ''



if __name__ == '__main__':
    tab = Tab()
    tab.read_frets()
    tab.draw_frets()
    print('\n', tab.build_intervals())
