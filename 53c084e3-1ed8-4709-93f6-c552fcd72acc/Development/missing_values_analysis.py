train_missing = train_df.isnull().sum()
train_cols_with_missing = train_missing[train_missing > 0]

print(f'Train columns with missing values: {len(train_cols_with_missing)}')
test_missing = test_df.isnull().sum()
test_cols_with_missing = test_missing[test_missing > 0]

print(f'Test columns with missing values: {len(test_cols_with_missing)}')

