# Encode categorical features in TEST data
test_X_encoded = test_X.copy()

test_X_encoded[categorical_features] = ordinal_encoder.transform(
    test_X[categorical_features]
)

print("Test categorical features encoded")
print(test_X_encoded.shape)
