## Project Setup

For at kunne starte projektet skal det først downloades lokalt på computeren. Derefter skal env-filer i mappen env-filer/frontend og env-filer/backend filerne kopieres til henholdsvis frontend-mappen og backend-mappen.

Dernæst skal to terminaler åbnes i en code editor:

- Én terminal i backend-mappen.
- Én terminal i frontend-mappen.

I begge terminaler skal følgende command køres, for at downloade alle de nødvendige Node packages.

```sh
npm install
```

### Compile and Hot-Reload for Development

Når alle node packages er installeret for både frontend- og backend-mappen, så kan projektet startes.

I frontend-mappen i terminalen skal følgende command køres:

```sh
npm run dev
```

I backend-mappen i terminalen skal følgende command køres:

```sh
node server.js
```

Clienten burde nu køre på port http://localhost:5173/, og en Node server som kører på port http://localhost:5000
