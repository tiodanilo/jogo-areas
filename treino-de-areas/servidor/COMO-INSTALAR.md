# Servidor do Treino de Áreas (Google Planilhas + Apps Script)

Guarda o progresso de cada aluno (moedas, nível, avatar, mundo) e monta o quadro de honra de todos. Fica na sua conta Google e é gratuito.

## Instalar (uma vez só)

1. Crie uma planilha nova em https://sheets.new e dê o nome **Treino de Áreas — alunos**.
2. Copie o ID da planilha (a parte do endereço entre `/d/` e `/edit`).
3. Abra https://script.google.com/create, apague o que estiver no editor, cole o conteúdo de `Code.gs`, troque o valor de `PLANILHA_ID` pelo ID copiado e clique em **Salvar**.
4. Clique em **Implantar → Nova implantação**.
   - Tipo: **App da Web**
   - Executar como: **Eu**
   - Quem pode acessar: **Qualquer pessoa**
5. Clique em **Implantar** e depois em **Autorizar acesso**. Escolha a sua conta e permita.
6. Copie o endereço que termina em `/exec`.
7. No arquivo `treino-de-areas/index.html`, troque a linha `const API='';` por `const API='COLE_O_ENDERECO_AQUI';` e envie para o GitHub.

## Cuidar da planilha

- Cada aluno é uma linha da aba **jogadores**. A coluna **publico** é o nome que aparece no quadro (primeiro nome e inicial do sobrenome).
- Para tirar alguém do quadro de honra, apague a linha da pessoa.
- Se um aluno esquecer a senha de figuras, apague a linha dele: ele cria a conta de novo e começa do zero.
- As senhas não ficam legíveis na planilha (são guardadas embaralhadas).

## Se mudar o código depois

Em **Implantar → Gerenciar implantações**, edite a implantação e escolha **Nova versão**. O endereço `/exec` continua o mesmo.
