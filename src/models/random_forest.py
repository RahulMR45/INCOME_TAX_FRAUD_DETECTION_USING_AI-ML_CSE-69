import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler
from imblearn.over_sampling import SMOTE
import joblib

# Prepare the data
df = pd.read_csv("income_tax_fraud_detection_data.csv")
X = df.drop(columns=['potential_tax_fraud'])
y = df['potential_tax_fraud']

# Split the data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=30)

# Apply SMOTE
smote = SMOTE(random_state=42)
X_train_resampled, y_train_resampled = smote.fit_resample(X_train, y_train)

# Standardize features
scaler = StandardScaler()
X_train_resampled = scaler.fit_transform(X_train_resampled)
X_test = scaler.transform(X_test)

# Train the model
random_forest_model = RandomForestClassifier(random_state=42)
random_forest_model.fit(X_train_resampled, y_train_resampled)

# Save the model
joblib.dump(random_forest_model, 'random_forest_model.pkl')
joblib.dump(scaler, 'random_forest_scaler.pkl')

# Make predictions function
def predict_random_forest(input_data):
    scaler = joblib.load('random_forest_scaler.pkl')
    model = joblib.load('random_forest_model.pkl')
    input_data = scaler.transform(input_data)  # Preprocess input
    prediction=model.predict(input_data)
    return prediction[0]
