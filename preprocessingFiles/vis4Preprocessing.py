import pandas as pd
from collections import OrderedDict
import datetime

symptoms = ['abdominal pain', 'abscess', 'injury', 'bleeding', 'body pain', 'breathing', 'chest', 'cough', 'cramp',
            'deficit', 'diabetic', 'diarrhea', 'dizziness', 'fatigue', 'fever', 'headache', 'infections', 'laceration',
            'migraine', 'pregnant', 'rash', 'urinate', 'vaginal', 'vision', 'vomiting', 'Heart Problems',
            'Vocal Problems', 'others']


class symData():
    def __init__(self):
        self.sd = {}
        for s in symptoms:
            self.sd[s] = [0, 0]


def main():
    # 'Aleppo','Colombia','Iran','Karachi','Lebanon','Nairobi','Saudiarabia','Thailand', 'Turkey' ,'Venezuela','Yemen'
    files = ['Aleppo','Colombia','Iran','Karachi','Lebanon','Nairobi','Saudiarabia','Thailand', 'Turkey' ,'Venezuela','Yemen']

    h_data = []
    d_data = []

    for name in files:
        print(name)
        country_data = pd.read_csv(fr"preprocessed_data/{name}.csv")

        countryMap = buildMap(country_data)

        countryMap = OrderedDict(sorted(countryMap.items()))

        for eachDate in countryMap:
            for eachSym in countryMap[eachDate].sd:
                h_data.append([name, eachDate, eachSym, countryMap[eachDate].sd[eachSym][0]])
                d_data.append([name, eachDate, eachSym, countryMap[eachDate].sd[eachSym][1]])

    h_df = pd.DataFrame(h_data, columns=['COUNTRY', 'DATE', 'SYMPTOM', 'HOSPITALIZED'])
    d_df = pd.DataFrame(d_data, columns=['COUNTRY', 'DATE', 'SYMPTOM', 'DEATHS'])

    h_df.to_csv('preprocessed_data/vis4Hospitalized.csv', index=False)
    d_df.to_csv('preprocessed_data/vis4Deaths.csv', index=False)


def buildMap(country_data):
    map = {}

    for i in range(len(country_data)):
        h_date = str(country_data['DATE'][i])
        d_date = str(country_data['DEATH_DATE'][i])

        if datetime.datetime.strptime(h_date, '%m-%d-%Y') not in map:
            map[datetime.datetime.strptime(h_date, '%m-%d-%Y')] = symData()
        if d_date != '0-0-0' and datetime.datetime.strptime(d_date, '%m-%d-%Y') not in map:
            map[datetime.datetime.strptime(d_date, '%m-%d-%Y')] = symData()

        for sym in symptoms:
            if int(country_data[sym][i]) == 1:
                map[datetime.datetime.strptime(h_date, '%m-%d-%Y')].sd[sym][0] += 1
                if d_date != '0-0-0':
                    map[datetime.datetime.strptime(d_date, '%m-%d-%Y')].sd[sym][1] += 1

    return map


if __name__ == "__main__":
    main()
