import pandas as pd
import numpy as np
from datetime import date


def main():
    # 'Aleppo','Colombia','Iran','Karachi','Lebanon','Nairobi','Saudiarabia','Thailand', 'Turkey' ,'Venezuela','Yemen'
    files = ['Karachi']
     

    for name in files:
        hospital_data = pd.read_csv(fr"dataset/{name}.csv")
        death_data = pd.read_csv(fr"dataset/{name}-deaths.csv")
        
        preprocessing(hospital_data,death_data,name)
    
def generateCorrectSpellings(sentence):
    sentence = sentence.replace(',',' ').replace('.',' ').replace('"',' ').lower()
    splitWords = sentence.split()
    res = set()
    for word in splitWords:
        if word in spellings and spellings[word] in groups:
            res.add(groups[spellings[word]])
        else:
            res.add('others')
    if 'others' in res and len(res)>1:
        res.remove('others')
    return res
    
    
    
def preprocessing(hospital_data,death_data,name):
    death_map = {}
    for i in groups.values():
        hospital_data[i] = [0]*len(hospital_data)
        
    for i in range(len(death_data)):
        death_map[death_data['ID'][i]] = death_data['DATE_OF_DEATH'][i]
        
    hospital_death = []
    death = []
    days_alive = []
    for i in range(len(hospital_data)):
        correct_groups = generateCorrectSpellings(hospital_data['SYNDROME'][i])
        for group in correct_groups:
            hospital_data[group][i] = 1
        if hospital_data['PATIENT_ID'][i] in death_map:
            hospital_death.append(death_map[hospital_data['PATIENT_ID'][i]])
            death.append(1)
            start_date = hospital_data['DATE'][i].split('-')
            #print(start_date)
            end_date = death_map[hospital_data['PATIENT_ID'][i]].split('-')
            #print(end_date)
            start_d = date(int(start_date[2]), int(start_date[0]), int(start_date[1]))
            end_d = date(int(end_date[2]), int(end_date[0]), int(end_date[1]))
            days_alive.append(str((end_d - start_d).days))
            #hospital_data['SYNDROME'][i]
            #correct_groups= generateCorrectSpellings(hospital_data['SYNDROME'][i])
            #for group in correct_groups:
            #    hospital_data[group][i] = 1
                
        else:
            hospital_death.append("0-0-0")
            death.append(0)
            days_alive.append(0)
    
    hospital_data['DEATH_DATE'] = hospital_death
    hospital_data['DEATH'] = death
    hospital_data['DAYS_ALIVE'] = days_alive
    hospital_data['COUNTRY']=[f"{name}"]*len(hospital_data)
    hospital_data.to_csv(f'preprocessed_data/{name}.csv',index = False)
    #print(hospital_death)
        
groups = {
    "ab":"abdominal pain","abdmnal":"abdominal pain","abdomen":"abdominal pain","adb":"abdominal pain","adbback":"abdominal pain","addominal":"abdominal pain","abdominal":"abdominal pain","genital":"abdominal pain",
    "abscess":"abscess","abcess":"abscess",
    "accident":"injury","assault":"injury","bite":"injury","assaulted":"injury","inj":"injury","injury":"injury",
    "bleeding":"bleeding","bled":"bleeding","bleed":"bleeding","bleeds":"bleeding","blood":"bleeding","epistaxis":"bleeding","nosebleed":"bleeding",
    "ear":"body pain","ache":"body pain","ankle":"body pain","hurts":"body pain","leg":"body pain","neck":"body pain","pain":"body pain","pn":"body pain","stomach":"body pain",
    "asthama":"breathing","breath":"breathing","breathing":"breathing","respira":"breathing","resp":"breathing","wheezing":"breathing",
    "chest":"chest",
    "cold":"cough","cough":"cough","sinus":"cough","sinu":"cough","nose":"cough","sore":"cough",
    "cramp":"cramp","cramping":"cramp",
    "defecit":"deficit",
    "diabetic":"diabetic","diab":"diabetic",
    "diarrhea":"diarrhea","diarr":"diarrhea","stool":"diarrhea","gastro":"diarrhea",
    "dizziness":"dizziness","dizzy":"dizziness","dizz":"dizziness","vertigo":"dizziness","giddiness":"dizziness",
    "fatigue":"fatigue","weak":"fatigue","letharg":"fatigue","seizure":"fatigue","lighthead":"fatigue",
    "fever":"fever","temp":"fever","ill":"fever","febril":"fever",
    "headache":"headache","headaches":"headache","head":"headache",
    "infections":"infections","allergy":"infections","allerg":"infections",
    "laceration":"laceration","lac":"laceration",
    "migraine":"migraine","migrane":"migraine","migrain":"migraine",
    "contraction":"pregnant","csection":"pregnant","preg":"pregnant","labor":"pregnant","miscarria":"pregnant","pregnancy":"pregnant","pregnant":"pregnant","spotting":"pregnant",
    "itch":"rash","rash":"rash","skin":"rash","eczema":"rash","hives":"rash",
    "urinate":"urinate","urin":"urinate","urinates":"urinate","urinating":"urinate","urine":"urinate",
    "vag":"vaginal","vaginal":"vaginal",
    "blur":"vision","obscur":"vision","blurred":"vision","blurried":"vision","blurry":"vision","eye":"vision","visio":"vision","vision":"vision","visual":"vision",
    "vom":"vomiting","vomiting":"vomiting","nausea":"vomiting","vomit":"vomiting",
    "heart":"Heart Problems",
    "speech":"Vocal Problems",
    "others":"others"
}

spellings ={
    "ache":"ache",
    "abcess":"abscess",
    "abd":"abdomen","abdomen":"abdomen","abdominal":"abdomen","abdmnal":"abdomen","abdback":"abdomen",
    "ankle":"ankle",
    "assaulted":"assault","assult":"assault",
    "bleeds":"bleeding","blood":"bleeding","bleed":"bleeding",
    "blurry":"blurred","blurried":"blurred",
    "cough":"cough",
    "cardiac":"heart","card":"heart","heart":"heart",
    "cardio":"card",
    "defecit":"deficit",
    "difficulties":"difficulty","diff":"difficulty",
    "disturbance":"disturb","disturbancies":"disturb",
    "dizzy":"dizzy","dizziness":"dizzy","giddiness":"dizzy",
    "elev":"elevated",
    "eval":"evaluation",
    "facial":"face",
    "fever":"fever",
    "gen":"general","generalized":"general",
    "handwrist":"handwrist",
    "headache":"headache","headaches":"headache",
    "inj":"injury",
    "lac":"laceration",
    "l":"left","lt":"left",
    "med":"medical",
    "migrane":"migraine","migrain":"migraine",
    "neckback":"neck","neck":"neck","nec":"neck",
    "nos":"nose",
    "pain":"pain",
    "poss":"possible",
    "pregnant":"preg","pregnancy":"preg",
    "r":"right","rt":"right",
    "respiratory":"resp",
    "speach":"speech",
    "urinary":"urinate","urinates":"urinate","urination":"urinate","urinating":"urinate",
    "vag":"vaginal",
    "visual":"vision",
    "vomit":"vomiting","vomting":"vomiting","vomitting":"vomiting","vomiting":"vomiting",
    "winjury":"winjury",
    "sinusitis":"sinus",
    "head":"ache",
    "injury":"inj",
    "ears":"ear","ear":"ear"
}

if __name__ == "__main__":
    main()