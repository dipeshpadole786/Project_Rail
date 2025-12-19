pos = train_df['target'].sum()
neg = len(train_df) - pos
scale_pos_weight = neg / pos

print(scale_pos_weight)
