
# Klausurverwaltung

Full-Stack-Webanwendung zur Verwaltung von Prüfungen. Der Administrator legt Konten und Module an, Professoren erstellen Prüfungen und tragen Noten ein, Studierende melden sich zu Prüfungen an und sehen ihren Notenspiegel.

## Funktionen

**Administrator**
- Departments, Professoren, Studierende und Module anlegen
- Konten werden mit einem temporären Passwort erstellt (wird nur einmal angezeigt)
- Module werden nur Professoren desselben Departments zugewiesen

**Professor**
- Prüfungen für die eigenen Module erstellen, ändern und absagen
- Teilnehmerliste einsehen und Noten eintragen

**Student**
- Anmeldung und Abmeldung zu Prüfungen (Fristen, Teilnehmerlimit, maximale Versuche)
- Übersicht über angemeldete und abgemeldete Prüfungen
- Status mit Credit Points und gewichtetem Notendurchschnitt
- Notenspiegel (druckbar)

## Technologien

| Bereich | Technologien |
|---|---|
| Backend | Java, Spring Boot, Spring Security, Spring Data JPA (Hibernate), Bean Validation |
| Authentifizierung | JWT (auth0 java-jwt), BCrypt, rollenbasierte Zugriffskontrolle |
| Datenbank | H2 (Entwicklung) |
| Frontend | React, Vite, React Router, Axios |

## Besonderheiten

- Keine Selbstregistrierung: Konten werden ausschließlich vom Administrator angelegt
- Pflicht zur Passwortänderung beim ersten Login
- Besitzprüfung im Service: Professoren und Studierende erreichen nur ihre eigenen Daten
- Deaktivierte Konten verlieren sofort den Zugriff (Prüfung in jeder Anfrage)
- Einheitliche Fehlerantworten im JSON-Format
- Noten als `BigDecimal`, zulässige Werte: 1,0 bis 4,0 in Dritteln sowie 5,0

## Projektstruktur

```
klausur/
├── backend/    Spring-Boot-API
└── frontend/   React-Oberfläche (Vite)
```

## Lokal starten

### Voraussetzungen
- Java 17 oder neuer, Maven
- Node.js 18 oder neuer

### Backend

1. `backend/src/main/resources/application-local.properties.example` nach `application-local.properties` kopieren und Werte eintragen:
   ```properties
   app.admin.email=admin@klausur.local
   app.admin.password=<eigenes Passwort>
   app.jwt.secret=<mindestens 32 Zeichen, z. B. mit: openssl rand -base64 48>
   ```
2. Starten mit dem Profil `local`:
   ```bash
   cd backend
   ./mvnw spring-boot:run -Dspring-boot.run.profiles=local
   ```
   Das Backend läuft auf `http://localhost:8080`.

### Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Die Oberfläche läuft auf `http://localhost:5173`. Anmeldung zuerst als Administrator mit den Werten aus `application-local.properties`.

## Typischer Ablauf

1. Admin legt Department, Professor, Student und Modul an
2. Professor ändert das temporäre Passwort und erstellt eine Prüfung
3. Student ändert das temporäre Passwort und meldet sich an
4. Nach dem Prüfungstermin trägt der Professor die Note ein
5. Student sieht Status und Notenspiegel

## Screenshots

![Login](docs/login.png)
![Notenspiegel](docs/notenspiegel.png)
![Notenerfassung](docs/noten.png)

## Geplant

- Docker und Docker Compose mit PostgreSQL
- CI/CD mit GitHub Actions
- Flyway-Migrationen
- Automatisierte Tests für Notenberechnung und Anmelderegeln
