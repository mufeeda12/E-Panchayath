# 🗑️ Ward Deletion Service - Documentation

## Overview

A complete ward deletion service has been implemented for the E-Panchayat system. This service allows admins to delete wards from the database with safety checks to prevent data inconsistency.

---

## Features

✅ **Safe Deletion** - Prevents deletion of wards with associated complaints  
✅ **Error Handling** - Clear error messages for different scenarios  
✅ **Admin Only** - Requires admin authentication  
✅ **Audit Trail** - Returns deleted ward information  
✅ **Validation** - Checks ward existence before deletion  

---

## Backend Implementation

### Service Function: `delete_ward()`

**Location**: `backend/app/services/ward_services.py`

```python
def delete_ward(db: Session, ward_id: int):
    """
    Delete a ward by ID from the database.
    
    Args:
        db: Database session
        ward_id: ID of the ward to delete
        
    Returns:
        Dictionary with success message and deleted ward info
        
    Raises:
        HTTPException: If ward not found or if ward has associated complaints
    """
```

**Returns**:
```python
{
    "success": True,
    "message": "Ward 1 deleted successfully",
    "ward_id": 1,
    "ward_number": 1
}
```

**Error Cases**:

1. **Ward Not Found** (404)
   ```json
   {
     "detail": "Ward not found"
   }
   ```

2. **Ward Has Complaints** (400)
   ```json
   {
     "detail": "Cannot delete ward 1. It has 5 associated complaints. Please resolve or delete complaints first."
   }
   ```

---

### Endpoint: DELETE /admin/wards/{ward_id}

**Location**: `backend/app/routers/admin.py`

**HTTP Method**: DELETE  
**Path**: `/admin/wards/{ward_id}`  
**Authentication**: Required (Admin only)  
**Parameters**:
- `ward_id` (path): Integer ID of the ward to delete

**Request Example**:
```bash
curl -X DELETE http://localhost:8000/admin/wards/1 \
  -H "Authorization: Bearer <token>"
```

**Success Response** (200):
```json
{
  "success": true,
  "message": "Ward 1 deleted successfully",
  "ward_id": 1,
  "ward_number": 1
}
```

**Error Responses**:
- **404**: Ward not found
- **400**: Ward has associated complaints
- **403**: Not authorized (not admin)

---

### Helper Function: `get_ward_by_id()`

**Location**: `backend/app/services/ward_services.py`

Retrieves a specific ward by ID with GeoJSON boundary data.

```python
def get_ward_by_id(db: Session, ward_id: int):
    """Get a specific ward by ID with its GeoJSON boundary."""
```

**Returns GeoJSON Feature**:
```json
{
  "type": "Feature",
  "properties": {
    "id": 1,
    "ward_number": 1
  },
  "geometry": {
    "type": "Polygon",
    "coordinates": [[[9.4, 76.4], [9.45, 76.4], [9.45, 76.45], [9.4, 76.45], [9.4, 76.4]]]
  }
}
```

---

### Endpoint: GET /admin/wards/{ward_id}

**HTTP Method**: GET  
**Path**: `/admin/wards/{ward_id}`  
**Authentication**: Required (Admin only)  

**Request Example**:
```bash
curl -X GET http://localhost:8000/admin/wards/1 \
  -H "Authorization: Bearer <token>"
```

**Success Response** (200):
```json
{
  "type": "Feature",
  "properties": {
    "id": 1,
    "ward_number": 1
  },
  "geometry": { ... }
}
```

---

## Frontend Implementation

### API Methods

**Location**: `frontend/src/utils/api.js`

#### Delete Ward

```javascript
adminAPI.deleteWard(wardId);
```

**Parameters**:
- `wardId` (number): ID of the ward to delete

**Returns**: Promise that resolves with deletion response

**Example**:
```javascript
try {
  const response = await adminAPI.deleteWard(1);
  console.log(response);
  // { success: true, message: "Ward 1 deleted successfully", ... }
} catch (error) {
  console.error(error.message);
  // "Cannot delete ward 1. It has 5 associated complaints..."
}
```

#### Get Ward By ID

```javascript
adminAPI.getWardById(wardId);
```

**Parameters**:
- `wardId` (number): ID of the ward to retrieve

**Returns**: Promise that resolves with GeoJSON Feature

**Example**:
```javascript
const ward = await adminAPI.getWardById(1);
console.log(ward.properties.ward_number); // 1
```

---

## Usage Examples

### Backend (Python/FastAPI)

```python
# Example: Manual deletion via Python script
from sqlalchemy.orm import Session
from app.services.ward_services import delete_ward

result = delete_ward(db, ward_id=1)
print(result)
# Output: {
#   "success": True,
#   "message": "Ward 1 deleted successfully",
#   "ward_id": 1,
#   "ward_number": 1
# }
```

### Frontend (React)

```javascript
// Example 1: Simple deletion
async function handleDeleteWard(wardId) {
  try {
    const response = await adminAPI.deleteWard(wardId);
    alert(response.message);
  } catch (error) {
    alert(`Error: ${error.message}`);
  }
}

// Example 2: With confirmation
async function deleteWardWithConfirmation(wardId) {
  // Get ward details first
  const ward = await adminAPI.getWardById(wardId);
  
  // Show confirmation
  if (window.confirm(`Delete Ward ${ward.properties.ward_number}?`)) {
    const response = await adminAPI.deleteWard(wardId);
    console.log(response.message);
  }
}

// Example 3: With error handling and retry
async function deleteWardSafely(wardId, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await adminAPI.deleteWard(wardId);
      return response;
    } catch (error) {
      if (error.message.includes("complaints")) {
        // Ward has complaints - cannot retry
        throw error;
      }
      if (i < maxRetries - 1) {
        // Retry on other errors
        await new Promise(r => setTimeout(r, 1000));
      } else {
        throw error;
      }
    }
  }
}
```

### Using with Admin Dashboard

```javascript
// In an Admin Dashboard component
import { adminAPI } from '../utils/api';

export default function AdminWardManager() {
  const [wards, setWards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleDeleteWard = async (wardId) => {
    if (!window.confirm('Are you sure you want to delete this ward?')) {
      return;
    }

    setLoading(true);
    setError('');
    try {
      const response = await adminAPI.deleteWard(wardId);
      alert(response.message);
      
      // Refresh ward list
      const updatedWards = wards.filter(w => w.id !== wardId);
      setWards(updatedWards);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {error && <div className="error">{error}</div>}
      {wards.map(ward => (
        <div key={ward.id} className="ward-card">
          <h3>Ward {ward.ward_number}</h3>
          <button 
            onClick={() => handleDeleteWard(ward.id)}
            disabled={loading}
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}
```

---

## Safety Features

### 1. Complaint Validation
Prevents deletion of wards that have associated complaints:
- Checks if ward has any complaints
- Returns count of complaints in error message
- Suggests resolution before deletion

### 2. Ward Existence Check
Verifies ward exists before attempting deletion:
- Returns 404 if ward not found
- Clear error message to user

### 3. Admin Authentication
Requires admin role for deletion:
- Uses `require_admin` dependency
- Returns 403 if not authorized

### 4. Success Response
Includes deleted ward information for audit:
- Ward ID and number
- Success confirmation
- Timestamp (implicit in server response)

---

## Best Practices

### Frontend

✅ **Always confirm before deletion**
```javascript
if (window.confirm(`Delete Ward ${wardId}?`)) {
  await adminAPI.deleteWard(wardId);
}
```

✅ **Handle errors gracefully**
```javascript
try {
  await adminAPI.deleteWard(wardId);
} catch (error) {
  if (error.message.includes('complaints')) {
    showWarning('Cannot delete - has complaints');
  }
}
```

✅ **Disable button during operation**
```javascript
<button onClick={handleDelete} disabled={isDeleting}>
  {isDeleting ? 'Deleting...' : 'Delete'}
</button>
```

✅ **Show user feedback**
```javascript
// Show success
alert('Ward deleted successfully');

// Or refresh data
refetchWards();
```

### Backend

✅ **Log deletion events**
```python
import logging
logger = logging.getLogger(__name__)
logger.info(f"Ward {ward.wardnumber} deleted by admin")
```

✅ **Consider data retention policies**
- Soft delete vs hard delete
- Archive deleted wards
- Keep audit logs

✅ **Database constraints**
- Foreign key cascade (if needed)
- Check constraints
- Triggers for cleanup

---

## Testing

### Test Cases

1. **Delete existing ward** ✅
   ```bash
   DELETE /admin/wards/1
   Expected: 200 with success message
   ```

2. **Delete non-existent ward** ✅
   ```bash
   DELETE /admin/wards/999
   Expected: 404 Ward not found
   ```

3. **Delete ward with complaints** ✅
   ```bash
   DELETE /admin/wards/1  # (has 5 complaints)
   Expected: 400 Cannot delete - has complaints
   ```

4. **Delete without admin role** ✅
   ```bash
   DELETE /admin/wards/1  # (user is citizen)
   Expected: 403 Not authorized
   ```

5. **Delete without authentication** ✅
   ```bash
   DELETE /admin/wards/1  # (no token)
   Expected: 401 Unauthorized
   ```

---

## Workflow

```
Admin clicks Delete Button
    ↓
Frontend shows Confirmation Dialog
    ↓
User confirms deletion
    ↓
Frontend calls adminAPI.deleteWard(wardId)
    ↓
Backend validates:
  • Ward exists? ✓
  • User is admin? ✓
  • Ward has no complaints? ✓
    ↓
Backend deletes ward from database
    ↓
Backend returns success response
    ↓
Frontend shows success message
    ↓
Frontend updates UI (removes from list)
    ↓
Done! ✓
```

---

## Error Handling Flowchart

```
Try to delete ward
    ↓
    ├─→ Ward not found?
    │   ↓
    │   Return 404
    │   Admin sees: "Ward not found"
    │
    ├─→ Ward has complaints?
    │   ↓
    │   Return 400
    │   Admin sees: "Cannot delete - has X complaints"
    │
    ├─→ Not admin?
    │   ↓
    │   Return 403
    │   User sees: "Not authorized"
    │
    ├─→ Not authenticated?
    │   ↓
    │   Return 401
    │   User redirected to login
    │
    └─→ All checks pass?
        ↓
        Delete ward
        ↓
        Return 200 with success message
```

---

## Future Enhancements

1. **Soft Delete** - Mark deleted instead of removing
   ```python
   deleted_at = Column(DateTime, nullable=True)
   ```

2. **Archive Deleted Wards** - Keep for records
   ```python
   class DeletedWardArchive
   ```

3. **Bulk Delete** - Delete multiple wards
   ```python
   DELETE /admin/wards/batch
   ```

4. **Delete with Complaint Handling** - Auto-reassign complaints
   ```python
   DELETE /admin/wards/1?reassignComplaints=true
   ```

5. **Audit Log** - Track all deletions
   ```python
   class AuditLog
   ```

---

## Quick Reference

| Task | Method | Endpoint |
|------|--------|----------|
| Get all wards | GET | `/map/wards` |
| Get specific ward | GET | `/admin/wards/{id}` |
| Create ward | POST | `/admin/wards` |
| Delete ward | DELETE | `/admin/wards/{id}` |

| Frontend Function | Purpose |
|-------------------|---------|
| `adminAPI.getWardById(id)` | Fetch ward details |
| `adminAPI.deleteWard(id)` | Delete a ward |

---

## Status

✅ **Implemented**  
✅ **Tested**  
✅ **Documented**  
✅ **Ready for Production**

---

*Documentation Date: March 21, 2026*  
*Status: Complete*
