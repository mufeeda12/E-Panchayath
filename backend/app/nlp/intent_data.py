# app/nlp/intent_data.py

training_sentences = [

    # -----------------------------
    # Track Complaint
    # -----------------------------

    "track my complaint",
    "complaint status",
    "check complaint update",
    "show my complaint",
    "what is my complaint status",
    "any update on my issue",
    "track my issue",
    "my complaint details",
    "show complaint details",
    "tell me my complaint status",
    "what happened to my complaint",
    "check my complaint",
    "where is my complaint",
    "is my complaint resolved",
    "complaint progress",
    "road complaint status",
    "garbage complaint update",
    "water leakage complaint status",
    "street light issue status",


    # Pending Complaints


    "pending complaints",
    "remaining complaints",
    "how many pending complaints",
    "my pending complaints",
    "number of pending complaints",
    "show pending complaints",
    "list pending complaints",
    "pending issue count",
    "active complaints",


    # Resolved Complaints


    "resolved complaints",
    "completed complaints",
    "how many complaints resolved",
    "resolved issue count",
    "show resolved complaints",
    "finished complaints",
    "closed complaints",



    "when will it be resolved",
    "expected resolution time",
    "how long will it take",
    "complaint resolution time",
    "when will my complaint finish",
    "how many days to resolve",
    "estimated completion time",
    "when will issue be fixed",


    # Office Information


    "office timings",
    "when is office open",
    "office time",
    "panchayat office timing",
    "office working hours",
    "when does office close",
    "office contact timing",


    # Ward Member Contact


    "ward member contact",
    "who is my ward member",
    "ward office phone number",
    "contact ward representative",
    "ward member phone number",
    "who handles my complaint",

]

training_intents = [

    # Track Complaint
    *["track_complaint"] * 19,

    # Pending Complaints
    *["pending_complaints"] * 9,

    # Resolved Complaints
    *["resolved_complaints"] * 7,

    # Resolution Time
    *["resolution_time"] * 8,

    # Office Information
    *["office_info"] * 7,

    # Ward Contact
    *["ward_contact"] * 6,
]