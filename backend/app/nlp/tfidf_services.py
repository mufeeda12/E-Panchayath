# app/nlp/tfidf_service.py

from sklearn.feature_extraction.text import (
    TfidfVectorizer
)

from sklearn.metrics.pairwise import (
    cosine_similarity
)

import numpy as np

from app.nlp.intent_data import (
    training_sentences,
    training_intents
)


# -----------------------------------
# Create TF-IDF Vectorizer
# -----------------------------------

vectorizer = TfidfVectorizer()

X = vectorizer.fit_transform(
    training_sentences
)


# -----------------------------------
# Predict Intent
# -----------------------------------

def predict_intent(message):

    user_vector = vectorizer.transform(
        [message]
    )

    similarity = cosine_similarity(
        user_vector,
        X
    )

    best_match_index = np.argmax(
        similarity
    )

    confidence = similarity[0][
        best_match_index
    ]

    # Confidence threshold
    if confidence < 0.30:
        return "unknown"

    return training_intents[
        best_match_index
    ]