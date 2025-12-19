import pandas as pd
import numpy as np
from sklearn.utils import resample

# Apply manual oversampling to balance the training data (alternative to SMOTE when imbalanced-learn is not available)
print("Original class distribution:")
print(f"Class 0: {sum(train_y == 0):,} samples")
print(f"Class 1: {sum(train_y == 1):,} samples")
print(f"Imbalance ratio: {sum(train_y == 0) / sum(train_y == 1):.2f}:1")

# Separate majority and minority classes
X_majority = train_X_scaled[train_y == 0]
X_minority = train_X_scaled[train_y == 1]
y_majority = train_y[train_y == 0]
y_minority = train_y[train_y == 1]

# Oversample minority class to match majority class
X_minority_upsampled = resample(X_minority,
                                 replace=True,
                                 n_samples=len(X_majority),
                                 random_state=42)
y_minority_upsampled = pd.Series([1] * len(X_majority), index=X_minority_upsampled.index)

# Combine majority and upsampled minority
train_X_balanced = pd.concat([X_majority, X_minority_upsampled])
train_y_balanced = pd.concat([y_majority, y_minority_upsampled])

# Shuffle the balanced dataset
shuffle_idx = np.random.RandomState(42).permutation(len(train_y_balanced))
train_X_balanced = train_X_balanced.iloc[shuffle_idx].reset_index(drop=True)
train_y_balanced = train_y_balanced.iloc[shuffle_idx].reset_index(drop=True)

print("\nAfter random oversampling:")
print(f"Class 0: {sum(train_y_balanced == 0):,} samples")
print(f"Class 1: {sum(train_y_balanced == 1):,} samples")
print(f"Total samples: {len(train_y_balanced):,}")
print(f"Balance ratio: {sum(train_y_balanced == 0) / sum(train_y_balanced == 1):.2f}:1")
print("\n✓ Successfully balanced the training data using random oversampling")