import matplotlib.pyplot as plt
plt.figure(figsize=(6,4))
plt.boxplot(test_predictions_proba, vert=False)
plt.xlabel('Predicted Probability')
plt.title('Prediction Spread (Test Data)')
plt.show()
