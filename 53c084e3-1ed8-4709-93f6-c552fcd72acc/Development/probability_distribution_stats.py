import numpy as np
print("Min probability:", test_preds.min())
print("Max probability:", test_preds.max())
print("Mean probability:", test_preds.mean())

print("90th, 95th, 99th percentiles:",
      np.percentile(test_preds, [90, 95, 99]))
