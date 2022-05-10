import pandas as pd

class genderData():
    def __init__(self):
        self.gd = {}
        vals = ['MH', 'MD', 'FH', 'FD', 'TH', 'TD']
        for i in vals:
            self.gd[i] = [0, 0, 0]

symptoms = ['abdominal pain','abscess',	'injury', 'bleeding', 'body pain', 'breathing', 'chest', 'cough',	'cramp', 'deficit',	'diabetic',	'diarrhea', 'dizziness', 'fatigue',	'fever', 'headache', 'infections',	'laceration', 'migraine', 'pregnant', 'rash', 'urinate', 'vaginal',	'vision', 'vomiting', 'Heart Problems',	'Vocal Problems', 'others']

def main():
    # 'Aleppo','Colombia','Iran','Karachi','Lebanon','Nairobi','Saudiarabia','Thailand', 'Turkey' ,'Venezuela','Yemen'
    files = ['Aleppo','Colombia','Iran','Karachi','Lebanon','Nairobi','Saudiarabia','Thailand', 'Turkey' ,'Venezuela','Yemen']
    out = []
    for name in files:
        print(name)
        country_data = pd.read_csv(fr"preprocessed_data/{name}.csv")
        countryMap = buildMap(country_data)
        for sym in countryMap:
          for each in countryMap[sym].gd:
            out.append([name, sym, each[0], each[1], countryMap[sym].gd[each][0], countryMap[sym].gd[each][1], countryMap[sym].gd[each][2]])
    df = pd.DataFrame(out, columns = ['Country','Symptom','Gender','Condition','0-30','30-60','>60'])
    df.to_csv('preprocessed_data/vis2DataTest2.csv', index=False)

def buildMap(country_data):
    map = {}
    for symptom in symptoms:
        map[symptom] = genderData()

    for i in range(len(country_data)):
        gender = country_data['GENDER'][i]
        HorD = 'H'
        if str(country_data['DEATH'][i]) == '1':
            HorD = 'D'
        ageGroup = 0
        age = int(country_data['AGE'][i])
        if age>30 and age<=60:
          ageGroup = 1
        if age>60:
          ageGroup = 2
        for symptom in symptoms:
            if country_data[symptom][i] == 0:
                continue
            map[symptom].gd[gender+HorD][ageGroup] += 1
            map[symptom].gd['T'+HorD][ageGroup] += 1

    return map

if __name__ == "__main__":
    main()