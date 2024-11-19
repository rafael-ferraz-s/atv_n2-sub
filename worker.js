function analyzeComments(data) {
    console.log(data);
    
    const positiveWords = ["bom", "ótimo", "excelente", "maravilhoso", "gostei", "amei"];
    const negativeWords = ["ruim", "péssimo", "horrível", "terrível", "não gostei"];

    return data.comments.map(comment => {
        const commentLower = comment.toLowerCase();
        if (positiveWords.some(word => commentLower.includes(word))) {
            return 'positivo';
        } else if (negativeWords.some(word => commentLower.includes(word))) {
            return 'negativo';
        } else {
            return 'neutro';
        }
    });
}

onmessage = function(event) {
    const results = analyzeComments(event.data);
    postMessage(results);
};
