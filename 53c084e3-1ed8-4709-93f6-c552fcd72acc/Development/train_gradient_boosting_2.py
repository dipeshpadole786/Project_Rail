from sklearn.ensemble import GradientBoostingClassifier

final_gb_model = GradientBoostingClassifier(
    n_estimators=300,
    learning_rate=0.03,
    max_depth=4,
    min_samples_split=150,
    min_samples_leaf=40,
    subsample=0.85,
    max_features=0.85,
    random_state=42
)

final_gb_model.fit(train_X_scaled, train_y)
print("Tuned Gradient Boosting trained")
