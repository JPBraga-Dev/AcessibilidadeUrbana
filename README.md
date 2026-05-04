# Acessecidade — Acessibilidade Urbana

Aplicativo mobile em **React Native / Expo**.

## Como executar

Pré-requisitos: Node.js 18+ e o app **Expo Go** no celular (ou emulador Android/iOS).

```bash
cd AcessibilidadeUrbana
npm install
npm start
```

Depois, leia o QR Code com o Expo Go ou pressione `a` (Android) / `i` (iOS) no terminal.

## Configuração do Supabase

1. Crie um projeto em [supabase.com](https://supabase.com).
2. Em **Project Settings → API**, copie `Project URL` e a chave `anon public`.
3. Copie o arquivo de exemplo e preencha com suas credenciais:

```bash
cp .env.example .env
```

4. Edite `.env`:

```
EXPO_PUBLIC_SUPABASE_URL=https://SEU-PROJETO.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=sua-anon-key-aqui
```

5. Reinicie o Expo com cache limpo para carregar as variáveis:

```bash
npx expo start -c
```

> As variáveis com prefixo `EXPO_PUBLIC_` são embutidas no bundle do app e podem ser lidas via `process.env` em qualquer arquivo. O arquivo `.env` já está no `.gitignore`.

## Estrutura

```
AcessibilidadeUrbana/
├── App.js                     # Container de navegação (Stack)
├── index.js                   # Entry point do Expo
├── app.json                   # Configuração do Expo
├── babel.config.js
├── package.json
├── styles.js                  # Estilos compartilhados
├── .env.example               # Modelo de variáveis de ambiente
├── lib/
│   └── supabase.js            # Client do Supabase (auth + storage)
└── telas/
    ├── TelaLogin.js
    └── TelaCriarConta.js
```

## Fluxo de navegação

```
Login ──► CriarConta
```

## Autenticação

- `TelaCriarConta` usa `supabase.auth.signUp` (salva o `nome` em `user_metadata`).
- `TelaLogin` usa `supabase.auth.signInWithPassword`.
- A sessão é persistida no `AsyncStorage` e é renovada automaticamente.
