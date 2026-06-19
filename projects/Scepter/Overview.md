
This application is the much-extended version of the core from my Kalshi bot. It can basically completely automate all non-time-series forecasting and data collection tasks. Data collection still can break a lot though. 

I was able to upload two of my former final projects from my Data Science minor - One predicting housing prices, another predicting Trinity University student admission decisions. For both datasets, my software did the entire final project in < 1 minute of manual work. It parsed the datasets, cleaned them, trained several different models, and selected the best one. It runs modeling assumptions and monitors for overfitting and potentially redundant variables and warns the user. 

See features.yaml for the full list of capabilities.

## files:
features.yaml - An overview of all the different features this application has

training_pipeline.png - A diagram of how training works for natural language text columns

admissions_dataset.png - An image of a dataset loaded into the application

column_definition.png - the input form for defining new columns with natural language

model_training.png - the input form for training models from datasets

strategize.png - the input form for having an AI define multiple columns as input data for your dataset
