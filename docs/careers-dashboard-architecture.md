# Careers dashboard architecture

Status: implementation approved by the user on 18 October 2026.

Public Careers pages and application handling run in the existing Next.js app. Payload provides the protected `/hr` dashboard, authenticated staff management, job/application editing, and access-controlled upload delivery. Its SQLite adapter stores records in the private application data directory. CVs are stored alongside it, outside publicly served assets.

Public pages and the HR interface use separate root layouts, preserving the existing public URLs, fonts, styles, navigation, and footer. The CMS REST API lives under `/api/cms`; the candidate submission endpoint validates a bounded multipart request and checks that its job is open before creating a private application.

The initial deployment target is a single Node server with persistent storage. This keeps operation simple and avoids custom authentication. A serverless deployment would need durable database and object-storage configuration before launch; copying a local SQLite file into a build is not a persistence strategy.

Alternatives considered: a handwritten login/CRUD system would duplicate authentication and access-control machinery; a standalone hosted ATS would require an additional external service/account. Payload integrates the needed controls into the current app and supports its installed Next.js version.

References: [Payload integration](https://payloadcms.com/docs/getting-started/installation), [access control](https://payloadcms.com/docs/access-control/overview), [SQLite adapter](https://payloadcms.com/docs/database/sqlite).
