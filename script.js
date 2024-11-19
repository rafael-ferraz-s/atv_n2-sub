const ws = new WebSocket('ws://localhost:8080');
const commentsList = document.getElementById('commentsList');
const commentInput = document.getElementById('commentInput');
const sendCommentButton = document.getElementById('sendCommentButton');

// Conexão WebSocket
ws.onopen = () => console.log('Conectado ao servidor WebSocket');
ws.onmessage = (event) => {
  try {
    const data = JSON.parse(event.data);
    if (data) {
      console.log(data);
      
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
    const count = parseInt(likeButton.textContent.split(' ')[1]) + 1;
    likeButton.textContent = `👍 ${count}`;
  });

  const dislikeButton = document.createElement('button');
  dislikeButton.textContent = '👎 0';
  dislikeButton.addEventListener('click', () => {
    const count = parseInt(dislikeButton.textContent.split(' ')[1]) + 1;
    dislikeButton.textContent = `👎 ${count}`;
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

ws.onclose = () => console.log('Conexão fechada com o servidor');
