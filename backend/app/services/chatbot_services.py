# app/services/chatbot_service.py

from app.models.complaint import Complaint

from app.nlp.tfidf_services import (
    predict_intent
)

from app.nlp.nlp_utils import (
    extract_category
)

from app.services.complaint_services import (
    get_latest_complaint,
    get_pending_complaints_count
)

from app.services.response_services import (
    complaint_status_response,
    no_complaint_response,
    pending_complaints_response,
    office_info_response,
    fallback_response
)


def chatbot_response(
    message,
    current_user,
    db
):





    intent = predict_intent(
        message
    )





    if intent == "track_complaint":

        category = extract_category(
            message
        )

        complaint = get_latest_complaint(
            db,
            current_user.id,
            category
        )

        if complaint:

            return complaint_status_response(
                complaint
            )

        return no_complaint_response()


    elif intent == "pending_complaints":

        pending_count = (
            get_pending_complaints_count(
                db,
                current_user.id
            )
        )

        return pending_complaints_response(
            pending_count
        )

    elif intent == "office_info":

        return office_info_response()
    elif intent == "resolved_complaints":

        resolved_count = db.query(
            Complaint
        ).filter(
            Complaint.user_id == current_user.id,
            Complaint.status == "RESOLVED"
        ).count()

        return {
            "response":
                f"You have {resolved_count} resolved complaints."
        }
    elif intent == "resolution_time":

        return {
            "response":
                "Most complaints are usually resolved within 3 to 7 working days depending on priority."
        }
    elif intent == "ward_contact":

        complaint = db.query(Complaint).filter(
            Complaint.user_id == current_user.id
        ).order_by(
            Complaint.created_at.desc()
        ).first()

        if complaint:
            ward = complaint.ward

            return {
                "response": (
                    f"Your complaint belongs to "
                    f"Ward {ward.wardnumber}.\n"
                    f"Ward Member: {ward.member_name}\n"
                    f"Contact: {ward.member_phone}"
                )
            }

        return {
            "response":
                "No complaints found."
        }


    # Fallback


    return fallback_response()