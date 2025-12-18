from sklearn.ensemble import GradientBoostingClassifier
from sklearn.metrics import roc_auc_score
import numpy as np

gb_auc_scores = []
gb_gini_scores = []

for tr, val in skf.split(train_X_scaled, train_y):
    gb = GradientBoostingClassifier(
        n_estimators=100,
        learning_rate=0.05,
        max_depth=5,
        min_samples_split=200,
        min_samples_leaf=50,
        subsample=0.8,
        max_features=0.8,
        random_state=42
    )
    
    gb.fit(train_X_scaled.iloc[tr], train_y.iloc[tr])
    preds = gb.predict_proba(train_X_scaled.iloc[val])[:, 1]
    
    auc = roc_auc_score(train_y.iloc[val], preds)
    gb_auc_scores.append(auc)
    gb_gini_scores.append(2 * auc - 1)

print('GB Mean AUC:', np.mean(gb_auc_scores))
print('GB Mean Gini:', np.mean(gb_gini_scores))
