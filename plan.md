## Plan: Páginas internas com conteúdo WP

Substituir os redirecionamentos para o site antigo por páginas internas no front novo, mantendo o WordPress apenas como fonte de conteúdo via API. A abordagem recomendada é adicionar roteamento real no app, criar templates internos para detail/listing e consumir do WordPress apenas texto, título, imagem principal e metadados mínimos. Para UX e consistência visual, isso é claramente melhor do que seguir abrindo o site antigo; para SEO, o ideal é já nascer com URLs internas e metadados, sabendo que uma SPA Vite terá SEO aceitável mas inferior a SSR/pré-render.

**Steps**
1. Introduzir infraestrutura de rotas no frontend com uma camada de layout compartilhado para manter a navegação consistente entre home e páginas internas. Isso bloqueia os passos seguintes porque os links atuais são baseados em âncoras na home.
2. Extrair a home atual para uma página própria e preservar o comportamento de scroll interno nela, sem misturar lógica de âncora com as futuras rotas de detalhe. Isso depende do passo 1.
3. Expandir a camada de tipos e integração com WordPress para suportar conteúdo de página completa, não só cards/resumos. Incluir no modelo normalizado campos para slug, título, categoria/tipo, imagem, conteúdo textual limpo, resumo, data e eventualmente breadcrumbs simples. Isso pode começar em paralelo com o passo 2 após a definição das rotas.
4. Criar uma estratégia única de resolução de conteúdo por tipo. Recomendação: mapear categorias ou slugs do WordPress para quatro áreas do site novo: insights/publicações, cases, serviços e parceiros. Definir quais endpoints e filtros do WP alimentam listagens e quais alimentam páginas de detalhe. Isso depende do passo 3.
5. Implementar hooks/queries para listagem e detalhe por slug. Reaproveitar o cliente atual do WordPress, mas separar responsabilidades: hooks de teaser/card continuam leves e hooks de detail buscam conteúdo completo. Isso depende dos passos 3 e 4.
6. Criar templates internos para cada família de página. Recomendação: um template compartilhado de detail com variações leves por tipo, em vez de quatro implementações totalmente independentes. O conteúdo deve ser renderizado como texto estruturado do front novo, sem despejar o HTML legado bruto. Isso depende dos passos 1, 3 e 5.
7. Refatorar a home para que cards e CTAs passem a apontar para rotas internas do novo site em vez de usar post.link do WordPress. Isso depende dos passos 1, 4 e 5.
8. Ajustar navegação principal e footer para coexistirem com dois comportamentos: âncoras na home e navegação por rota nas páginas internas. O logo deve sempre levar para a home; links de seções devem voltar para a home com hash quando o usuário estiver fora dela. Isso depende dos passos 1 e 2.
9. Adicionar metadados mínimos por rota. Recomendação: title, description, canonical e Open Graph básico para detail pages. Em SPA isso já melhora compartilhamento e organização, embora o melhor SEO orgânico ainda dependa de SSR ou pré-render futuro. Isso pode ocorrer em paralelo com o passo 6.
10. Definir fallback e resiliência: loading, erro e conteúdo ausente para slugs inexistentes, falha de API e posts sem imagem. Isso depende dos passos 5 e 6.
11. Validar navegação, consistência visual e conteúdo em desktop/mobile. Confirmar que a home continua com scroll/animações e que páginas internas não quebram o comportamento do GSAP. Isso depende dos passos anteriores.
12. Como evolução opcional, avaliar SEO forte com pré-render ou migração para framework com SSR/SSG. Isso fica explicitamente fora do escopo inicial, mas deve ser considerado se orgânico for prioridade comercial.

**Relevant files**
- `c:/Users/Marcos/Desktop/venture-website/src/App.tsx` — hoje concentra a SPA inteira; deve virar casca de rotas/layout.
- `c:/Users/Marcos/Desktop/venture-website/src/main.tsx` — ponto de entrada para registrar provedor de roteamento e metadados.
- `c:/Users/Marcos/Desktop/venture-website/src/components/Navigation.tsx` — hoje só entende âncoras; precisará suportar home vs páginas internas.
- `c:/Users/Marcos/Desktop/venture-website/src/sections/FooterSection.tsx` — alinhar links com a nova navegação e futuras páginas.
- `c:/Users/Marcos/Desktop/venture-website/src/lib/wordpress.ts` — reutilizar cliente atual para queries de detalhe/listagem.
- `c:/Users/Marcos/Desktop/venture-website/src/types/wordpress.ts` — ampliar modelos WP e normalizados para conteúdo completo.
- `c:/Users/Marcos/Desktop/venture-website/src/hooks/useInsights.ts` — manter para teaser/listagem e/ou extrair utilitários de normalização.
- `c:/Users/Marcos/Desktop/venture-website/src/hooks/useCases.ts` — remover dependência de post.link e de mapeamentos excessivamente manuais onde possível.
- `c:/Users/Marcos/Desktop/venture-website/src/hooks/usePartners.ts` — adaptar para suportar rota própria, se parceiros entrarem nesta fase.
- `c:/Users/Marcos/Desktop/venture-website/src/sections/InsightsSection.tsx` — trocar links externos por rotas internas.
- `c:/Users/Marcos/Desktop/venture-website/src/sections/CaseValeSection.tsx` — trocar CTA externo por rota interna.
- `c:/Users/Marcos/Desktop/venture-website/src/sections/CaseAngloSection.tsx` — trocar CTA externo por rota interna.
- `c:/Users/Marcos/Desktop/venture-website/src/sections/CapabilitiesSection.tsx` — conectar serviços a páginas internas se esta área entrar agora.
- `c:/Users/Marcos/Desktop/venture-website/src/pages/` — nova pasta recomendada para home, listagens e detail pages.
- `c:/Users/Marcos/Desktop/venture-website/src/components/content/` — pasta recomendada para blocos reutilizáveis de hero, metadata, rich text simplificado, related content e breadcrumbs.

**Verification**
1. Validar que home continua funcional com scroll para `#capabilities`, `#cases`, `#insights` e `#contact`.
2. Validar que cards/CTAs de cases, insights, serviços e parceiros abrem rotas internas do domínio novo, sem `target="_blank"` para o site antigo.
3. Testar carregamento por slug diretamente na URL e refresh do navegador em rotas internas.
4. Testar estados de loading, erro e not found para slugs inexistentes ou API indisponível.
5. Validar que conteúdo textual vindo do WordPress aparece limpo e consistente, sem quebrar o layout com HTML legado.
6. Rodar lint e build do projeto após a implementação.
7. Revisar título/meta por rota e compartilhamento básico de uma página interna.
8. Validar comportamento em mobile e desktop, inclusive retorno da página interna para a home.

**Decisions**
- Incluído no escopo inicial: pages internas para cases, insights/publicações, serviços e parceiros, usando WordPress como CMS headless.
- Incluído no escopo inicial: reaproveitar somente texto e mídia essencial do WordPress; o layout será reconstruído no front novo.
- Recomendação para URLs: usar rotas reais desde já (`/insights/:slug`, `/cases/:slug`, `/servicos/:slug`, `/parceiros/:slug`) em vez de modal, hash routing ou redirecionamento externo.
- Recomendação para SEO agora: metadata por rota em SPA. Melhor que o estado atual, mas sem prometer SEO máximo.
- Fora do escopo inicial: SSR/SSG, migração de stack, remodelagem editorial profunda do conteúdo e reestruturação do WordPress.

**Further Considerations**
1. Se o WordPress não tiver categorias/taxonomias consistentes para serviços e parceiros, será preciso definir uma convenção de slugs/categorias ou um mapeamento temporário no front.
2. Se algumas páginas do site antigo tiverem formatação rica importante, pode valer um modo híbrido: extrair texto principal e manter poucos elementos permitidos como listas, subtítulos e imagens.
3. Se SEO orgânico for prioridade de aquisição, planejar uma segunda etapa com pré-render ou SSR depois da consolidação das rotas internas.
