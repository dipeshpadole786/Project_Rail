test_X = test_df[feature_cols].copy()

test_X[numerical_features] = num_imputer.transform(test_X[numerical_features])
test_X[binary_features] = bin_imputer.transform(test_X[binary_features])
test_X[categorical_features] = cat_imputer.transform(test_X[categorical_features])

print('Test data imputed')
