import pandas as pd

# Load submission file
df = pd.read_csv("submission.csv")

# Count probabilities
greater_equal_75 = (df['target'] >= 0.75).sum()
less_than_75 = (df['target'] < 0.75).sum()

print(">= 75% probability:", greater_equal_75)
print("< 75% probability:", less_than_75)
