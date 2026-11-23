# Itchy Lemon — website

Website oficial: https://itchylemon.com  
Código oficial: https://github.com/itchylemonbooking-ship-it/itchy-lemon

## Arquitetura

- **Astro (SSG)**: páginas HTML geradas no build; não existe um backend de aplicação nem uma base de dados própria.
- **Cloudflare Pages**: recebe os commits do GitHub, cria previews em branches e publica a `main`.
- **HubSpot**: formulários de Booking / Press Kit e carregamento do tracking HubSpot.
- **Meta Pixel**: componente próprio com preferência guardada em `localStorage`.
- **Notion**: contexto e registo de pedidos/publicações; consultar o Centro de Operações antes de alterar conteúdo.

## Trabalhar no projeto

Usar a versão Node indicada por `.node-version`. Na raiz:

```sh
npm ci
npm run build
node scripts/check-built-site.mjs
npm run preview
```

Os artefactos produzidos ficam em `dist/`. O script de auditoria verifica páginas essenciais, URLs canónicas, exclusão da Store dos motores de pesquisa e recursos internos referenciados nos HTML gerados.

## Publicar com segurança

1. Ler o estado da `main` e o pedido no Centro de Operações Notion.
2. Criar uma branch a partir da versão mais recente da `main`; não fazer push direto à `main`.
3. Aplicar a alteração mínima e abrir uma **Pull Request**.
4. Exigir dois checks verdes: **Build and smoke-test** e **Cloudflare Pages**.
5. Rever o diff e a pré-visualização (sobretudo quando há alterações a formulários, embeds ou tracking).
6. Fazer merge com squash. Confirmar **Cloudflare Pages = success** no novo commit da `main`.
7. Registar SHA, PR, testes e resultado no Notion.

Ruleset ativo: [ITCHY LEMON — Protect main](https://github.com/itchylemonbooking-ship-it/itchy-lemon/rules/27917610).

## Recuperação / rollback

- Para reverter alterações ao código, abrir uma nova branch com a reversão seletiva do commit relevante, criar PR e aguardar os checks obrigatórios.
- **Preservar sempre o workflow `.github/workflows/site-checks.yml`**. Eliminá-lo pode deixar de produzir o check obrigatório e impedir o merge de uma PR de recuperação.
- Em incidentes urgentes, verificar as opções de recuperação no painel Cloudflare Pages. Não afirmar que uma reversão foi testada sem a executar.
- Nunca colocar tokens, ficheiros `.env`, credenciais ou dados pessoais de formulários no repositório.

## Segurança e privacidade

- Os cabeçalhos HTTP configurados para o conteúdo estático estão em `public/_headers`.
- Os domínios `pages.dev` não devem competir com `itchylemon.com` na indexação.
- Eventos de conversão Meta exigem a preferência `itchyLemonMetaConsent = granted`.
- Callbacks legados HubSpot devem verificar origem e ID do formulário. O script HubSpot é uma integração externa: não o remover ou bloquear sem validar os formulários e o chat.
- Uma **CSP restritiva** e o consentimento abrangente de tracking HubSpot precisam de validação funcional/privacidade antes de alterações em produção.

## Manutenção pendente

O projeto ainda usa **Astro 4.16.18**. É uma versão antiga: planear uma migração major **numa PR isolada**, com atualização do `package-lock.json`, build e revisão funcional. O Dependabot propõe atualizações do npm e GitHub Actions por PR, sem merge automático.

Alterações visuais e editoriais só devem ser feitas por pedido específico. Não atualizar lançamentos da Discography sem autorização explícita.
