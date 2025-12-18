submission_df = pd.DataFrame({
    'id': test_df['id'],
    'target': test_predictions_proba
})

submission_df.to_csv('submission.csv', index=False)
print('submission.csv created')
