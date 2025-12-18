feature_cols = [col for col in train_df.columns if col not in ['id', 'target']]
print(f'Total features: {len(feature_cols)}')
