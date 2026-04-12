# Code review – Total Fretes (App)

Documento gerado a partir do plano de revisão. Classificação: **Problema** | **Atenção** | **Sugestão**.

---

## 1. Resumo geral

O app mantém **boa separação** entre screens, hooks por domínio (`auth`, `user`, `freight`, `vehicle`, `weather`), `services/http` e `interfaces/`. Os principais riscos são **timeout curto de rede**, **tipagem frouxa em alguns inputs**, **duplicação de tratamento de erro Axios** nos hooks e **interfaces de freight** historicamente permissivas (muitos opcionais).

---

## 2. Hooks (~20 arquivos)

| Classificação | Item | Impacto |
|---------------|------|--------|
| **Atenção** | `http` com `timeout: 3000` ([`services/http.ts`](../src/services/http.ts)) | Requisições lentas (3G, cold start) podem falhar sem ser erro de API. Sugestão: 15–30s ou por rota. |
| **Atenção** | Padrão repetido: `catch` + `(error as AxiosError).response?.data?.message` | Manutenção duplicada; opcional helper `getApiErrorMessage` ou interceptor que normalize `message`. |
| **Sugestão** | Dependências de `useCallback` | Revisar arrays de deps quando incluir `notify`/`navigation` estáveis; evitar omitir deps reais. |
| **Sugestão** | `useGetUser` depende de `id` do contexto | Após login, preferir busca explícita por id (como em `useLogin` + `fetchUserAvatarUrl`) quando ordem de render importar. |
| **Positivo** | Login + conta salva + avatar desacoplado | [`userAvatarUrl.ts`](../src/services/userAvatarUrl.ts) deixa o fluxo claro. |

---

## 3. Contexts

| Classificação | Item | Impacto |
|---------------|------|--------|
| **Atenção** | `AuthProvider` + biometria | Com biometria ligada, token pode não estar em memória até prompt; fluxo em [`useStartScreen`](../src/hooks/auth/useStartScreen.ts) está alinhado. |
| **Sugestão** | JSDoc redundante (`@description` + `@returns` iguais ao nome) | Removido/normalizado no provider (ver Fase 3 do plano). |
| **Positivo** | `ThemeContext` / `AlertDefaultContext` | Responsabilidades bem localizadas. |

---

## 4. HTTP ([`http.ts`](../src/services/http.ts))

| Classificação | Item | Impacto |
|---------------|------|--------|
| **Atenção** | `(config.headers as any)` | Perde type-safety; aceitável até tipar `InternalAxiosRequestConfig` com index signature ou cast para `AxiosRequestHeaders`. |
| **Positivo** | Interceptor 401 → `clearAuthToken` | Comportamento esperado para sessão inválida. |
| **Sugestão** | Log de 403 já existe | Útil para depuração de rotas autorizadas. |

---

## 5. Componentes de formulário

| Classificação | Item | Impacto |
|---------------|------|--------|
| **Sugestão** | Inputs (`inputShared`) | `control`/`name` genéricos (`InputBaseProps<T>`); `rules` como `object` para evitar atrito com `Validate<>`. |
| **Positivo** | Inputs mascarados (CPF, placa, telefone) | Reuso via [`inputShared.ts`](../src/components/form/inputs/inputShared.ts). |

---

## 6. Interfaces vs API

| Classificação | Item | Impacto |
|---------------|------|--------|
| **Atenção** | `freight.ts`: tipos aninhados muito opcionais | Reflete includes Sequelize; documentado no arquivo; `birth_date` como `string` alinhado a JSON. |
| **Atenção** | `MapUser.CnhType` | Opcional se include falhar. |
| **Sugestão** | Manter `types/api.ts` para payloads POST | Evitar duplicar mesmo shape em `interfaces/` sem necessidade. |

---

## 7. Segurança e confiabilidade

- Tokens em SecureStore; biometria opcional antes de ler token.
- Senha só em trânsito no login (HTTPS em produção obrigatório).
- **Sugestão**: não logar tokens ou bodies em produção.

---

## 8. Conclusão

**Aprovação com ressalvas**: arquitetura coerente para TCC; priorizar timeout HTTP e, se possível, centralizar mensagens de erro. Interfaces foram alinhadas incrementalmente (freight, user, vehicle, profile) sem big-bang.

---

## 9. Referência de pastas

```
src/
  hooks/     auth | user | freight | vehicle | weather
  interfaces/  user | freight | vehicle | profile | mapbox
  services/    http | userAvatarUrl | userImageUpload | location
  context/     Auth | Theme | Alert | RegisterVehicle | SingUp
```
