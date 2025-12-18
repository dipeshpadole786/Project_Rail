test_predictions_proba = final_gb_model.predict_proba(test_X_scaled)[:, 1]

print('Prediction range:', test_predictions_proba.min(), test_predictions_proba.max())
