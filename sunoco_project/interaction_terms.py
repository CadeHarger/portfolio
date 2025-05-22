import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt


def construct_interaction_terms(combined_df, target_variable):
    # Construct interaction terms

    # All variables are numeric
    # 1. It makes sense that sales will only matter if there are charging stations and vice versa.
    bins = [0, 0.25, 0.75, 1]
    labels = ['Low', 'Medium', 'High']
    combined_df['EV Sales_group'] = pd.cut(
        combined_df['EV Sales_value'],
        bins=bins,
        labels=labels
    )

    # Create a temporary DataFrame for plotting
    plot_df = pd.DataFrame({
        'EV_Charging': combined_df['EV Charging Infastructure_EV Charging Ports'],
        'target': target_variable['target'],
        'EV_Sales_group': combined_df['EV Sales_group']
    })
    sns.lmplot(x='EV_Charging', y='target', hue='EV_Sales_group', data=plot_df)
    plt.title("Interaction Plot: EV Charging Infastructure_EV Charging Ports vs target, grouped by EV Sales_value")
    plt.show()
    combined_df = combined_df.drop(columns=['EV Sales_group'])

    # Clearly there are some interaction effects with these buckets.
    combined_df['EV Sales-Charging'] = combined_df['EV Sales_value'] * combined_df['EV Charging Infastructure_EV Charging Ports']

    # 2. If consumer confidence is low, it might not matter as much if PCE is still high.
    combined_df['PCE_group'] = pd.qcut(
        combined_df['Personal Consumption Expenditur_PCE'],
        q=3,
        labels=['Low', 'Medium', 'High']
    )
    plot_df = pd.DataFrame({
        'Consumer_Confidence': combined_df['Consumer Confidence_OBS_VALUE'],
        'target': target_variable['target'],
        'PCE_group': combined_df['PCE_group']
    })
    sns.lmplot(x='Consumer_Confidence', y='target', hue='PCE_group', data=plot_df)
    plt.title("Interaction Plot: Consumer Confidence vs target, grouped by Personal Consumption Expenditure")
    plt.show()
    combined_df = combined_df.drop(columns=['PCE_group'])

    # Clearly there are some interaction effects with these buckets.
    combined_df['PCE-CC'] = combined_df['Personal Consumption Expenditur_PCE'] * combined_df['Consumer Confidence_OBS_VALUE']

    # 3. High or low importing from one country might effect the other
    combined_df['Mexico Oil Imports_Mexico Imports_group'] = pd.qcut(
        combined_df['Mexico Oil Imports_Mexico Imports'],
        q=3,
        labels=['Low', 'Medium', 'High']
    )
    plot_df = pd.DataFrame({
        'Canadian_Imports': combined_df['Canadian Oil Imports_Canada Imports'],
        'target': target_variable['target'],
        'Mexico_Imports_group': combined_df['Mexico Oil Imports_Mexico Imports_group']
    })
    sns.lmplot(x='Canadian_Imports', y='target', hue='Mexico_Imports_group', data=plot_df)
    plt.title("Interaction Plot: Canadian Oil Imports vs target, grouped by Mexico Oil Imports")
    plt.show()
    combined_df = combined_df.drop(columns=['Mexico Oil Imports_Mexico Imports_group'])

    # Clearly there are some interaction effects with these buckets, especially when mexico imports are high.
    combined_df['Mexico-Canada'] = combined_df['Mexico Oil Imports_Mexico Imports'] * combined_df['Canadian Oil Imports_Canada Imports']

    # 4. If there is high household debt, consumers might turn down their AC and spend less on electricity prices.
    # If these changes are reflected in electricity prices, the debt might be 'unhealthy' indicating reduced demand in other areas as well.
    # If the changes are not reflected in electricity prices, the debt might be 'healthy' indicating it might have a lesser effect on demand.
    combined_df['Average US Kilowatt-Hour Price_Kwh_group'] = pd.qcut(
        combined_df['Average US Kilowatt-Hour Price_Kwh'],
        q=3,
        labels=['Low', 'Medium', 'High']
    )
    plot_df = pd.DataFrame({
        'Household Debt and Credit_Total': combined_df['Household Debt and Credit_Total'],
        'target': target_variable['target'],
        'Average US Kilowatt-Hour Price_Kwh_group': combined_df['Average US Kilowatt-Hour Price_Kwh_group']
    })
    sns.lmplot(x='Household Debt and Credit_Total', y='target', hue='Average US Kilowatt-Hour Price_Kwh_group', data=plot_df)
    plt.title("Interaction Plot: Household Debt and Credit vs target, grouped by Average US Kilowatt-Hour Price")
    plt.show()
    combined_df = combined_df.drop(columns=['Average US Kilowatt-Hour Price_Kwh_group'])

    # Clearly there are some interaction effects with these buckets, especially when mexico imports are high.
    combined_df['Kwh-Debt'] = combined_df['Average US Kilowatt-Hour Price_Kwh'] * combined_df['Household Debt and Credit_Total']

    return combined_df