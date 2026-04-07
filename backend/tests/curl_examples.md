# SmartCare+ Backend API - Curl Examples

Assuming the backend is running at `http://localhost:<PORT>`.
If `3001` is already in use, the backend auto-falls back to `3002` (or the next free port).

## 1) Register (Patient)
```bash
curl -X POST "http://localhost:<PORT>/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Patient",
    "email": "john.patient@example.com",
    "password": "Password123",
    "profile": { "phone": "9999999999", "address": "Somewhere" }
  }'
```

## 2) Login (Patient)
```bash
curl -X POST "http://localhost:<PORT>/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.patient@example.com",
    "password": "Password123"
  }'
```
Save `token` from the response.

## 3) Login (Admin) - dev bootstrap
If `SEED_DEFAULT_ADMIN=true` (default in `.env.example`), use:
```bash
curl -X POST "http://localhost:<PORT>/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@smartcare.local",
    "password": "Admin@12345"
  }'
```

## 4) Create Doctor (Admin)
```bash
curl -X POST "http://localhost:<PORT>/api/admin/doctors" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -d '{
    "name": "Dr. Smith",
    "email": "dr.smith@example.com",
    "password": "DoctorPass123",
    "specialization": "General Medicine"
  }'
```
Save the created doctor's `id`.

## 5) Login (Doctor)
```bash
curl -X POST "http://localhost:<PORT>/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "dr.smith@example.com",
    "password": "DoctorPass123"
  }'
```
Save `token` from the response as `DOCTOR_TOKEN`.

## 6) Book Appointment (Patient)
Use an ISO timestamp in the future:
```bash
curl -X POST "http://localhost:<PORT>/api/appointments" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer PATIENT_TOKEN" \
  -d '{
    "doctorId": "DOCTOR_ID",
    "startTime": "2026-04-07T10:30:00.000Z",
    "durationMinutes": 30,
    "symptoms": ["mild headache"],
    "severity": 2
  }'
```
Save `appointment.id`.

## 7) Patient Upload Report
```bash
curl -X POST "http://localhost:<PORT>/api/patient/upload-report" \
  -H "Authorization: Bearer PATIENT_TOKEN" \
  -F "appointmentId=APPOINTMENT_ID" \
  -F "description=Old scan report" \
  -F "report=@./sample-report.pdf"
```

## 8) Doctor Diagnosis (Marks Appointment Completed)
```bash
curl -X POST "http://localhost:<PORT>/api/doctor/diagnosis" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer DOCTOR_TOKEN" \
  -d '{
    "appointmentId": "APPOINTMENT_ID",
    "diagnosisText": "Based on symptoms, possible migraine.",
    "symptoms": ["mild headache"],
    "severity": 3
  }'
```

## 9) Admin Analytics
```bash
curl -X GET "http://localhost:<PORT>/api/admin/analytics" \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

