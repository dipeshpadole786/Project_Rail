import numpy as np

binary_features = []
categorical_features = []
numerical_features = []

for col in feature_cols:
    unique_vals = train_df[col].dropna().unique()
    if len(unique_vals) == 2:
        binary_features.append(col)
    elif len(unique_vals) <= 15 and train_df[col].dtype in ['int64', 'object']:
        categorical_features.append(col)
    else:
        numerical_features.append(col)

print(f'Binary features: {len(binary_features)}')
print(f'Categorical features: {len(categorical_features)}')
print(f'Numerical features: {len(numerical_features)}')
