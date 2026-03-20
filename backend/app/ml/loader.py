import joblib

category_model = joblib.load("app/ml/models/categoryprediction.pkl")
priority_model = joblib.load("app/ml/models/priorityprediction.pkl")
vectorizer = joblib.load("app/ml/models/vectorizer.pkl")