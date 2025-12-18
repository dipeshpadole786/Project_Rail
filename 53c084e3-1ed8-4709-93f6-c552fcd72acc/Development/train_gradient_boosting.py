from sklearn.ensemble import GradientBoostingClassifier
final_gb_model = GradientBoostingClassifier(
    n_estimators=100,
    learning_rate=0.05,
    max_depth=5,
    min_samples_split=200,
    min_samples_leaf=50,
    subsample=0.8,
    max_features=0.8,
    random_state=42
)

final_gb_model.fit(train_X_scaled, train_y)
print('Final GB model trained')
