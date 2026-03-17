# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  # Venture Website

  Frontend institucional da Venture em React, TypeScript e Vite, com WordPress atuando como CMS headless.

  ## Scripts

  ```bash
  npm install
  npm run dev
  npm run build
  npm run lint
  npm run preview
  ```

  ## WordPress

  O projeto consome a API REST do WordPress em `/wp-json`.

  - Em desenvolvimento local, o Vite usa proxy para `https://venture.com.br`.
  - Para isso, `VITE_WP_BASE_URL` deve ficar vazio em `.env`.
  - Em produção no mesmo domínio do WordPress, a mesma configuração continua válida.
  - Se o frontend for publicado em outro domínio, defina `VITE_WP_BASE_URL` explicitamente e ajuste CORS no servidor WordPress.

  ## Rotas

  - `/` home com âncoras e animações GSAP
  - `/insights` listagem de publicações
  - `/insights/:slug` detalhe de publicação
  - `/cases` listagem de cases
  - `/cases/:slug` detalhe de case
  - `/servicos` listagem de serviços
  - `/servicos/:slug` detalhe de serviço
  - `/parceiros` listagem de parceiros
  - `/parceiros/:slug` detalhe de parceiro

  ## Deploy Estático

  O projeto usa `BrowserRouter`, então o host precisa responder `index.html` para rotas internas.

  Arquivos incluídos no repositório:

  - `public/_redirects` para hosts compatíveis com a sintaxe do Netlify
  - `vercel.json` para rewrite em deploys Vercel

  Se o deploy for em outro provedor, configure um rewrite equivalente para todas as rotas não-arquivo apontarem para `/index.html`.
      parserOptions: {
