import pandas as pd

symptoms = ['abdominal pain', 'abscess', 'injury', 'bleeding', 'body pain', 'breathing', 'chest', 'cough', 'cramp',
            'deficit', 'diabetic', 'diarrhea', 'dizziness', 'fatigue', 'fever', 'headache', 'infections', 'laceration',
            'migraine', 'pregnant', 'rash', 'urinate', 'vaginal', 'vision', 'vomiting', 'Heart Problems',
            'Vocal Problems', 'others']

class symData():
    def __init__(self):
        self.count = 0;
        self.sd = {}
        for s in symptoms:
            self.sd[s] = 0

def main():
    # 'Aleppo','Colombia','Iran','Karachi','Lebanon','Nairobi','Saudiarabia','Thailand', 'Turkey' ,'Venezuela','Yemen'
    files = ['Aleppo','Colombia','Iran','Karachi','Lebanon','Nairobi','Saudiarabia','Thailand', 'Turkey' ,'Venezuela','Yemen']

    map = {}

    for symptom in symptoms:
        map[symptom] = symData()

    for name in files:
        print(name)
        country_data = pd.read_csv(fr"preprocessed_data/{name}.csv")
        buildMap(country_data, map)

    res = []
    for symptom in symptoms:
        curr = map[symptom]
        temp = []
        temp.append(symptom)
        temp.append(curr.count)
        for sym in symptoms:
            temp.append(curr.sd[sym])
        res.append(temp)

    data_df = pd.DataFrame(res, columns=['SYMPTOM', 'DEATHS', 'abdominal pain', 'abscess', 'injury', 'bleeding', 'body pain', 'breathing', 'chest', 'cough', 'cramp',
            'deficit', 'diabetic', 'diarrhea', 'dizziness', 'fatigue', 'fever', 'headache', 'infections', 'laceration',
            'migraine', 'pregnant', 'rash', 'urinate', 'vaginal', 'vision', 'vomiting', 'Heart Problems',
            'Vocal Problems', 'others'])
    data_df.to_csv('preprocessed_data/vis5PreprocessedData.csv', index=False)

def buildMap(country_data, map):
    for i in range(len(country_data)):
        if int(country_data['DEATH'][i]) == 0:
            continue
        curr_syms = []
        for sym in symptoms:
            if int(country_data[sym][i]) == 1:
                curr_syms.append(sym)
        for j in range(0,len(curr_syms)):
            map[curr_syms[j]].count += 1
            for k in range(j+1, len(curr_syms)):
                map[curr_syms[j]].sd[curr_syms[k]] += 1
                map[curr_syms[k]].sd[curr_syms[j]] += 1


if __name__ == "__main__":
    main()