submission = pd.DataFrame({
    "id": test_df.index,
    "claim_probability": test_preds
})

submission.to_csv("submission.csv", index=False)
print("submission.csv created")
