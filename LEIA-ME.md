# Apito — como publicar de graça

## 1. Pegue sua chave gratuita de dados
1. Acesse https://www.football-data.org/client/register e crie uma conta grátis.
2. Depois de confirmar o e-mail, copie o **token/API key** que aparece no seu painel.

## 2. Suba os arquivos para o GitHub (gratuito)
1. Crie uma conta em https://github.com (grátis).
2. Clique em "New repository", dê um nome (ex: `apito-futebol`) e crie.
3. Na página do repositório, clique em "Add file" → "Upload files" e arraste
   TODOS os arquivos desta pasta, mantendo a estrutura de pastas
   (incluindo a pasta `netlify` com o arquivo `functions/football.js` dentro).
4. Clique em "Commit changes".

## 3. Publique na Netlify (gratuito)
1. Crie uma conta em https://app.netlify.com (pode entrar direto com o GitHub).
2. Clique em "Add new site" → "Import an existing project" → escolha GitHub
   → selecione o repositório que você acabou de criar.
3. Deixe as configurações padrão e clique em "Deploy site".

## 4. Adicione sua chave sem expor ela no site
1. No painel do site na Netlify, vá em **Site configuration → Environment variables**.
2. Clique em "Add a variable", nome: `FOOTBALL_API_KEY`, valor: a chave que você
   copiou no passo 1.
3. Vá em "Deploys" e clique em "Trigger deploy" → "Deploy site" para aplicar.

Pronto — em 1 ou 2 minutos seu site estará no ar, em um link tipo
`https://seu-site.netlify.app`, sem custo nenhum, nem para publicar.

## Limites do plano grátis (bom saber)
- football-data.org: 10 requisições por minuto — suficiente para uso pessoal
  e para mostrar a amigos, mas não aguenta muito tráfego ao mesmo tempo.
- Netlify: generoso o bastante para um site pessoal (100GB de banda/mês).

## 5. Ativar anúncios (Google AdSense)
1. Crie uma conta em https://adsense.google.com (grátis) e cadastre seu site.
2. A aprovação pode levar dias/semanas e exige conteúdo original — o site já
   tem espaços reservados (`<div class="ad-slot">`) prontos para receber o
   código.
3. Quando aprovado, o Google te dá um trecho de código por anúncio. Cole cada
   trecho dentro do `<div class="ad-slot" ...>` correspondente no `index.html`,
   substituindo o texto de aviso.
4. Os anúncios somem automaticamente para quem é Premium.

## 6. Ativar o modo Premium (pagamento real via Stripe)
Sem custo fixo — a Stripe só cobra uma taxa (por volta de 4% + R$0,39) quando
alguém efetivamente paga.

1. Crie uma conta em https://dashboard.stripe.com/register (grátis).
2. No painel, vá em **Payment links** → "Create payment link".
3. Crie um produto "Apito Premium", preço R$4,90 (ou o valor que quiser),
   recorrência mensal se quiser assinatura.
4. Em "After payment", configure redirecionar para:
   `https://SEU-SITE.netlify.app/?session_id={CHECKOUT_SESSION_ID}`
5. Copie o link gerado e cole no `index.html`, na linha:
   `const STRIPE_PAYMENT_LINK = "https://buy.stripe.com/SEU_LINK_AQUI";`
6. No painel da Stripe, vá em **Developers → API keys** e copie a
   **Secret key**.
7. Na Netlify, adicione outra variável de ambiente: nome `STRIPE_SECRET_KEY`,
   valor a chave secreta. Faça um novo deploy.

Como funciona: a pessoa clica em "Assinar Premium", paga na Stripe, e volta
pro site. O site então pergunta pro servidor "esse pagamento foi confirmado?"
antes de liberar — assim ninguém libera premium só editando o link.

⚠️ Isso libera o Premium *naquele navegador* (via localStorage). Para controle
completo (ex: premium por conta de usuário, em qualquer aparelho), seria
necessário um sistema de login — dá pra evoluir depois, mas já é o suficiente
para começar a cobrar hoje.

## Quer editar depois?
- Cores, textos e o nome do site: tudo está no arquivo `index.html`
  (procure a palavra "APITO" para trocar o nome).
- Para adicionar mais campeonatos, edite a lista `COMPETITIONS` no topo do
  `<script>` — os códigos de outras ligas estão na documentação da API:
  https://docs.football-data.org/general/v4/competitions.html
