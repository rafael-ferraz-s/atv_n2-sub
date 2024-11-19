let totalDislikes = 0;

onmessage = (event) => {
  const feedback = event.data;
  totalDislikes = feedback.dislikes;
  postMessage({ totalDislikes });
};
