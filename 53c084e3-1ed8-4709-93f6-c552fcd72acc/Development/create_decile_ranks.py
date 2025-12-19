test_df = pd.DataFrame({
    "prediction": test_preds,
    "rank": test_ranks
})

test_df["decile"] = pd.qcut(test_df["rank"], 10, labels=False)
