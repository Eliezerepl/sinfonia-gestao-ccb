# Como Colocar Seu Projeto Online

Este projeto está pronto para ser implantado na web. Aqui estão duas maneiras rápidas de colocá-lo online:

## Opção 1: Implantação Automática via GitHub (Recomendado)

Esta é a maneira profissional e garante que suas atualizações futuras sejam implantadas automaticamente.

1.  Crie um novo repositório no [GitHub](https://github.com/new).
2.  Copie a URL do seu repositório (ex: `https://github.com/seu-usuario/sinfonia-gestao.git`).
3.  No seu terminal, execute:
    ```bash
    git remote add origin <URL_DO_SEU_REPOSITORIO>
    git branch -M main
    git push -u origin main
    ```
4.  Crie uma conta na [Vercel](https://vercel.com/) ou [Netlify](https://www.netlify.com/).
5.  Clique em "Add New Project" e selecione "Import Git Repository".
6.  Escolha o repositório que você acabou de criar.
7.  As configurações padrão (Framework Preset: Vite) devem funcionar automaticamente. Clique em "Deploy".

## Opção 2: Implantação Manual (Rápida)

Se você quiser ver o site online agora mesmo sem configurar o GitHub:

1.  Localize o arquivo `dist.zip` na pasta `GEM` na sua área de trabalho.
2.  Acesse [Netlify Drop](https://app.netlify.com/drop).
3.  Arraste o arquivo `dist.zip` (ou a pasta `dist` descompactada) para a área indicada na página.
4.  Seu site estará online em segundos!

> **Nota:** Seu projeto não usa backend (banco de dados no servidor), então ele funcionará perfeitamente nestes serviços de hospedagem estática.
