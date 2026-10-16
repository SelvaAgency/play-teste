# play-teste

Prévia gratuita do Diagnóstico da Trilha IA Aplicada (Play by Scaffold): um site estático com 9 questões, uma por competência.

## Rodar localmente

```bash
python3 -m http.server 8000
# abrir http://localhost:8000
```

## Estrutura

- `index.html`: telas de introdução, quiz e resultado
- `css/styles.css`: estilos, com a paleta e as fontes do scaffoldplay.com.br
- `js/questions.js`: as 9 questões (a Intermediária de cada competência, da planilha v3 FINAL) e os feedbacks por alternativa
- `js/app.js`: fluxo do quiz, resultado e revisão. `FULL_TEST_URL` é o link do CTA para o diagnóstico completo.
- `assets/`: logo e favicon do Play

## Deploy

São só arquivos estáticos, então funciona em qualquer host (Vercel, Netlify, Cloudflare Pages, GitHub Pages, S3) sem build.
