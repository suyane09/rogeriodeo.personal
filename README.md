# Rogério Déo · Personal Trainer

Site de uma página (landing) do personal trainer Rogério Déo. React 18 + Vite 5.

## Rodar localmente

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # gera a pasta dist/
npm run preview    # testa o build
```

## Onde editar

| O quê | Onde |
|---|---|
| Telefone / WhatsApp | `PHONE` e `PHONE_LABEL` no topo de `src/App.jsx` |
| Textos (problemas, método, FAQ, esportes) | listas `problems`, `method`, `faq`, `sports`, `forYou` em `src/App.jsx` |
| Cores e fontes | variáveis `:root` em `src/styles.css` |
| Depoimentos | componente `Results` em `src/App.jsx` (ainda não renderizado; ver abaixo) |

## Imagens

Ficam em `public/img/` no formato WebP, em vários tamanhos (`-400`, `-800`, `-1333`) para `srcset`.
Para trocar uma foto, gere as versões novas mantendo os mesmos nomes. `og.jpg` (1200×630) é a imagem
do preview no WhatsApp/Instagram e precisa continuar em JPG.

## Antes de publicar

Troque `https://SEU-DOMINIO.com.br` pelo domínio real em:

- `index.html` (canonical, `og:url`, `og:image`)
- `public/robots.txt`
- `public/sitemap.xml`

Depois teste o preview em <https://www.opengraph.xyz> e envie o `sitemap.xml` no Google Search Console.

## Pendências

- [ ] Depoimentos reais: preencher `Results` e incluir `<Results />` no `App` (entre `Gallery` e `ForYouFaq`).
- [ ] Informar cidade/bairro de atendimento no texto e adicionar schema JSON-LD `LocalBusiness`.
- [ ] Medir cliques no WhatsApp (Plausible ou GA4).

## Deploy

Vercel ou Netlify: build `npm run build`, saída `dist`.
