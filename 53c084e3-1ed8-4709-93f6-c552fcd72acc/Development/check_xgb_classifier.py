from xgboost import XGBClassifier

xgb_model = XGBClassifier(
    objective='binary:logistic',
    eval_metric='auc',
    n_estimators=600,
    max_depth=7,
    learning_rate=0.04,
    subsample=0.85,
    colsample_bytree=0.85,
    scale_pos_weight=26.44,
    random_state=42,
    tree_method='hist'
)

xgb_model.fit(X, y)
