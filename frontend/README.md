# Klausurverwaltung : front React (Vite)

## Lancer

```bash
npm install
npm run dev        # http://localhost:5173
```

L'URL du backend se règle dans `.env` (`VITE_API_URL`, par défaut `http://localhost:8080`).
CORS : ton `SecurityConfig` autorise déjà `http://localhost:5173`.


| Endpoint | Réponse / corps attendu |
|---|---|
| `GET /api/admin/departments` | `[{ id, code, name, active }]` |
| `GET /api/admin/professors` | `[{ id, code, firstName, lastName, email, departmentId, departmentName, active }]` |
| `GET /api/admin/students` | `[{ id, matrikelnummer, firstName, lastName, email, departmentName, studiengang, currentSemester, active }]` (tableau ou page Spring `{content}`) |
| `GET /api/admin/modules` | `[ModuleResponse]` (celui que tu as déjà) |
| `GET /api/professor/exams/{id}/registrations` | `[{ registrationId, matrikelnummer, firstName, lastName, status, grade }]` (`grade` = null si pas encore noté) |
| `PUT /api/professor/exams/{id}/grades` | corps : `[{ registrationId, value }]` (value = nombre, ex. 2.3) |
| `GET /api/student/status` | `{ departmentName, studiengang, currentSemester, earnedCredits, average, registeredCount, deregisteredCount, failedAttempts }` |
| `GET /api/student/transcript` | `{ studentName, matrikelnummer, departmentName, studiengang, entries: [{ moduleCode, moduleName, credits, grade, term, attempt }], failedEntries: [...], totalCredits, average }` |   