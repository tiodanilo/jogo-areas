# Áreas do Tio Danilo

Jogo de cálculo de áreas de figuras planas para o 4º ao 9º ano, do site [tiodanilo.com.br](https://www.tiodanilo.com.br).

O aluno escreve o nome, escolhe o ano e as figuras, e responde perguntas de área. Cada acerto vale moedas, que ele troca por itens para o avatar. Os níveis não têm fim.

## Como funciona

- **Tela inicial**: nome, ano (4º ao 9º), figuras e quantidade de perguntas (5, 10, 15 ou 20).
- **Figuras**: quadrado, retângulo, triângulo, paralelogramo, trapézio, losango, círculo (π = 3,14) e figura composta (retângulo + triângulo).
- **Modos**:
  - Fácil: 4 alternativas, 5 moedas por acerto. As alternativas erradas são os erros mais comuns (perímetro, esquecer o ÷ 2, usar o diâmetro no lugar do raio).
  - Difícil: o aluno digita a resposta, 10 moedas por acerto.
- **Números por ano**: crescem com o ano; decimais a partir do 8º ano.
- **Problemas do dia a dia**: pizza, pipa, bandeirinha de festa junina, terreno, canteiro.
- **Resolução passo a passo** depois de cada resposta, certa ou errada.
- **Sequência**: a partir de 3 acertos seguidos, moedas de bônus.

## Avatar e níveis

- **Loja** com 29 itens: roupas, chapéus, acessórios, veículos (do skate ao foguete), bichinhos e cenários. Tom de pele, cabelo e penteado são grátis.
- **Níveis infinitos**: cada nível pede um pouco mais de XP. Títulos de Aprendiz a Lenda Geométrica e um troféu a cada 5 níveis.
- **Menino ou menina**, escolhido ao criar a conta, com 3 penteados para cada um.
- **Meu mundo**: um terreno quadriculado em que cada quadradinho vale 1 m². O aluno gasta moedas em construções (árvore 1 m², casa 2 × 2 = 4 m², piscina 3 × 2 = 6 m², quadra 4 × 3 = 12 m², castelo 4 × 4 = 16 m²…) e pode aumentar o terreno a 12 moedas por m².
- **Quadro de honra de todos** que jogam no site, em "Todos" ou "Meu ano", com primeiro nome e inicial do sobrenome.

## Onde fica o progresso

- Com o servidor instalado (pasta `servidor/`), o aluno entra com **nome + ano + senha de 4 figuras** e o progresso fica numa planilha Google. Funciona em qualquer computador.
- Sem o servidor (`const API='';`), o progresso fica só no navegador daquele aparelho.
- Duas abas abertas ao mesmo tempo nunca apagam o progresso uma da outra: vale sempre o perfil com mais XP.

## Lista de exercícios em PDF

Para o professor: escolhe ano, figuras e quantidade (6 a 24), e baixa uma folha A4 com espaço para nome, turma e data, fórmulas no cabeçalho e gabarito com resolução no final. "Sortear novos números" gera outra versão da mesma lista.

## Abrir já no ano certo

Acrescente `?ano=` ao endereço para abrir com o ano e as figuras daquele ano marcados:

- 6º ano: `https://tiodanilo.github.io/jogo-areas/treino-de-areas/?ano=6`
- 7º ano: `https://tiodanilo.github.io/jogo-areas/treino-de-areas/?ano=7`
- 8º ano: `https://tiodanilo.github.io/jogo-areas/treino-de-areas/?ano=8`
- 9º ano: `https://tiodanilo.github.io/jogo-areas/treino-de-areas/?ano=9`

Dentro do Google Sites aparece o botão **Abrir em tela cheia**, porque alguns navegadores bloqueiam o download do PDF dentro de páginas incorporadas.

## Tecnologia

Um único `index.html`, sem instalação. Usa Google Fonts (Baloo 2 e Nunito) e [jsPDF](https://github.com/parallax/jsPDF) 2.5.1 pelo cdnjs para gerar o PDF.
