import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const manualFormat = `
## 詳細

{description}

## 解決手順

{solution}

## 今後の対応

{correspondence}
`;

export default openai;
