# app/nlp/nlp_utils.py

def extract_category(message):

    message = message.lower()

    categories = {

        "road": "Road Damage",

        "water": "Water Leakage",

        "garbage": "Garbage Issue",

        "street light": "Street Light"
    }

    for keyword, category in categories.items():

        if keyword in message:
            return category

    return None