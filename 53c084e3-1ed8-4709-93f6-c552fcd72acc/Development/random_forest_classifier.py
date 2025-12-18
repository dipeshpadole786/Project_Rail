from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import cross_val_score

rf = RandomForestClassifier(
    n_estimators=100,
    max_depth=10,
    class_weight='balanced',
    random_state=42,
    n_jobs=-1
)

rf_auc = cross_val_score(rf, train_X_scaled, train_y, cv=5, scoring='roc_auc')
rf_auc_mean = rf_auc.mean()
rf_gini_mean = 2*rf_auc_mean - 1

rf.fit(train_X_scaled, train_y)

print('RF AUC:', rf_auc_mean)
print('RF Gini:', rf_gini_mean)
