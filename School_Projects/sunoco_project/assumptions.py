import seaborn as sns
import matplotlib.pyplot as plt
import pandas as pd
from statsmodels.stats.outliers_influence import variance_inflation_factor


def run_assumptions(model, x_train, y_train, x_test, y_test, vif_removal=False):
    # Run Hypothesis Testing
    ## 1. There exists a linear relationship between the DV and the IVs:
    predicted = model.predict(x_train)
    errors = predicted - y_train

    sns.scatterplot(x = predicted, y = y_train)
    plt.xlabel("Predicted Demanded Energy")
    plt.ylabel("Actual Demanded Energy")
    plt.title("Predicted vs. Actual Demanded Energy")
    plt.axhline(y=6000, color='r', linestyle='--', label='Outlier Threshold')
    plt.legend()

    plt.show()
    # There is a linear relationship between the DV and the IVs. There are a few outliers, perhaps I should remove them.

    ## Assumption 2 - the error terms are normally distributed with a mean of 0
    sns.kdeplot(errors)
    plt.xlabel("Error")
    plt.show()
    # The error terms are normally distributed with a mean of 0.

    ### Assumption 3 - The variance of the error terms is not related to predicted outcomes (homoscedasticity)
    sns.scatterplot(x=predicted, y = errors)
    plt.xlabel("Predicted Demanded Energy")
    plt.ylabel("Residuals (Actual - Predicted)")
    plt.title("Predicted Demanded Energy vs. Residuals")
    plt.axvline(x=6600, color='r', linestyle='--', label='Outlier Threshold')
    plt.legend()

    plt.show()
    # The variance of the error terms is not related to predicted outcomes, besides the outliers.
    # Let's identify and remove the outliers.
    print(y_train[y_train < 6000])
    print(errors[y_train < 6000])

    outlier_mask_train = y_train >= 6000
    x_train = x_train[outlier_mask_train]
    y_train = y_train[outlier_mask_train]
    outlier_mask_test = y_test >= 6000
    x_test = x_test[outlier_mask_test]
    y_test = y_test[outlier_mask_test]

    ## Assumption 4 - No multicollinearity between the predictor variables. 

    vif = pd.DataFrame()
    vif['VIF'] = [variance_inflation_factor(x_train.values, i) for i in range(x_train.shape[1])]
    vif['variable'] = x_train.columns
    print(len(vif[vif.VIF > 10]), '/', len(vif), 'variables have a VIF greater than 10')
    vif[vif.VIF > 10].sort_values(by='VIF')

    if vif_removal:
        interactions = ['Mexico-Canada', 'PCE-CC', 'EV Sales-Charging']
        #interactions = []
        numerics = [] # [a for a, b in explored.items() if b]
        toCheck = [col for col in x_train.columns if col not in interactions and col not in numerics]

        while True:
            vif = pd.DataFrame()
            vif["VIF"] = [variance_inflation_factor(x_train[toCheck].values, i) for i in range(len(toCheck))]
            vif["variable"] = toCheck
            
            above = vif[vif["VIF"] > 10]
            if above.shape[0] <= len(interactions): # interactions are allowed to have high VIF
                break  
            
            drop = above.sort_values("VIF", ascending=False).iloc[0]["variable"]
            print(f"Removing {drop} of VIF {above.sort_values('VIF', ascending=False).iloc[0]['VIF']:.2f}")
            
            x_train = x_train.drop(columns=[drop])
            x_test = x_test.drop(columns=[drop])
            toCheck.remove(drop)  

        print(x_train.shape[1], 'features remaining')

        vif = pd.DataFrame()
        vif["VIF"] = [variance_inflation_factor(x_train[toCheck].values, i) for i in range(len(toCheck))]
        vif["variable"] = toCheck
        assert not sum(vif["VIF"] > 10) > len(interactions) # interactions are allowed to have high VIF

    return x_train, y_train, x_test, y_test
