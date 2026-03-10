# Fluxo: Projeção no carro (Android Auto)

Este documento descreve o fluxo que o motorista deve seguir para usar a projeção do app no painel do carro (Android Auto) e como o sistema funciona.

## Como funciona (Remote Control Pattern)

- **Celular (handheld):** unidade de entrada e controle. O motorista usa o app no celular para aceitar fretes, ver mapa, filtros e detalhes.
- **Tela do carro:** unidade de saída otimizada para direção. Mostra apenas dados essenciais do frete (destino, valor, origem) em formato legível, sem necessidade de tocar na tela do carro.

O app não espelha a tela do celular. Ele projeta um **template** no Android Auto com as informações do frete em andamento. O estado é compartilhado: ao alterar algo no celular (por exemplo, ao iniciar um frete), a tela do carro atualiza automaticamente.

---

## Fluxo ao entrar no carro

1. **Conectar o celular ao carro**  
   Via cabo USB ou Android Auto sem fio, conforme o veículo.

2. **Abrir o app no celular**  
   Fazer login se ainda não estiver autenticado.

3. **Ter um frete para exibir**  
   - Com frete real: o app sincroniza o frete em andamento e a tela do carro mostra destino, valor e origem.  
   - Para teste sem API: em **Perfil → Opções avançadas**, toque em **Iniciar frete de teste**. O template no carro passará a exibir dados de um frete simulado.

4. **No celular**  
   Use o mapa e as telas normalmente (iniciar rota, ver detalhes, etc.). Toda interação é feita no celular.

5. **No carro**  
   Apenas **visualize** os dados do frete (destino, valor, origem) na tela projetada. Não é necessário tocar no painel para funções complexas.

---

## Encerrar frete de teste

Se você ativou **Iniciar frete de teste**, para voltar ao estado sem frete projetado: **Perfil → Opções avançadas → Encerrar frete de teste**.

---

## Requisitos técnicos

- Android com Android Auto (app instalado).
- Após alterações na configuração do plugin (por exemplo, em `app.json`), executar:
  - `npx expo prebuild --clean --platform android`
  - `npx expo run:android`

## Testes

Para validar a projeção sem estar no carro, use o **Desktop Head Unit (DHU)** do Android Auto ou um emulador/device com Android Auto configurado.
