from _csv import writer

import pandas as pd

class genderData():
    def __init__(self):
        self.gd = {}
        vals = ['MH', 'MD', 'FH', 'FD', 'TH', 'TD']
        for i in vals:
            self.gd[i] = [0, 0, 0]

symptoms = ['abdominal pain','abscess',	'injury', 'bleeding', 'body pain', 'breathing', 'chest', 'cough',	'cramp', 'deficit',	'diabetic',	'diarrhea', 'dizziness', 'fatigue',	'fever', 'headache', 'infections',	'laceration', 'migraine', 'pregnant', 'rash', 'urinate', 'vaginal',	'vision', 'vomiting', 'Heart Problems',	'Vocal Problems', 'others']

def main():
    vis2_data = pd.read_csv(r"preprocessed_data/vis2DataTest2.csv")

    map = {}
    for symptom in symptoms:
        map[symptom] = genderData()

    for i in range(len(vis2_data)):
        category = vis2_data['Gender'][i]+vis2_data['Condition'][i]
        map[vis2_data['Symptom'][i]].gd[category][0] += vis2_data['0-30'][i]
        map[vis2_data['Symptom'][i]].gd[category][1] += vis2_data['30-60'][i]
        map[vis2_data['Symptom'][i]].gd[category][2] += vis2_data['>60'][i]

    out = []

    for sym in map:
        for each in map[sym].gd:
            out.append(['All countries', sym, each[0], each[1], map[sym].gd[each][0], map[sym].gd[each][1],
                        map[sym].gd[each][2]])

    with open('preprocessed_data/vis2DataTest2.csv', 'a', newline='') as f_object:
        writer_object = writer(f_object)
        for each in out:
            writer_object.writerow(each)
        f_object.close()


if __name__ == "__main__":
    main()