import pandas as pd
import re


# all_dfs is a dictionary of DataFrames, one for each sheet in the Excel file.
def clean_data(all_dfs):

    # For sheets with multiple variables, specify which to use.
    vars_to_use = {
        'EV Charging Infastructure': ['EV Charging Ports', 'Station Locations'], 
        'Freight Expenditures': ['Index Value'], 
        'VIX (Stock Volatility) Index': ['OPEN'], 
        'Work From Home Percentages': ['Observation'], 
        'U.S. Dollar Index': ['Open'], 
        'Refiniery Utilization': ['U. S. Operating Crude Oil Distillation Capacity  (Thousand Barrels per Day)', 'U.S. Percent Utilization of Refinery Operable Capacity'], 
        'Labor Costs': ['Private industry', 'Government'], 
        'Household Debt and Credit': ['Total'], # More?
        'EV Regulations': ['State', 'Alternative Fuel Provider'], 
        'EV Sales': ['value'], 
        'Public Transport Ridership': ['Total Ridership (000s)'], # More?
        'Ridership By Quarter': ['Total Ridership (000s)'], # More?
    }

    # Define function to read in various date formats and convert to datetime
    def convert_datetime(df):
        regex_to_format = {
            r'^\d{4}-\d{2}-\d{2}$': '%Y-%m-%d', # e.g., '2025-04-14'
            r'^\d{2}/\d{2}/\d{4}$': '%m/%d/%Y', # e.g., '04/14/2025'
            r'^\d{2}-\d{2}-\d{4}$': '%m-%d-%Y', # e.g., '04-14-2025'
            r'^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$': '%Y-%m-%d %H:%M:%S', # e.g., 1990-11-09 00:00:00
            r'^\d{4}$': '%Y', # e.g., '2025'
            r'^\d{4}-\d{2}$': '%Y-%m', # e.g., '1960-01'
            r'^[A-Za-z]{3}-\d{4}$': '%b-%Y', # e.g., 'Oct-2022'
            r'^[A-Za-z]{3} \d{4}$': '%b %Y', # e.g., 'Mar 2014'
            r'^\d{6}$': '%Y%m', # e.g., '201306'
            r'^[A-Za-z]{3}\s+\d{1,2}\s+\d{4}$': '%b %d %Y', # e.g., 'Jul 1 2024'
            r'^\d{2}:\d{2}$': '%y:%m', # e.g., '03:01' as in Jan 2003 (was quarterly)
            r'^\d{4} - \d{2}$': '%Y - %m', # e.g., '1990 - 01'
        }

        datecol = df.columns[0]
        sample_date = df[datecol].iloc[0]

        # Fix quarterly data so it matches regex
        if any(['Q1' in str(sample_date), 'Q2' in str(sample_date), 'Q3' in str(sample_date), 'Q4' in str(sample_date)]):
            df[datecol] = df[datecol].apply(lambda x: x.replace('Q1', '01').replace('Q2', '04').replace('Q3', '07').replace('Q4', '10'))
            sample_date = df[datecol].iloc[0]
        # Convert to datetime
        for regex, format in regex_to_format.items():
            if re.match(regex, str(sample_date).strip()):
                df[datecol] = df[datecol].apply(lambda x: pd.to_datetime(x, format=format))
                return df.sort_values(by=datecol)
        
        raise ValueError(f"Could not convert {datecol} to datetime with format {df[datecol].iloc[0]}")
            

    # Get needed dfs that are not independent variables
    cleaning_strategies = all_dfs['Cleaning Strategy'].copy().set_index('Variable')
    target_variable = convert_datetime(all_dfs['Target Variable EIA Implied Dem'].copy().dropna().reset_index(drop=True))
    original_weekly = target_variable[target_variable.columns[0]].copy()
    target_variable = target_variable.drop(columns=[target_variable.columns[0]])
    target_variable = target_variable.rename(columns={target_variable.columns[0]: 'target'})

    # Delete the sheets that are not needed
    del all_dfs['Links'], all_dfs['Variable Descriptions'], all_dfs['Hypotheses'], all_dfs['Cleaning Strategy'], all_dfs['Target Variable EIA Implied Dem']


    # Training data needs dates to be aligned with target variable (weekly)
    # Linearly impute missing values. 
    def align_and_impute(original_weekly, df, method):
        df_date_col = df.columns[0]
        
        # Get every date within the span of those weekly dates
        daily_index = pd.date_range(start=original_weekly.min(),
                                end=original_weekly.max(),
                                freq='D')
        
        # Set the index to the date column and handle duplicates by taking the mean
        df_indexed = df.set_index(pd.to_datetime(df[df_date_col])).drop(columns=df_date_col).groupby(level=0).mean()
        
        # Reindex variable to daily, interpolate missing values
        daily_df = df_indexed.reindex(daily_index)
        if method == 'Forward Fill':
            daily_df = daily_df.ffill().bfill()
        elif method == 'Linear Impute':
            daily_df = daily_df.interpolate(method='linear')
            # then fill uninterpolateable values (leading or trailing nas) with the closest non-missing value
            daily_df = daily_df.ffill().bfill()
        else:
            raise ValueError(f"Invalid method: {method}")

        # Reindex the daily_series back to the original weekly dates to preserve format
        return daily_df.reindex(original_weekly).reset_index()


    # Loop through each sheet and apply the relevant transformations:
    combined_df = pd.DataFrame()
    for sheet_name, df in all_dfs.items():
        print(sheet_name)
        cleaning_strategy = cleaning_strategies.loc[sheet_name][['Time Scale', 'Missing Values', 'Normalization', 'Outliers']]

        # Special case for EV Sales
        if sheet_name == 'EV Sales':
            df = df[
                (df['unit'] == 'Vehicles') & 
                (df['region'] == 'USA') & 
                (df['parameter'] == 'EV sales') & 
                (df['powertrain'] == 'BEV')
            ]

        # Drop columns that are not needed.
        if sheet_name in vars_to_use:
            df = df.drop(columns=[col for col in df.columns[1:] if col not in vars_to_use[sheet_name]])

        # Convert the date column to datetime.
        df = convert_datetime(df)

        # Convert all non-date columns (all but the the first) to numeric by stripping whitespace.
        for col in df.columns[1:]:  # Skip the first (date) column
            df[col] = df[col].astype(str).str.strip().replace('[$,]', '', regex=True).astype(float)

        # Convert all dates to daily within the span of the target variable
        df = align_and_impute(original_weekly, df, cleaning_strategy['Missing Values'])
        
        # Clip outliers
        if cleaning_strategy['Outliers'] == 'Clipping':
            for col in df.columns[1:]: # Clip to the training set's min/max
                df[col] = df[col].clip(upper=df[col].quantile(0.997))
                
        if cleaning_strategy['Normalization'] == 'Minmax Scaling':
            for col in df.columns[1:]: # Normalize both to the training set's min/max
                df[col] = (df[col] - df[col].min()) / (df[col].max() - df[col].min()) 
        elif cleaning_strategy['Normalization'] == '1-Year Moving Avg Proportion':
            # Rolling mean over 52 weeks. Fill leading and trailing missing values with the closest non-missing value.
            for col in df.columns[1:]:
                df[col] = df[col] / df[col].rolling(window=52).mean().ffill().bfill()

        #plt.plot(df.index, df[df.columns[-1]], label=sheet_name)
        #plt.legend()
        #plt.show()

        # now append each sheet's features to the master x_train/x_test
        for col in df.columns[1:]:
            if df[col].isna().any():
                print(f"{sheet_name} has NaN values in {col}")  
            
            combined_df[f'{sheet_name}_{col}'] = df[col].reset_index(drop=True)
    print("data cleaned!")

    return combined_df, target_variable, original_weekly
