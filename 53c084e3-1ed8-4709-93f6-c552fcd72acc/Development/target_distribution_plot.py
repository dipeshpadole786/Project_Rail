import matplotlib.pyplot as plt

target_counts = train_df['target'].value_counts().sort_index()

plt.figure(figsize=(6,4))
plt.bar(target_counts.index.astype(str), target_counts.values)
plt.xlabel('Target Class')
plt.ylabel('Number of Customers')
plt.title('Target Class Distribution (Training Data)')
plt.show()
