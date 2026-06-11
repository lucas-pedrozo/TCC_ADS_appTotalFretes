# 🚛 Total Fretes App

**Aplicativo mobile para gerenciamento de fretes**

Desenvolvido com **Expo** e **React Native**

---

## 📋 Índice

- [Visão Geral](#-visão-geral)
- [Pré-requisitos](#-pré-requisitos)
- [Configuração do Ambiente](#-configuração-do-ambiente)
- [Instalação e Execução](#-instalação-e-execução)
- [Fluxo de Desenvolvimento](#-fluxo-de-desenvolvimento)
- [Padrão de Commits](#-padrão-de-commits)
- [Pull Requests](#-pull-requests)

---

## 🌐 Visão Geral

O **Total Fretes App** é um aplicativo mobile que integra rastreamento de rotas via Mapbox e comunicação com API REST para gestão de fretes. Construído com Expo e React Native, oferece uma experiência nativa em dispositivos Android.

---

## ✅ Pré-requisitos

Antes de iniciar, certifique-se de ter instalado em sua máquina:

- [Node.js](https://nodejs.org/) (versão LTS recomendada)
- [Git](https://git-scm.com/)
- [Android Studio](https://developer.android.com/studio) ou um dispositivo Android físico
- Conta no [Mapbox](https://account.mapbox.com/)
- Token de acesso ao repositório no GitHub (`GIT_TOKEN`)

---

## ⚙️ Configuração do Ambiente

O projeto utiliza dois arquivos `.env` distintos. Utilize os respectivos `.env.example` como referência.

### 1. `.env` — Raiz do projeto

Crie o arquivo `.env` na raiz do repositório e defina o token do GitHub. Ele é exigido pelo hook do Husky antes de cada commit:

```env
GIT_TOKEN=seu_github_token_aqui
```

---

### 2. `App/.env` — Configurações do aplicativo

Crie o arquivo `App/.env` com as variáveis necessárias para comunicação com a API e exibição de mapas.

#### 🔗 URL da API (`ENV_BASE_URL`)

Ao testar em dispositivo físico ou emulador, **não utilize** `localhost` ou `127.0.0.1` — o dispositivo precisa alcançar o backend pela rede local.

**Como configurar:**

1. Descubra o IP da sua máquina na rede Wi-Fi (ex.: `192.168.0.10`)
2. Garanta que o backend esteja rodando e acessível nesse IP
3. Defina a variável no `App/.env`:

```env
ENV_BASE_URL=http://SEU_IP:PORTA/api
```

#### 🗺️ Token do Mapbox (`MAPBOX_PUBLIC_TOKEN`)

O app utiliza Mapbox para exibição de rotas e mapas.

**Como obter o token:**

1. Acesse [account.mapbox.com](https://account.mapbox.com/) e faça login (ou crie uma conta)
2. Em **Access Tokens**, copie o **Default public token** ou crie um novo
3. Adicione ao `App/.env`:

```env
MAPBOX_PUBLIC_TOKEN=pk.seu_token_aqui
```

#### Exemplo completo do `App/.env`

```env
ENV_BASE_URL=http://192.168.0.10/api
MAPBOX_PUBLIC_TOKEN=pk.seu_token_aqui
```

---

## 🚀 Instalação e Execução

### Android (dispositivo físico ou emulador)

```bash
cd App
npm install
npx expo run:android
```

> O comando compila o app e instala no dispositivo/emulador Android. Na **primeira execução**, o processo pode levar alguns minutos.

> **⚠️ Windows:** se o build falhar por caminho maior que 260 caracteres, consulte [`App/docs/BUILD_ANDROID_WINDOWS.md`](App/docs/BUILD_ANDROID_WINDOWS.md).

---

## 🔀 Fluxo de Desenvolvimento

Este projeto adota **Conventional Commits** com validação automática via **commitlint** e execução de lint a cada commit pelo hook do Husky.

### Criando uma nova branch

Sempre crie sua branch a partir da branch principal **`develop`**:

```bash
git checkout develop
git pull
git checkout -b tipo/descricao-curta
```

### Padrão de nomenclatura de branches

```
tipo/descricao-curta
```

| Tipo | Uso |
|---|---|
| `feat` | Nova funcionalidade |
| `fix` | Correção de bug |
| `docs` | Documentação |
| `refactor` | Refatoração sem mudança de comportamento |
| `chore` | Tarefas de manutenção |
| `test` | Testes |

**Exemplos:**

```
feat/login-com-biometria
fix/validacao-do-formulario
docs/guia-de-commit
refactor/auth-context
```

> Use nomes **curtos**, **objetivos** e em **letras minúsculas**, com palavras separadas por `-`. Evite nomes genéricos como `teste`, `alteracao` ou `novo`.

---

## 📝 Padrão de Commits

Formato:

```
tipo: mensagem objetiva
```

**Exemplos válidos:**

```bash
feat: criar tela de login
fix: corrigir validacao do botao
docs: adicionar guia de branches
refactor: simplificar auth context
```

> A mensagem de commit é validada automaticamente pelo hook **commit-msg** (commitlint) e o hook **pre-commit** executa `npm run lint` dentro da pasta `App`.

---

## 🔃 Pull Requests

Após finalizar suas alterações:

```bash
# Adicione os arquivos
git add .

# Crie o commit
git commit -m "tipo: descricao objetiva"

# Envie a branch
git push -u origin tipo/descricao-curta
```

Abra um **Pull Request** da sua branch para `develop`.

### Modelo de PR

| Campo | Exemplo |
|---|---|
| **Título** | `docs: adicionar guia de branches` |
| **Descrição** | Resumo das mudanças, impacto esperado e observações de validação |
| **Base** | `develop` |

---

## 📌 Resumo rápido

| Etapa | Padrão |
|---|---|
| Branch | `tipo/descricao-curta` |
| Commit | `tipo: mensagem objetiva` |
| Pull Request | Título curto, descrição clara, apontando para `develop` |

---

<div align="center">
  <sub>Desenvolvido com ❤️ pela equipe Total Fretes</sub>
</div>