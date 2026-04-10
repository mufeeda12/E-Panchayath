# function for predictions
from app.ml.loader import (
    category_model,
    priority_model,
    category_vectorizer,
    priority_vectorizer
)

def predict_category(text: str):
    vec = category_vectorizer.transform([text])
    return category_model.predict(vec)[0]

def predict_priority(text: str):
    vec = priority_vectorizer.transform([text])
    return priority_model.predict(vec)[0]