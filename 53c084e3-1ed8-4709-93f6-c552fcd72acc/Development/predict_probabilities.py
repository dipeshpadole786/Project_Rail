test_preds = xgb_model.predict_proba(test_X_scaled)[:, 1]
