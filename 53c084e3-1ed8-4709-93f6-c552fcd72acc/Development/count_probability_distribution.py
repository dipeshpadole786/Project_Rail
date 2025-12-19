import pandas as pd

# Load submission file
df = pd.read_csv("submission (3) (1).csv")

# Count probabilities
greater_equal_75 = (df['target'] >= 0.60).sum()
less_than_75 = (df['target'] < 0.75).sum()

# Percentage of high-risk customers (>=75%)
claim_percentage = (greater_equal_75 / len(df)) * 100

print(">= 75% probability count:", greater_equal_75)
print("< 75% probability count:", less_than_75)
print(">= 75% probability percentage:", claim_percentage, "%")
