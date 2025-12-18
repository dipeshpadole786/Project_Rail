from sklearn.impute import SimpleImputer

train_X = train_df[feature_cols].copy()

num_imputer = SimpleImputer(strategy='median')
bin_imputer = SimpleImputer(strategy='most_frequent')
cat_imputer = SimpleImputer(strategy='most_frequent')

train_X[numerical_features] = num_imputer.fit_transform(train_X[numerical_features])
train_X[binary_features] = bin_imputer.fit_transform(train_X[binary_features])
train_X[categorical_features] = cat_imputer.fit_transform(train_X[categorical_features])

print('Training data imputed')
