from _csv import writer
import datetime
import pandas as pd

class genderData():
    def __init__(self):
        self.gd = {}
        vals = ['MH', 'MD', 'FH', 'FD', 'TH', 'TD']
        for i in vals:
            self.gd[i] = 0

def main():
    vis3_data = pd.read_csv(r"preprocessed_data/vis3PreprocessedData.csv")

    map = {}

    for i in range(len(vis3_data)):
        date = vis3_data['DATE'][i]
        if date not in map:
            map[date] = genderData()

        # 'MALE_HOSPITALIZED', 'MALE_DEAD', 'FEMALE_HOSPITALIZED', 'FEMALE_DEAD', 'TOTAL_HOSPITALIZED', 'TOTAL_DEAD'

        map[date].gd['MH'] += vis3_data['MALE_HOSPITALIZED'][i]
        map[date].gd['FH'] += vis3_data['FEMALE_HOSPITALIZED'][i]
        map[date].gd['TH'] += vis3_data['TOTAL_HOSPITALIZED'][i]
        map[date].gd['MD'] += vis3_data['MALE_DEAD'][i]
        map[date].gd['FD'] += vis3_data['FEMALE_DEAD'][i]
        map[date].gd['TD'] += vis3_data['TOTAL_DEAD'][i]

    out = []
    print(map)
    for date in map:
        out.append(['All Countries', date, map[date].gd['MH'], map[date].gd['MD'], map[date].gd['FH'], map[date].gd['FD'], map[date].gd['TH'], map[date].gd['TD']])

    with open('preprocessed_data/vis3PreprocessedData.csv', 'a', newline='') as f_object:
        writer_object = writer(f_object)
        for each in out:
            writer_object.writerow(each)
        f_object.close()


if __name__ == "__main__":
    main()