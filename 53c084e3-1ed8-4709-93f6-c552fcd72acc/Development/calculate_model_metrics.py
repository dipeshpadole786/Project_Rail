from sklearn.metrics import roc_auc_score

auc = roc_auc_score(y_test, test_preds)
gini = 2 * auc - 1

print("AUC:", auc)
print("Normalized Gini:", gini)
