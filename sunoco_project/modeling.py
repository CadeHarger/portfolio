import numpy as np
import statsmodels.api as sm
import pandas as pd


def rmse(y_pred, y_test):    
    return np.sqrt(np.mean((y_pred - y_test) ** 2))


# Forward selection
def fb_selection(x_train, y_train, x_test, y_test, max_features, backward=False):
    best_subsets = {}
    
    if not backward:
        # Forward selection
        selected_features = []
        remaining_features = list(x_train.columns)
        
        for num_features in range(1, max_features + 1):
            best_score = -np.inf
            best_feature = None
            
            for feature in remaining_features:
                trial_features = selected_features + [feature]
                X_subset = sm.add_constant(x_train[trial_features])
                model = sm.OLS(y_train, X_subset).fit()
                adj_r2 = model.rsquared_adj
                
                if adj_r2 > best_score:
                    best_score = adj_r2
                    best_feature = feature
                    best_model = model
            
            if best_feature:
                selected_features.append(best_feature)
                remaining_features.remove(best_feature)
                best_subsets[num_features] = {
                    'features': list(selected_features),
                    'adj_r2': best_score,
                    'model': best_model
                }
    else:
        # Backward selection
        selected_features = list(x_train.columns)
        total_features = len(selected_features)
        
        # Start with all features
        X_all = sm.add_constant(x_train[selected_features])
        model_all = sm.OLS(y_train, X_all).fit()
        best_subsets[total_features] = {
            'features': list(selected_features),
            'adj_r2': model_all.rsquared_adj,
            'model': model_all
        }
        
        # Iteratively remove features until we reach max_features
        for num_features in range(total_features-1, max_features-1, -1):
            best_score = -np.inf
            worst_feature = None
            
            for feature in selected_features:
                trial_features = [f for f in selected_features if f != feature]
                X_subset = sm.add_constant(x_train[trial_features])
                model = sm.OLS(y_train, X_subset).fit()
                adj_r2 = model.rsquared_adj
                
                if adj_r2 > best_score:
                    best_score = adj_r2
                    worst_feature = feature
                    best_model = model
            
            if worst_feature:
                selected_features.remove(worst_feature)
                best_subsets[num_features] = {
                    'features': list(selected_features),
                    'adj_r2': best_score,
                    'model': best_model
                }
    
    best_models = best_subsets
    predictor_dict = {f"{k}_predictor": v['features'] for k, v in best_models.items()}

    Best_n_predictor = predictor_dict[f'{max_features}_predictor']
    x_train_subset = sm.add_constant(
        x_train[Best_n_predictor],
        has_constant='add'   # Final shape will have max_features + 1 columns due to the constant
    )

    model_selected = sm.OLS(y_train, x_train_subset).fit()
    RMSE_Train = rmse(y_train, model_selected.predict(x_train_subset))
    print(f"Training RMSE ({'Backward' if backward else 'Forward'} "
        f"Selection {max_features} predictors by adjusted R2): {RMSE_Train}")

    x_test_subset = sm.add_constant(
        x_test[Best_n_predictor],
        has_constant='add'
    ).reindex(columns=x_train_subset.columns)

    # 4) Predict and report
    y_pred = model_selected.predict(x_test_subset)
    RMSE_Test = rmse(y_pred, y_test)
    print(f"Test RMSE ({'Backward' if backward else 'Forward'} "
        f"Selection {max_features} predictors by adjusted R2): "
        f"{RMSE_Test}")

    return model_selected, RMSE_Train, RMSE_Test


# Run all the models, storing the results in a dictionary.
# At the end, compute the average of the results and rank the models.
def run_models(dataset):
    losses = {}
    for fold, (x_train, y_train, x_test, y_test) in enumerate(dataset):

        # Run forward selection
        best_model_10, losses[f'Train_forward-10_{fold}'], losses[f'Test_forward-10_{fold}'] = fb_selection(x_train, y_train, x_test, y_test, max_features=10)
        try: # Sometimes VIF removal leaves less than 30 features
            best_model_20, losses[f'Train_forward-20_{fold}'], losses[f'Test_forward-20_{fold}'] = fb_selection(x_train, y_train, x_test, y_test, max_features=20)
            best_model_30, losses[f'Train_forward-30_{fold}'], losses[f'Test_forward-30_{fold}'] = fb_selection(x_train, y_train, x_test, y_test, max_features=30)
        except:
            print(f"Forward selection failed for {fold}")

        best_model_10_backward, losses[f'Train_backward-10_{fold}'], losses[f'Test_backward-10_{fold}'] = fb_selection(x_train, y_train, x_test, y_test, max_features=10, backward=True)
        try:
            best_model_20_backward, losses[f'Train_backward-20_{fold}'], losses[f'Test_backward-20_{fold}'] = fb_selection(x_train, y_train, x_test, y_test, max_features=20, backward=True)
            best_model_30_backward, losses[f'Train_backward-30_{fold}'], losses[f'Test_backward-30_{fold}'] = fb_selection(x_train, y_train, x_test, y_test, max_features=30, backward=True)
        except:
            print(f"Backward selection failed for {fold}")

        # Ridge Regression
        from sklearn.linear_model import Ridge
        from sklearn.model_selection import KFold
        from sklearn.model_selection import GridSearchCV 

        # Stop non-convergence warnings
        import warnings
        from sklearn.exceptions import ConvergenceWarning
        warnings.filterwarnings('ignore', category=ConvergenceWarning)

        model_ridge = Ridge() 
        kf_ridge = KFold(n_splits = 10, shuffle = True, random_state = 42) 

        # Generate 100 alphas spaced evenly on a logarithmic scale between 10**(-8) and 10**(8).
        grid_ridge = {'alpha' : np.logspace(start = -8, stop = 8, num =100 , base = 10)} 

        # Execute k-fold cross-validation
        cv_ridge = GridSearchCV(estimator = model_ridge,
                                param_grid = grid_ridge, 
                                scoring = 'neg_mean_squared_error',
                                cv = kf_ridge) 

        cv_ridge.fit(x_train, y_train)
        print(cv_ridge.best_params_, cv_ridge.best_score_)


        model_ridge_best = Ridge(alpha = cv_ridge.best_params_['alpha']).fit(x_train, y_train)

        # Print feature coefficients since it is our best model
        feature_importance = pd.DataFrame({
            'Feature': x_train.columns,
            'Coefficient': model_ridge_best.coef_
        })
        print("\nRidge Regression Feature Coefficients:")
        print(feature_importance.sort_values('Coefficient', key=abs, ascending=False))

        losses[f'Train_ridge_{fold}'] = rmse(y_train, model_ridge_best.predict(x_train)) 
        print(f"Train_ridge_{fold}: {losses[f'Train_ridge_{fold}']}")
        losses[f'Test_ridge_{fold}'] = rmse(y_test, model_ridge_best.predict(x_test)) 
        print(f"Test_ridge_{fold}: {losses[f'Test_ridge_{fold}']}")


        # Lasso Regression
        from sklearn.linear_model import Lasso

        model_Lasso = Lasso() 
        kf_Lasso = KFold(n_splits = 10, shuffle = True, random_state = 42)

        # # Generate 100 alphas spaced evenly on a logarithmic scale between  10**(-8) and 10**(8).
        grid_Lasso = {'alpha' : np.logspace(start = -8, stop = 8, num = 100, base = 10)}

        cv_Lasso = GridSearchCV(estimator = model_Lasso,
                                param_grid = grid_Lasso, 
                                scoring = 'neg_mean_squared_error',
                                cv = kf_Lasso)  
        cv_Lasso.fit(x_train, y_train)

        print(cv_Lasso.best_params_, cv_Lasso.best_score_)

        model_Lasso_best = Lasso(alpha = cv_Lasso.best_params_['alpha']).fit(x_train, y_train)

        losses[f'Train_Lasso_{fold}'] = rmse(y_train, model_Lasso_best.predict(x_train)) 
        print(f"Train_Lasso_{fold}: {losses[f'Train_Lasso_{fold}']}")
        losses[f'Test_Lasso_{fold}'] = rmse(y_test, model_Lasso_best.predict(x_test)) 
        print(f"Test_Lasso_{fold}: {losses[f'Test_Lasso_{fold}']}")


        ## Non-linear Models
        # First, we will do bagging, which is just the case of Random Forest with all features for splitting.
        # That's why we use RandomForestRegressor
        from sklearn.ensemble import RandomForestRegressor 
        
        Tree_Bagging = RandomForestRegressor(n_estimators = 700, 
                                            criterion = 'squared_error',
                                            max_features = x_train.shape[1],  # All features for bagging
                                            bootstrap = True,
                                            max_samples = x_train.shape[0],
                                            random_state = 42)

        Tree_Bagging.fit(x_train, y_train)

        losses[f'Train_bagging_{fold}'] = rmse(y_train, Tree_Bagging.predict(x_train))
        print(f"Train_bagging_{fold}: {losses[f'Train_bagging_{fold}']}")
        losses[f'Test_bagging_{fold}'] = rmse(y_test, Tree_Bagging.predict(x_test))
        print(f"Test_bagging_{fold}: {losses[f'Test_bagging_{fold}']}")


        ## Random Forest
        # Bagging, but only use 1/3rd of the predictors
        Tree_RF = RandomForestRegressor(n_estimators = 700, 
                                criterion = 'squared_error',
                                max_features = int(x_train.shape[1] / 3),  # Consider only a 3rd of the predictors
                                bootstrap = True,
                                max_samples = x_train.shape[0],
                                random_state = 42)

        Tree_RF.fit(x_train, y_train)

        losses[f'Train_RF_{fold}'] = rmse(y_train, Tree_RF.predict(x_train))
        print(f"Train_RF_{fold}: {losses[f'Train_RF_{fold}']}")
        losses[f'Test_RF_{fold}'] = rmse(y_test, Tree_RF.predict(x_test))
        print(f"Test_RF_{fold}: {losses[f'Test_RF_{fold}']}")


        ## Tree Boosting
        # We will do a cross-validation search for the proper number of leaf nodes and estimators first
        from sklearn.ensemble import GradientBoostingRegressor

        # Since it runs for a long time, I have just stored the results from the last run manually here and use them instead of running CV again.
        '''
        kf_boosting = KFold(n_splits = 2, shuffle = True, random_state = 42)

        param_grid_boosting = {
            'n_estimators': list(range(500, 6100, 100)),
            'max_leaf_nodes': list(range(3,10)) #for a small dataset
        }

        Tree_Boosting = GradientBoostingRegressor(learning_rate = 0.01,
                                                criterion = 'squared_error',
                                                max_features = x_train.shape[1],
                                                random_state = 42)

        cv_tree_boosting = GridSearchCV(estimator = Tree_Boosting,
                                    param_grid = param_grid_boosting, 
                                    scoring = 'neg_mean_squared_error',
                                    cv = kf_boosting, 
                                    n_jobs = -1)

        cv_tree_boosting.fit(x_train, y_train)

        print("Best Parameters for Tree Boosting: ", cv_tree_boosting.best_params_)
        print("Best Score for Tree Boosting: ", cv_tree_boosting.best_score_)
        '''

        Tree_Boosting_best = GradientBoostingRegressor(learning_rate = 0.01,
                                                    n_estimators = 1400,
                                                    criterion = 'squared_error',
                                                    max_leaf_nodes = 7,
                                                    max_features = x_train.shape[1],
                                                    random_state = 42)
        Tree_Boosting_best.fit(x_train, y_train)

        losses[f'Train_boosting_{fold}'] = rmse(y_train, Tree_Boosting_best.predict(x_train))
        print(f"Train_boosting_{fold}: {losses[f'Train_boosting_{fold}']}")
        losses[f'Test_boosting_{fold}'] = rmse(y_test, Tree_Boosting_best.predict(x_test))
        print(f"Test_boosting_{fold}: {losses[f'Test_boosting_{fold}']}")

    # Construct a dataframe with the results
    results = pd.DataFrame()
    for k, v in losses.items():
        # Split the key into components
        parts = k.split('_')
        
        row = {
            'train': parts[0] == 'Train',
            'method': parts[1], 
            'fold': int(parts[-1]),
            'performance': v
        }
        results = pd.concat([results, pd.DataFrame([row])], ignore_index=True)
    
    # Average the value of the folds
    results = results.groupby(['train', 'method']).mean().drop(columns=['fold']).reset_index()
    # Sort the results 
    print(results.sort_values(['train', 'performance']).reset_index(drop=True))
    
    return results
