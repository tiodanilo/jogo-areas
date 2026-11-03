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
- **Quadro de honra** com os melhores jogadores do aparelho.
- O progresso fica salvo no navegador (localStorage), pelo nome do aluno.

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
