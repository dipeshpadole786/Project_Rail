from sklearn.model_selection import StratifiedKFold
from sklearn.metrics import roc_auc_score
from sklearn.ensemble import GradientBoostingClassifier
import numpy as np

skf = StratifiedKFold(n_splits=3, shuffle=True, random_state=42)

gb_auc_scores_bal = []
gb_gini_scores_bal = []

for tr, val in skf.split(train_X_balanced, train_y_balanced):
    gb = GradientBoostingClassifier(
        n_estimators=50,
        learning_rate=0.1,
        max_depth=3,
        min_samples_split=200,
        min_samples_leaf=100,
        subsample=0.8,
        max_features='sqrt',
        random_state=42
    )
    gb.fit(train_X_balanced.iloc[tr], train_y_balanced.iloc[tr])
    preds = gb.predict_proba(train_X_balanced.iloc[val])[:, 1]
    auc = roc_auc_score(train_y_balanced.iloc[val], preds)
    gb_auc_scores_bal.append(auc)
    gb_gini_scores_bal.append(2 * auc - 1)

print(f"Balanced GB Mean AUC: {np.mean(gb_auc_scores_bal):.4f}")
print(f"Balanced GB Mean Gini: {np.mean(gb_gini_scores_bal):.4f}")