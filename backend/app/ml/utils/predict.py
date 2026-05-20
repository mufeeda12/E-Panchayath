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

PRIORITY_LABELS = {
    0: "High",
    1: "Low",
    2: "Medium",
}

def predict_priority(text: str):
    vec = priority_vectorizer.transform([text])
    priority_code = priority_model.predict(vec)[0]
    return PRIORITY_LABELS.get(int(priority_code), str(priority_code))