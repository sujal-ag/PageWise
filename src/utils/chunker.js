export const chunkText = (fullText, chunkSize = 150, overlap = 50) => {
    const chunks = [];

    fullText.forEach(({ page, text }) => {
        const words = text.split(/\s+/).filter((w) => w.trim() !== '');
        let i = 0;

        while (i < words.length) {
            const startTokenIndex = i;
            const endTokenIndex = Math.min(i + chunkSize, words.length) - 1;
            const chunkWords = words.slice(startTokenIndex, endTokenIndex + 1);

            chunks.push({
                page,
                text: chunkWords.join(' '),
                chunkIndex: chunks.length,
                startTokenIndex,
                endTokenIndex,
                pageTokenStart: startTokenIndex,
                pageTokenEnd: endTokenIndex,
            });

            i += chunkSize - overlap;
        }
    });

    return chunks;
};