from sklearn.preprocessing import StandardScaler

scaler = StandardScaler()

train_X_scaled = pd.DataFrame(
    scaler.fit_transform(train_X_encoded),
    columns=train_X_encoded.columns,
    index=train_X_encoded.index
)

print("Features scaled")
print(train_X_scaled.shape)
X_train = train_X_scaled
