import numpy as np
import matplotlib.pyplot as plt

model_names = ['Logistic Regression', 'Random Forest', 'Gradient Boosting']
gini_values = [
    np.mean(gini_scores),
    rf_gini_mean,
    np.mean(gb_gini_scores)
]

plt.figure(figsize=(8,5))
plt.barh(model_names, gini_values)
plt.xlabel('Normalized Gini Score')
plt.title('Model Comparison (5-Fold Cross-Validation)')
plt.show()
