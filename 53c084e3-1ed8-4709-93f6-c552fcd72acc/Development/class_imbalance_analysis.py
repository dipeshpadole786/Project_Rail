import pandas as pd

target_counts = train_df['target'].value_counts().sort_index()
target_pct = (target_counts / len(train_df)) * 100

for cls, cnt in target_counts.items():
    print(f'Class {cls}: {cnt} ({target_pct[cls]:.2f}%)')

imbalance_ratio = target_counts.max() / target_counts.min()
print(f'Imbalance ratio: {imbalance_ratio:.2f}:1')
