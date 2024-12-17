// import keywordExtractor from 'keyword-extractor';

// const extractKeywords = (text) => {
//     if (!text || typeof text !== 'string') {
//         throw new Error('Invalid text input for keyword extraction');
//     }

//     return keywordExtractor.extract(text, {
//         language: "english",
//         remove_digits: true,
//         return_changed_case: true,
//         remove_duplicates: true,
//     });
// };

// export default extractKeywords;


import keywordExtractor from 'keyword-extractor';

const extractKeywords = (text) => {
    if (!text || typeof text !== 'string') {
        throw new Error('Invalid text input for keyword extraction');
    }

    // Use keyword-extractor for initial keyword extraction
    const extractedKeywords = keywordExtractor.extract(text, {
        language: "english",
        remove_digits: true,
        return_changed_case: true,
        remove_duplicates: true,
    });

    // Helper function to detect meaningful phrases
    const findPhrases = (text) => {
        const phrases = [];
        
        // Split text into words
        const words = text.toLowerCase().split(/\s+/);

        // Look for proper noun patterns or common phrases
        for (let i = 0; i < words.length; i++) {
            if (i < words.length - 1 && words[i + 1] === 'of') {
                // Capture "X of Y" patterns
                phrases.push(`${words[i]} of ${words[i + 2]}`);
            } else if (words[i] === 'prime' && words[i + 1] === 'minister') {
                // Capture "prime minister" and add optional context
                let phrase = 'prime minister';
                if (words[i + 2]) {
                    phrase += ` of ${words.slice(i + 2).join(' ')}`;
                }
                phrases.push(phrase.trim());
            }
        }

        return phrases;
    };

    // Combine extracted keywords with detected phrases
    const phrases = findPhrases(text);
    const finalKeywords = [...new Set([...extractedKeywords, ...phrases])];

    return finalKeywords;
};

export default extractKeywords;
