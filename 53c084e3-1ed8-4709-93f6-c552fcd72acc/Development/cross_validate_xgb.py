from sklearn.metrics import roc_auc_score
import numpy as np

auc_scores = []
X = train_X_scaled
y = train_df['target']



for fold, (train_idx, val_idx) in enumerate(skf.split(X, y), 1):
    X_tr, X_val = X.iloc[train_idx], X.iloc[val_idx]
    y_tr, y_val = y.iloc[train_idx], y.iloc[val_idx]

    xgb_model.fit(X_tr, y_tr)

    val_preds = xgb_model.predict_proba(X_val)[:, 1]
    auc = roc_auc_score(y_val, val_preds)
    auc_scores.append(auc)

    print(f"Fold {fold} AUC: {auc:.4f}")

mean_auc = np.mean(auc_scores)
gini = 2 * mean_auc - 1

print(f"\nMean CV AUC: {mean_auc:.4f}")
print(f"Normalized Gini: {gini:.4f}")
