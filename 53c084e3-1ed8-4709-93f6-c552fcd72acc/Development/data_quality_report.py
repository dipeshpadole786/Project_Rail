print('=' * 60)
print('DATA QUALITY REPORT')
print('=' * 60)

print(f'Train rows: {train_df.shape[0]}, columns: {train_df.shape[1]}')
print(f'Test rows: {test_df.shape[0]}, columns: {test_df.shape[1]}')

print(f'Binary: {len(binary_features)}')
print(f'Categorical: {len(categorical_features)}')
print(f'Numerical: {len(numerical_features)}')

print(f'Train cols with missing: {len(train_cols_with_missing)}')
print(f'Test cols with missing: {len(test_cols_with_missing)}')

print(f'Imbalance ratio: {imbalance_ratio:.2f}:1')
print('=' * 60)
