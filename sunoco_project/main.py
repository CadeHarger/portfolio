import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import re


if __name__ == "__main__":
    # Read all sheets into a dictionary of DataFrames
    excel_file = './Sunoco/Sunoco Dataset_Spring2025 Semester.xlsx'
    all_dfs = pd.read_excel(excel_file, sheet_name=None, index_col=None)

    import cleaning
    combined_df, target_variable, original_weekly = cleaning.clean_data(all_dfs)

    import interaction_terms
    combined_df = interaction_terms.construct_interaction_terms(combined_df, target_variable)

    # Train a simple linear regression model
    def rmse(y_pred, y_test):    
        return np.sqrt(np.mean((y_pred - y_test) ** 2))

    # Split the data into different folds for time seriescross-validation
    # Then run the assumptions on each fold
    import data_splitting
    import assumptions
    import statsmodels.api as sm

    pre_fold_rmse_train = []
    pre_fold_rmse_test = []
    post_fold_rmse_train = []
    post_fold_rmse_test = []
    dataset = [] # Store the folds with modifications to meet assumptions in a final dataset
    for x_train, y_train, x_test, y_test in data_splitting.split_data(combined_df, target_variable, original_weekly):
        x_train = sm.add_constant(x_train, has_constant='add')
        x_test = sm.add_constant(x_test, has_constant='add')
        # Convert to numpy arrays for shape consistency
        y_train = y_train['target'].to_numpy()
        y_test = y_test['target'].to_numpy()
        model_plain_vanilla_after_diganosis = sm.OLS(y_train, x_train).fit()

        y_pred = model_plain_vanilla_after_diganosis.predict(x_train)
        pre_fold_rmse_train.append(rmse(y_pred, y_train))
        y_pred = model_plain_vanilla_after_diganosis.predict(x_test)
        pre_fold_rmse_test.append(rmse(y_pred, y_test))

        dataset.append(assumptions.run_assumptions(model_plain_vanilla_after_diganosis, x_train, y_train, x_test, y_test, vif_removal=False))

        # Run the model again with the remaining features
        model_plain_vanilla_after_diganosis = sm.OLS(y_train, x_train).fit()
        #print(model_plain_vanilla_after_diganosis.summary())

        y_pred = model_plain_vanilla_after_diganosis.predict(x_train)
        post_fold_rmse_train.append(rmse(y_pred, y_train))
        y_pred = model_plain_vanilla_after_diganosis.predict(x_test)
        post_fold_rmse_test.append(rmse(y_pred, y_test))

    print(f"Average RMSE (train): {np.mean(pre_fold_rmse_train)}")
    print(f"Average RMSE (test): {np.mean(pre_fold_rmse_test)}")
    print(f"Average RMSE (train): {np.mean(post_fold_rmse_train)}")
    print(f"Average RMSE (test): {np.mean(post_fold_rmse_test)}")

    import modeling
    modeling.run_models(dataset)


