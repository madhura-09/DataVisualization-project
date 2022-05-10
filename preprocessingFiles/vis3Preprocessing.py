import pandas as pd
from collections import OrderedDict
import datetime

class genderData():
    def __init__(self):
        self.gd = {}
        vals = ['MH', 'MD', 'FH', 'FD', 'TH', 'TD']
        for i in vals:
            self.gd[i] = 0

def main():
    # 'Aleppo','Colombia','Iran','Karachi','Lebanon','Nairobi','Saudiarabia','Thailand', 'Turkey' ,'Venezuela','Yemen'
    files = ['Aleppo', 'Colombia', 'Iran', 'Karachi', 'Lebanon', 'Nairobi', 'Saudiarabia', 'Thailand', 'Turkey' , 'Venezuela', 'Yemen']

    data = []

    for name in files:
        print(name)
        country_data = pd.read_csv(fr"preprocessed_data/{name}.csv")

        countryMap = buildMap(country_data)

        countryMap = OrderedDict(sorted(countryMap.items()))

        for eachDate in countryMap:
            curr = countryMap[eachDate]
            data.append([name, eachDate, curr.gd['MH'], curr.gd['MD'], curr.gd['FH'], curr.gd['FD'], curr.gd['TH'], curr.gd['TD']])

    h_df = pd.DataFrame(data, columns=['COUNTRY', 'DATE', 'MALE_HOSPITALIZED', 'MALE_DEAD', 'FEMALE_HOSPITALIZED', 'FEMALE_DEAD', 'TOTAL_HOSPITALIZED', 'TOTAL_DEAD'])

    h_df.to_csv('preprocessed_data/vis3PreprocessedData.csv', index=False)


def buildMap(country_data):
    map = {}

    for i in range(len(country_data)):
        h_date = str(country_data['DATE'][i])
        d_date = str(country_data['DEATH_DATE'][i])

        if datetime.datetime.strptime(h_date, '%m-%d-%Y') not in map:
            map[datetime.datetime.strptime(h_date, '%m-%d-%Y')] = genderData()
        if d_date != '0-0-0' and datetime.datetime.strptime(d_date, '%m-%d-%Y') not in map:
            map[datetime.datetime.strptime(d_date, '%m-%d-%Y')] = genderData()

        if country_data['GENDER'][i] == 'M':
            map[datetime.datetime.strptime(h_date, '%m-%d-%Y')].gd['MH'] += 1
            map[datetime.datetime.strptime(h_date, '%m-%d-%Y')].gd['TH'] += 1
            if d_date != '0-0-0':
                map[datetime.datetime.strptime(d_date, '%m-%d-%Y')].gd['MD'] += 1
                map[datetime.datetime.strptime(d_date, '%m-%d-%Y')].gd['TD'] += 1
        else:
            map[datetime.datetime.strptime(h_date, '%m-%d-%Y')].gd['FH'] += 1
            map[datetime.datetime.strptime(h_date, '%m-%d-%Y')].gd['TH'] += 1
            if d_date != '0-0-0':
                map[datetime.datetime.strptime(d_date, '%m-%d-%Y')].gd['FD'] += 1
                map[datetime.datetime.strptime(d_date, '%m-%d-%Y')].gd['TD'] += 1

    return map


if __name__ == "__main__":
    main()