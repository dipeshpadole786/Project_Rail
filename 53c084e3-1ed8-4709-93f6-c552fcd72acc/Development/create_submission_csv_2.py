submission_df = pd.DataFrame({
    'id': test_df['id'],
    'target': test_predictions_proba
})

submission_df.to_csv("second_submition.csv", index=False)
print("Final submission.csv created")
