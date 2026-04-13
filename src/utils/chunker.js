export const chunkText = (fullText, chunkSize = 300, overlap = 50) => {
    const chunks = [];

    fullText.forEach(({ page, text }) => {
        const words = text.split(' ').filter(w => w.trim() !== '');
        let i = 0;
        while (i < words.length) {
            const chunkWords = words.slice(i, i + chunkSize);
            chunks.push({
                page,
                text: chunkWords.join(' '),
                chunkIndex: chunks.length
            })
            i += chunkSize - overlap;
        }
    });
    return chunks;
}