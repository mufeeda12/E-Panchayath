import joblib
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

category_model = joblib.load("app/ml/models/categoryprediction.pkl")
priority_model = joblib.load("app/ml/models/priorityprediction.pkl")
vectogit branchrizer = joblib.load("app/ml/models/vectorizer.pkl")