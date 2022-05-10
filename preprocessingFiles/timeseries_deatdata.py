import pandas as pd
from collections import defaultdict
from datetime import datetime
from functools import cmp_to_key

allCountryCounter = {}

def main():
    files = ['Aleppo','Colombia','Iran','Karachi','Lebanon','Nairobi','Saudiarabia','Thailand','Turkey','Venezuela','Yemen']
    out = []
    for name in files:
        country_data = pd.read_csv(fr"preprocessed_data/{name}.csv")
        data = death_counter(country_data,name)
        out.append(pd.DataFrame(data, columns = ['Country','Date','Female_Deaths','Male_Deaths','Total_Deaths']))
    
    out_allCountries = []
    for key in allCountryCounter:
        if key != '0-0-0':
            total = allCountryCounter[key][0] + allCountryCounter[key][1]
            out_allCountries.append(['allCountries',key,allCountryCounter[key][0],allCountryCounter[key][1],total])
            out_allCountries.sort(key = lambda x: datetime.strptime(x[1],"%m-%d-%Y"))
    out.append(pd.DataFrame(out_allCountries, columns = ['Country','Date','Female_Deaths','Male_Deaths','Total_Deaths']))
    
    df = pd.concat(out)
    
    print(df)
        
    df.to_csv(r'preprocessed_data/Death_Counter.csv',index=False) 



def death_counter(data,name):
    death_counter = {}
    for row in range(len(data)):
        if data['DEATH_DATE'][row] not in death_counter:
            death_counter[data['DEATH_DATE'][row]] = [0,0]
        if data['DEATH_DATE'][row] not in allCountryCounter:
            allCountryCounter[data['DEATH_DATE'][row]] = [0,0]
        if data['GENDER'][row] == 'M':
            death_counter[data['DEATH_DATE'][row]][1] += 1
            allCountryCounter[data['DEATH_DATE'][row]][1] += 1
        else:
            death_counter[data['DEATH_DATE'][row]][0] += 1
            allCountryCounter[data['DEATH_DATE'][row]][0] += 1
    
    out = []
    for key in death_counter:
        if key != '0-0-0':
            total = death_counter[key][0] + death_counter[key][1]
            out.append([name,key,death_counter[key][0],death_counter[key][1],total])
            out.sort(key = lambda x: datetime.strptime(x[1],"%m-%d-%Y"))
    return out



if __name__ == "__main__":
    main()
