# node_mongoose

API REST pour gérer des comptes bancaires et leurs transactions (lignes de compte). Faite avec Node.js, Express et Mongoose.

## Prérequis

- Node.js 18+
- MongoDB (local ou Atlas)

## Installation

```bash
git clone https://github.com/GuillardPierre/node_mongoose.git
cd node_mongoose
npm install
cp .env.example .env
```

Remplir le `.env` avec ses propres valeurs, puis démarrer le serveur :

## Variables d'environnement

| Variable      | Description                               |
| ------------- | ----------------------------------------- |
| `PORT`        | Port du serveur (5000 par défaut)         |
| `MONGODB_URI` | URI de connexion MongoDB                  |
| `JWT_SECRET`  | Secret utilisé pour signer les tokens JWT |

## Authentification

Toutes les routes `/api/accounts/...` demandent un token JWT récupéré via `/api/auth/login`, à passer dans le header :

```
Authorization: Bearer <token>
```

## Routes

### Auth

- `POST /api/auth/register` — créer un compte utilisateur
- `POST /api/auth/login` — se connecter, renvoie un token

### Comptes bancaires

- `POST /api/accounts` — créer un compte
- `GET /api/accounts` — lister ses comptes avec leur solde
- `PATCH /api/accounts/:accountId` — modifier un compte
- `DELETE /api/accounts/:accountId` — supprimer un compte (et ses transactions)
- `GET /api/accounts/global-balance` — solde cumulé de tous ses comptes

### Transactions

- `POST /api/accounts/:accountId/transactions` — ajouter une transaction
- `GET /api/accounts/:accountId/transactions` — lister les transactions d'un compte avec son solde
- `PUT /api/accounts/:accountId/transactions/:transactionId` — modifier une transaction
- `DELETE /api/accounts/:accountId/transactions/:transactionId` — supprimer une transaction
- `GET /api/accounts/:accountId/transactions/pending` — transactions "à venir" uniquement
- `GET /api/accounts/:accountId/transactions/populated` — transactions avec le compte parent inclus

## Exemples

Inscription et connexion :

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Password123!"}'

curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Password123!"}'
```

Créer un compte (avec le token récupéré au login) :

```bash
curl -X POST http://localhost:5000/api/accounts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"name":"Compte courant"}'
```

Ajouter une transaction :

```bash
curl -X POST http://localhost:5000/api/accounts/<accountId>/transactions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"label":"Courses","type":"debit","amount":42.5,"payment_method":"Credit Card","category":"Food"}'
```
