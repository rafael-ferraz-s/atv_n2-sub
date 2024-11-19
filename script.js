const commentWorker = new Worker('worker.js');
const likeWorker = new Worker('likeWorker.js');
const dislikeWorker = new Worker('deslikeWorker.js');

// Variáveis para armazenar os dados de curtidas, descurtidas e análise de comentários
let totalLikes = 0;
let totalDislikes = 0;
let positiveComments = 0;
let negativeComments = 0;
let neutralComments = 0;

// WebSocket
const ws = new WebSocket('ws://localhost:8080');
const commentsList = document.getElementById('commentsList');
const commentInput = document.getElementById('commentInput');
const sendCommentButton = document.getElementById('sendCommentButton');
const generateReportButton = document.getElementById('generateReportButton');
const reportSection = document.getElementById('reportSection');

// Conexão WebSocket
ws.onopen = () => console.log('Conectado ao servidor WebSocket');
ws.onmessage = (event) => {
  try {
    const data = JSON.parse(event.data);
    if (data) {
      console.log(data);

      // Envia os comentários para o worker de análise
      commentWorker.postMessage({ comments: [data.comment] });

      addCommentToDOM(data.comment);
    }
  } catch (error) {
    console.error('Erro ao processar a mensagem recebida:', error);
  }
};

// Adiciona comentário no DOM com botões de curtida/descurtida
function addCommentToDOM(commentText) {
  const newComment = document.createElement('li');

  // Texto do comentário
  const textSpan = document.createElement('span');
  textSpan.textContent = commentText;

  // Botões de curtida/descurtida
  const buttons = document.createElement('div');
  buttons.className = 'buttons';

  const likeButton = document.createElement('button');
  likeButton.textContent = '👍 0';
  likeButton.addEventListener('click', () => {
    const likes = parseInt(likeButton.textContent.split(' ')[1]) + 1;
    likeButton.textContent = `👍 ${likes}`;

    // Envia feedback para o worker de curtidas
    likeWorker.postMessage({ likes });
  });

  const dislikeButton = document.createElement('button');
  dislikeButton.textContent = '👎 0';
  dislikeButton.addEventListener('click', () => {
    const dislikes = parseInt(dislikeButton.textContent.split(' ')[1]) + 1;
    dislikeButton.textContent = `👎 ${dislikes}`;

    // Envia feedback para o worker de descurtidas
    dislikeWorker.postMessage({ dislikes });
  });

  buttons.appendChild(likeButton);
  buttons.appendChild(dislikeButton);

  // Adiciona texto e botões ao comentário
  newComment.appendChild(textSpan);
  newComment.appendChild(buttons);

  // Adiciona comentário à lista
  commentsList.appendChild(newComment);
}

// Envia o comentário ao servidor WebSocket
sendCommentButton.addEventListener('click', () => {
  const comment = commentInput.value.trim();
  if (comment) {
    ws.send(JSON.stringify({ comment })); // Envia o comentário para o servidor
    commentInput.value = '';
  }
});

// Escuta as mensagens do worker de análise
commentWorker.onmessage = (event) => {
  const analysis = event.data;
  positiveComments += analysis.filter((item) => item === 'positivo').length;
  negativeComments += analysis.filter((item) => item === 'negativo').length;
  neutralComments += analysis.filter((item) => item === 'neutro').length;
};

// Escuta as mensagens do worker de curtidas
likeWorker.onmessage = (event) => {
  totalLikes = event.data.totalLikes;
};

// Escuta as mensagens do worker de descurtidas
dislikeWorker.onmessage = (event) => {
  totalDislikes = event.data.totalDislikes;
};

// Gera o relatório quando o botão for clicado
generateReportButton.addEventListener('click', () => {
  const report = `
    <h3>Relatório de Comentários:</h3>
    <p><strong>Total de Curtidas:</strong> ${totalLikes}</p>
    <p><strong>Total de Descurtidas:</strong> ${totalDislikes}</p>
    <p><strong>Total de Comentários Positivos:</strong> ${positiveComments}</p>
    <p><strong>Total de Comentários Negativos:</strong> ${negativeComments}</p>
    <p><strong>Total de Comentários Neutros:</strong> ${neutralComments}</p>
  `;

  reportSection.innerHTML = report;
});

ws.onclose = () => console.log('Conexão fechada com o servidor');
