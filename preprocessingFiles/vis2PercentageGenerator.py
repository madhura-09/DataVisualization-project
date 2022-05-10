import pandas as pd


def main():
    vis2_data = pd.read_csv(r"preprocessed_data/vis2DataTest2.csv")
    per1 = []
    per2 = []
    per3 = []
    for i in range(len(vis2_data)):
        first = int(vis2_data['0-30'][i])
        second = int(vis2_data['30-60'][i])
        third = int(vis2_data['>60'][i])
        total = first + second + third
        if total == 0:
            per1.append(0)
            per2.append(0)
            per3.append(0)
        else:
            per1.append(first*100/total)
            per2.append(second*100/total)
            per3.append(third*100/total)

    vis2_data['0-30-per'] = per1
    vis2_data['30-60-per'] = per2
    vis2_data['>60-per'] = per3

    vis2_data.to_csv('preprocessed_data/vis2Test2PercentagesData.csv',index = False)

if __name__ == "__main__":
    main()