import pandas as pd

def main():
    vis3Data = pd.read_csv(fr"preprocessed_data/vis3PreprocessedData.csv")
    MHM, FHM, THM, MDM, FDM, TDM = [], [], [], [], [], []
    count = 0
    country = 'Aleppo'
    MHMSum, FHMSum, THMSum, MDMSum, FDMSum, TDMSum = 0, 0, 0, 0, 0, 0
    for i in range(len(vis3Data)):
        if vis3Data['COUNTRY'][i] != country:
            count = 0
            country = vis3Data['COUNTRY'][i]
            MHMSum, FHMSum, THMSum, MDMSum, FDMSum, TDMSum = 0, 0, 0, 0, 0, 0

        MHMSum += vis3Data['MALE_HOSPITALIZED'][i]
        FHMSum += vis3Data['FEMALE_HOSPITALIZED'][i]
        THMSum += vis3Data['TOTAL_HOSPITALIZED'][i]
        MDMSum += vis3Data['MALE_DEAD'][i]
        FDMSum += vis3Data['FEMALE_DEAD'][i]
        TDMSum += vis3Data['TOTAL_DEAD'][i]

        count += 1

        if count>7:
            MHMSum -= vis3Data['MALE_HOSPITALIZED'][i-7]
            FHMSum -= vis3Data['FEMALE_HOSPITALIZED'][i-7]
            THMSum -= vis3Data['TOTAL_HOSPITALIZED'][i-7]
            MDMSum -= vis3Data['MALE_DEAD'][i-7]
            FDMSum -= vis3Data['FEMALE_DEAD'][i-7]
            TDMSum -= vis3Data['TOTAL_DEAD'][i-7]

        MHM.append(MHMSum // count if count < 8 else MHMSum // 7)
        FHM.append(FHMSum // count if count < 8 else FHMSum // 7)
        THM.append(THMSum // count if count < 8 else THMSum // 7)
        MDM.append(MDMSum // count if count < 8 else MDMSum // 7)
        FDM.append(FDMSum // count if count < 8 else FDMSum // 7)
        TDM.append(TDMSum // count if count < 8 else TDMSum // 7)

    vis3Data['MH_7Day_Mean'] = MHM
    vis3Data['MD_7Day_Mean'] = MDM
    vis3Data['FH_7Day_Mean'] = FHM
    vis3Data['FD_7Day_Mean'] = FDM
    vis3Data['TH_7Day_Mean'] = THM
    vis3Data['TD_7Day_Mean'] = TDM

    vis3Data.to_csv(f'preprocessed_data/vis3DataWithMean.csv', index=False)

if __name__ == "__main__":
    main()