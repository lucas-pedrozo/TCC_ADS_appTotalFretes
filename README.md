# TCC_CursoTADS

Aplicativo mobile desenvolvido com React Native + Expo para o projeto de TCC, com foco em fluxo de autenticação e cadastro de usuário (incluindo etapas de dados pessoais, CNH e senha).

## Sobre o projeto

O app atual possui:
- Tela inicial com acesso para login e cadastro
- Fluxo de login
- Fluxo de cadastro em múltiplas etapas
- Estrutura de contexto global para autenticação, tema, cadastro e notificações
- Navegação por stack entre telas públicas e privadas

## Tecnologias usadas

### Base
- React 19
- React Native 0.81
- Expo SDK 54
- TypeScript

### Navegação
- `@react-navigation/native`
- `@react-navigation/native-stack`

### Estilo e UI
- NativeWind
- Tailwind CSS
- `react-native-safe-area-context`
- `react-native-gesture-handler`
- `react-native-reanimated`

### Formulários e validação
- `react-hook-form`
- `validator`
- `cpf-cnpj-validator`
- `emailvalid`

### Comunicação com API
- Axios

### Segurança e utilitários
- `expo-secure-store`
- `jwt-decode`

### Qualidade e padronização
- ESLint
- Commitlint
- Husky
- Prettier (com plugin Tailwind)

## Tecnologias instaladas mas não usadas diretamente no código atual

- `expo-router` (o projeto utiliza navegação com React Navigation)

## Estrutura principal

```text
TCC_CursoTADS/
├─ App/
│  ├─ src/
│  │  ├─ components/
│  │  ├─ context/
│  │  ├─ hooks/
│  │  ├─ routes/
│  │  ├─ screens/
│  │  ├─ service/
│  │  └─ utils/
│  └─ App.tsx
└─ README.md
```

## Como rodar o projeto

### 1) Instalar dependências da raiz
```bash
npm install
```

### 2) Instalar dependências do app mobile
```bash
cd App
npm install
```

### 3) Iniciar o app
```bash
npm run start
```

Opcional:
- `npm run android`
- `npm run ios`
- `npm run web`

## Scripts úteis

No diretório `App/`:
- `npm run start` → inicia Expo
- `npm run android` → abre no Android
- `npm run ios` → abre no iOS
- `npm run web` → roda versão web
- `npm run lint` → valida lint

Na raiz:
- `npm run prepare` → configura hooks do Husky

## Status atual

Projeto em evolução, com base de autenticação e cadastro já estruturada e pronto para expansão das funcionalidades privadas (ex.: dashboard/home completa).
