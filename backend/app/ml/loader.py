import joblib
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

category_model = joblib.load(os.path.join(BASE_DIR, "models/categoryprediction.pkl"))
priority_model = joblib.load(os.path.join(BASE_DIR, "models/priorityprediction.pkl"))
vectorizer = joblib.load(os.path.join(BASE_DIR, "models/vectorizer.pkl"))