import pandas as pd
from sklearn.model_selection import TimeSeriesSplit 

# All splitting functions return a generator of tuples (x_train, y_train, x_test, y_test)

def split_data(combined_df, target_variable, original_weekly):
    # Split the data into train and test sets
    cutoff_date = original_weekly.max() - pd.DateOffset(years=1)
    y_train = target_variable[original_weekly < cutoff_date]
    x_train = combined_df[original_weekly < cutoff_date].copy()

    y_test = target_variable[original_weekly >= cutoff_date]
    x_test = combined_df[original_weekly >= cutoff_date].copy()

    yield x_train, y_train, x_test, y_test


def split_data_ts(combined_df, target_variable, original_weekly, n_splits=5):
    tscv = TimeSeriesSplit(n_splits=n_splits)
    for train_index, test_index in tscv.split(combined_df):
        x_train, x_test = combined_df.iloc[train_index], combined_df.iloc[test_index]
        y_train, y_test = target_variable.iloc[train_index], target_variable.iloc[test_index]
        yield x_train, y_train, x_test, y_test
