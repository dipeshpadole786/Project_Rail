from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import StratifiedKFold
from sklearn.metrics import roc_auc_score
import numpy as np

skf = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
lr = LogisticRegression(max_iter=1000, n_jobs=-1)

auc_scores = []
gini_scores = []

for tr, val in skf.split(train_X_scaled, train_y):
    lr.fit(train_X_scaled.iloc[tr], train_y.iloc[tr])
    preds = lr.predict_proba(train_X_scaled.iloc[val])[:, 1]
    auc = roc_auc_score(train_y.iloc[val], preds)
    auc_scores.append(auc)
    gini_scores.append(2*auc - 1)

print('LR Mean AUC:', np.mean(auc_scores))
print('LR Mean Gini:', np.mean(gini_scores))
