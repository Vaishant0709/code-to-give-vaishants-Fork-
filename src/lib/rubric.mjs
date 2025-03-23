import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI('AIzaSyCb3YnyWekTHAuxh3MCHP85KcvheK1Vxms');

async function evaluateTextWithRubric(text, rubric) {
    const prompt = `Evaluate the following text based on the given rubric and provide a numerical score from 0 to 10.

    Text:
    """
    ${text}
    """

    Rubric:
    ${rubric}

    Provide the score in this format: {"score": X}`;

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
    const result = await model.generateContent({ contents: [{ role: "user", parts: [{ text: prompt }] }] });
    const response = result.response.text();

    try {
        const parsedResult = JSON.parse(response);
        return parsedResult.score;
    } catch (error) {
        console.error('Error parsing response:', error);
        return null;
    }
}

export { evaluateTextWithRubric };