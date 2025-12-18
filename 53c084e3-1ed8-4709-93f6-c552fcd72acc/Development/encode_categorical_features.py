from sklearn.preprocessing import OrdinalEncoder

ordinal_encoder = OrdinalEncoder(
    handle_unknown='use_encoded_value',
    unknown_value=-1
)

train_X_encoded = train_X.copy()
train_X_encoded[categorical_features] = ordinal_encoder.fit_transform(
    train_X[categorical_features]
)

print("Categorical features encoded")
