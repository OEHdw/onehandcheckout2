# OneHandCheckout — CLAUDE.md
## Cos'è questo progetto
**OneHandCheckout** è una piattaforma di self-checkout mobile per acquisti singoli in negozi fisici.
Flusso utente:
1. Cliente vede un prodotto esposto in negozio
2. Scansiona il QR code sul prodotto con l'app
3. Si apre una **single-product page** con info + prezzo
4. Paga in-app (Stripe o provider TBD)
5. Lo schermo mostra uno **scontrino digitale animato** — colori vivaci (azzurro, viola, rosa) con pattern dinamico
6. Il cliente esce dal negozio mostrando lo schermo — zero cassa, zero fila
### Regola core
Un cliente può uscire **solo con un prodotto, senza busta**. Il prodotto deve essere "onehandcheckouttabile" (portatile con una mano).
---
## Anti-frode: il receipt animato
Il sistema anti-screenshot è il cuore del progetto.
- Lo scontrino NON è una schermata statica
- È una **GIF/animazione** con colori e pattern che cambiano in base a:
  - ID del negozio
  - Data del giorno
- Il merchant conosce il pattern del giorno (via dashboard o notifica mattutina)
- Uno screenshot è immediatamente riconoscibile perché il pattern è fermo
> Ispirazione: biglietti animati Trenitalia — ma ancora più visivo e immediato.
---
## Stack tecnico
```
Frontend (app cliente):        HTML + CSS + JavaScript (vanilla)
Frontend (dashboard merchant): HTML + CSS + JavaScript (vanilla)
Backend/API:                   Node.js + Express
Database:                      MongoDB (Mongoose ODM)
Pagamenti:                     [ TODO — Stripe consigliato ]
QR code:                       [ TODO — qrcode.js o libreria npm ]
Animazione receipt:            CSS animations / Canvas API
Auth:                          [ TODO — JWT ]
Hosting:                       [ TODO ]
```
### Scelte di stile
- **No framework frontend** — vanilla JS puro, massima semplicità e portabilità
- **Node.js** come runtime backend con Express per le API REST
- **MongoDB** come unico datastore — schema flessibile, ideale per product catalog e transazioni
- Il receipt animato va realizzato in **CSS puro o Canvas** — no dipendenze esterne
---
## Struttura del progetto (placeholder)
```
onehandcheckout/
├── app/              # App mobile cliente
├── dashboard/        # Dashboard web merchant
├── api/              # Backend REST/GraphQL
├── db/               # Schema MongoDB, seed data
├── docs/             # Documentazione tecnica
└── CLAUDE.md         # Questo file
```
---
## Attori del sistema
| Attore | Ruolo |
|---|---|
| **Cliente** | Scarica l'app, scansiona QR, paga, esce |
| **Merchant** | Installa QR sui prodotti, verifica scontrino visivamente, incassa |
| **OneHandCheckout** | Piattaforma, payment processing, generazione pattern animati |
---
## Principi di sviluppo
- **Mobile-first** sempre — l'esperienza cliente è tutta su schermo piccolo
- **Semplicità radicale** — il checkout deve richiedere meno tap possibili
- **Zero infrastruttura hardware** per il merchant — niente scanner, niente tornelli
- **Viralità > monetizzazione** nella fase attuale — l'obiettivo ora è trazione e word of mouth
- **Sicurezza del receipt** è non negoziabile — il pattern animato deve essere robusto
---
## Decisioni aperte (TODO)
- [ ] Stack definitivo (frontend app, backend, hosting)
- [ ] Payment provider (Stripe consigliato per velocità di integrazione)
- [ ] Logica del pattern animato — come viene generato e comunicato al merchant
- [ ] Onboarding merchant — come si registra un negozio, come attiva i QR
- [ ] Soglia prezzo massima per prodotto "onehandcheckouttabile"
- [ ] MVP scope — cosa c'è nella v0.1
---
## Tono e approccio
Questo è un progetto early-stage. Priorità:
1. Far funzionare il flusso end-to-end (scansione → pagamento → receipt animato)
2. Testare con un merchant reale a Roma
3. Iterare veloce
Non over-engineerare. Scegli sempre la soluzione più semplice che funziona.
