from enum import Enum
class ComplaintStatus(str,Enum):
    PENDING="Pending"
    IN_PROGRESS="In Progress"
    RESOLVED="Resolved"