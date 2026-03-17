from enum import Enum
class ComplaintStatus(str,Enum):
    PENDING="Pending"
    IN_PROGRESS="In_Progress"
    RESOLVED="Resolved"