import { TextLoader } from "langchain/document_loaders/fs/text";
import { CharacterTextSplitter } from "langchain/text_splitter";
import { GoogleGenerativeAI, TaskType } from "@google/generative-ai";
import { GoogleGenerativeAiEmbeddingFunction } from "chromadb";
import { Pinecone } from "@pinecone-database/pinecone";

const pc = new Pinecone({
  apiKey: "97ab683a-a291-41dd-bb59-36fc602daa1e",
});

export const loadFileToVectorDB = async () => {
  const loader = new TextLoader("./facts.txt");
  const docs = await loader.load();

  const splitter = new CharacterTextSplitter({
    separator: "\n",
    chunkSize: 200,
    chunkOverlap: 0,
  });

  const chunks = await splitter.createDocuments([docs[0].pageContent]);

  const embedder = new GoogleGenerativeAiEmbeddingFunction({
    googleApiKey: process.env.GEMINI_API_KEY!,
    model: "embedding-001",
    taskType: TaskType.RETRIEVAL_DOCUMENT,
  });
  const embeddings = await embedder.generate(
    chunks.map((chunk) => chunk.pageContent)
  );

  //   const vectorStore = await pc.createIndex({
  //     name: "test2",
  //     dimension: 768,
  //     metric: "euclidean",
  //     spec: {
  //       serverless: {
  //         cloud: "aws",
  //         region: "us-east-1",
  //       },
  //     },
  //   });

  const index = pc.Index("test2");

  await index.namespace("test3").upsert(
    embeddings.map((el: any, index: number) => ({
      id: `doc1#chunk${index + 1}`,
      values: el,
      metadata: { info: chunks[index].pageContent },
    }))
  );
};

// export const getCollectionData = async (collectionName: string) => {
//   const index = pc.index(collectionName).namespace("test3");

//   const results = await index.listPaginated({ prefix: "doc1#" });

//   return results;
// };

export const getRelatedData = async (query: string) => {
  const splitter = new CharacterTextSplitter({
    separator: "\n",
    chunkSize: 200,
    chunkOverlap: 0,
  });

  const chunks = await splitter.createDocuments([query]);

  const embedder = new GoogleGenerativeAiEmbeddingFunction({
    googleApiKey: process.env.GEMINI_API_KEY!,
    model: "embedding-001",
    taskType: TaskType.RETRIEVAL_DOCUMENT,
  });

  const embeddings = await embedder.generate(
    chunks.map((chunk) => chunk.pageContent)
  );

  const index = pc.Index("test2");

  const queryResponse = await index.namespace("test3").query({
    vector: embeddings[0],
    topK: 3,
    // includeValues: true,
    includeMetadata: true,
  });
  const matches = queryResponse.matches.map((match) => match?.metadata?.info);
  const matchString = matches.join(",");
  const data = generateRagPrompt(query, matchString);

  const generatedAnswer = await generateAnswer(data);
  return generatedAnswer;
};

const generateRagPrompt = (query: string, context: string) => {
  const escaped_passage = context
    .replace("'", "")
    .replace('"', "")
    .replace("\n", " ");

  const prompt = `You are a helpful and informative bot that answers questions using text from the reference passage included below.
Be sure to respond in a complete sentence, being comprehensive, including all relevant background information.
However, you are talking to a non-technical audience, so be sure to break down complicated concepts and
strike a friendly and conversational tone.
QUESTION: '${query}'
PASSAGE: '${escaped_passage}'

ANSWER:
`;

  return prompt;
};

const generateAnswer = async (prompt: string) => {
  const gGenAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
  const model = gGenAI.getGenerativeModel({ model: "gemini-pro" });

  if (prompt?.length > 0) {
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    console.log("evaluation: ", text);
    return text;
  }
};
