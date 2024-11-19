let totalLikes = 0;

onmessage = (event) => {
  const feedback = event.data;
  totalLikes = feedback.likes;
  postMessage({ totalLikes });
};
