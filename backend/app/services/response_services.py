

def complaint_status_response(Complaint):

    return {
        "response": (
            f"Your complaint regarding "
            f"{Complaint.category} "
            f"is currently '{Complaint.status}'."
        )
    }


def no_complaint_response():

    return {
        "response": (
            "You don't have any complaints registered."
        )
    }


def pending_complaints_response(count):

    return {
        "response": (
            f"You currently have "
            f"{count} pending complaints."
        )
    }


def office_info_response():

    return {
        "response": (
            "Panchayat office is open "
            "from 9 AM to 5 PM."
        )
    }


def fallback_response():

    return {
        "response": (
            "Sorry, I can only help with "
            "complaints and civic services."
        )
    }