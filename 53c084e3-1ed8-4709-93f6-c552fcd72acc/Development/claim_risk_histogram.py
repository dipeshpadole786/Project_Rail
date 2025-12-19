import matplotlib.pyplot as plt
plt.figure(figsize=(8,5))
plt.hist(test_predictions_proba, bins=50)
plt.xlabel('Predicted Claim Probability')
plt.ylabel('Number of Customers')
plt.title('Predicted Claim Risk Distribution (Test Data)')
plt.show()
