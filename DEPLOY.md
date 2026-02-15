# Como Colocar Seu Projeto Online (Sinfonia CCB)

Este projeto está pronto para ser implantado na web. Como agora utilizamos o **Supabase** como banco de dados, você precisará configurar as variáveis de ambiente.

## Opção 1: Implantação Automática via Vercel (Recomendado)

Esta é a maneira recomendada para que suas atualizações futuras sejam implantadas automaticamente.

1.  Garanta que seu código esteja em um repositório no GitHub.
2.  Crie uma conta na [Vercel](https://vercel.com/).
3.  Clique em **"Add New Project"** e selecione o repositório do seu projeto.
4.  **IMPORTANTE (Variáveis de Ambiente):** Na tela de configuração, procure a seção **"Environment Variables"** e adicione:
    *   `VITE_SUPABASE_URL`: (Sua URL do Supabase)
    *   `VITE_SUPABASE_ANON_KEY`: (Sua Chave Anon do Supabase)
    *   Você encontra esses dados nas configurações do seu projeto Supabase (API Settings).
5.  A Vercel detectará automaticamente que é um projeto **Vite**. Clique em **"Deploy"**.

## Opção 2: Tratamento de Rotas
O arquivo `vercel.json` já está incluído no projeto para garantir que as rotas do React funcionem corretamente (evitando erros 404 ao atualizar a página).

## Dica sobre o Banco de Dados
Como o projeto utiliza o Supabase, os dados não se perdem ao atualizar o site. Eles estão seguros na nuvem!

---
*Sistema de Gestão Musical Sinfonia CCB*
