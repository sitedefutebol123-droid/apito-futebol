// Adicione novos quizzes aqui. Cada quiz tem um título e uma lista de perguntas.
// "correct" é o índice (começando em 0) da resposta certa dentro de "options".
//
// Exemplo pra copiar e criar um quiz novo:
// {
//   title: "Nome do quiz",
//   questions: [
//     { q: "Pergunta?", options: ["Opção A", "Opção B", "Opção C"], correct: 1 }
//   ]
// }

const QUIZZES = [
  {
    title: "Você conhece o Brasileirão?",
    questions: [
      {
        q: "Quantos times disputam a Série A do Brasileirão?",
        options: ["18", "20", "22"],
        correct: 1,
      },
      {
        q: "Qual time tem mais títulos do Brasileirão (era de pontos corridos)?",
        options: ["Corinthians", "Palmeiras", "Flamengo"],
        correct: 1,
      },
      {
        q: "Quantos pontos vale uma vitória?",
        options: ["2", "3", "5"],
        correct: 1,
      },
    ],
  },
  {
    title: "Copa do Mundo — básico",
    questions: [
      {
        q: "Qual seleção tem mais títulos de Copa do Mundo?",
        options: ["Alemanha", "Brasil", "Argentina"],
        correct: 1,
      },
      {
        q: "De quanto em quanto tempo acontece a Copa do Mundo?",
        options: ["2 anos", "3 anos", "4 anos"],
        correct: 2,
      },
    ],
  },
];
