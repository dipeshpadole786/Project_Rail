import pandas as pd
import matplotlib.pyplot as plt
import numpy as np

# Baseline Gini scores from cross-validation
baseline_scores = {
    'Logistic Regression': 0.2397,
    'Random Forest': 0.2407,
    'Gradient Boosting': 0.2748
}

# Create comparison dataframe
baseline_df = pd.DataFrame({
    'Model': list(baseline_scores.keys()),
    'Gini Score': list(baseline_scores.values())
})

# Sort by Gini score
baseline_df = baseline_df.sort_values('Gini Score', ascending=True)

print('Baseline Model Performance (5-Fold CV)')
print('='*50)
print(baseline_df.to_string(index=False))
print('\n')

# Zerve color palette
zerve_bg = '#1D1D20'
zerve_text = '#fbfbff'
zerve_light_blue = '#A1C9F4'
zerve_orange = '#FFB482'
zerve_green = '#8DE5A1'

# Create professional bar chart
fig, ax = plt.subplots(figsize=(10, 6), facecolor=zerve_bg)
ax.set_facecolor(zerve_bg)

# Horizontal bar chart with Zerve colors
colors = [zerve_light_blue, zerve_orange, zerve_green]
bars = ax.barh(baseline_df['Model'], baseline_df['Gini Score'], color=colors, edgecolor=zerve_text, linewidth=1.5)

# Add value labels on bars
for _i, (_model, _score) in enumerate(zip(baseline_df['Model'], baseline_df['Gini Score'])):
    ax.text(_score + 0.003, _i, f'{_score:.4f}', va='center', fontsize=11, color=zerve_text, fontweight='bold')

# Styling
ax.set_xlabel('Gini Score', fontsize=13, color=zerve_text, fontweight='bold')
ax.set_ylabel('Model', fontsize=13, color=zerve_text, fontweight='bold')
ax.set_title('Baseline Model Performance Comparison\n(5-Fold Cross-Validation)', 
             fontsize=15, color=zerve_text, fontweight='bold', pad=20)

# Axis styling
ax.tick_params(colors=zerve_text, labelsize=11)
ax.spines['bottom'].set_color(zerve_text)
ax.spines['left'].set_color(zerve_text)
ax.spines['top'].set_visible(False)
ax.spines['right'].set_visible(False)

# Set x-axis range with some padding
ax.set_xlim(0, max(baseline_df['Gini Score']) * 1.15)

plt.tight_layout()
baseline_comparison_chart = fig
plt.show()

# Summary insights
print('Key Insights:')
print('- Gradient Boosting achieves the highest baseline Gini score (0.2748)')
print('- Random Forest and Logistic Regression show similar performance (0.2407 vs 0.2397)')
print('- All models indicate significant room for improvement through:')
print('  * SMOTE for class imbalance (26:1 ratio)')
print('  * Hyperparameter tuning')
print('  * Feature engineering')
