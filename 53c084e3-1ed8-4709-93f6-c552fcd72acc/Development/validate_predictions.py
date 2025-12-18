import numpy as np

assert np.all((test_predictions_proba >= 0) & (test_predictions_proba <= 1))
assert not np.isnan(test_predictions_proba).any()
assert not np.isinf(test_predictions_proba).any()

print('All predictions valid')
