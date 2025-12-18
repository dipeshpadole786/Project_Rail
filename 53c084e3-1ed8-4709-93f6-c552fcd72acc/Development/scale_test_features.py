# Scale TEST data using the TRAIN scaler
test_X_scaled = pd.DataFrame(
    scaler.transform(test_X_encoded),
    columns=test_X_encoded.columns,
    index=test_X_encoded.index
)

print("Test features scaled")
print(test_X_scaled.shape)
