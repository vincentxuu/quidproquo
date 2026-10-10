---
title: "Reading NCCU Yen-Lung Tsai Generative AI, L08: Retrieval-Augmented Generation (RAG) — Chunk the Text, Embed It, Put the Closest Pieces Back in the Prompt"
date: 2026-09-30
category: ai
type: guide
tags: [nccu-generative-ai, ai-course, course-guide, generative-ai, rag, vector-database, embedding, langchain]
lang: en
series:
  name: "Reading NCCU Yen-Lung Tsai Generative AI"
  order: 8
tldr: "L06 said a prompt is two things: correct information and clear instructions. RAG lets the computer fetch the information part on its own. Split your documents into chunks, turn chunks and questions into feature vectors with the same model fθ, find the closest few chunks, and drop them into a template: 'Answer {question} based on {retrieved_chunks}.' The code comes in two notebooks: Demo06a builds a vector database with LangChain and FAISS and zips it as faiss_db.zip; Demo06b loads it back, connects an LLM, and wraps it in Gradio. The week-8 assignment is to do the same with your own data."
description: "A guide to lecture 8 of NCCU Yen-Lung Tsai's Generative AI: Text and Image Synthesis Principles and Practice (semester 1132, Spring 2025), based on video 08, the 25-page GenAI08 slides, and the AI-Demo notebooks Demo06a, Demo06b, and Demo06: the Llama 4 aside, why RAG reduces hallucination, feature vectors and chunking, query vectors and similarity search, the prompt template, multiple vector databases, short- and long-term LLM memory, applications in finance, plus the week-8 assignment and rubric from the Chang Gung satellite section."
draft: false
glossary:
  - term: "FAISS"
    definition: "Meta's open-source library for vector similarity search. It indexes large numbers of vectors and quickly finds the ones closest to a query vector."
    context: "Demo06a uses LangChain's FAISS wrapper to build the vector database and save it as the faiss_db folder."
    links:
      - label: "FAISS on GitHub"
        url: "https://github.com/facebookresearch/faiss"
---

> 🌏 [中文版](/posts/ai/2026-09-30-nccu-genai-08-rag)

**Video status: Videos included; playback has not been rechecked individually.** [Source details](#course-video-sources)

**This post is based on the 1132 semester (Spring 2025) of NCCU Yen-Lung Tsai's *Generative AI: Text and Image Synthesis Principles and Practice*.** It is part 8 of the [Reading NCCU Yen-Lung Tsai Generative AI](/posts/ai/2026-09-30-nccu-genai-course-overview-en) series and follows [L07, Building Your Own Chatbot](/posts/ai/2026-09-30-nccu-genai-07-build-chatbot-en). The L07 chatbot only knows what the model saw in training. This lecture makes it read your documents before answering.

Official sources: [video 08](https://www.youtube.com/watch?v=JClJEmZub-A) (2025-04-08, about 3 h 4 min, in Mandarin), the 25-page GenAI08 slides (in the instructor's [slide folder](https://drive.google.com/drive/folders/1c6A9Pa-c7cNi5kHUp7j-ccgYBRy9JpeA)), the notebooks [`【Demo06a】RAG01_打造向量資料庫`](https://github.com/yenlung/AI-Demo/blob/master/%E3%80%90Demo06a%E3%80%91RAG01_%E6%89%93%E9%80%A0%E5%90%91%E9%87%8F%E8%B3%87%E6%96%99%E5%BA%AB.ipynb), [`【Demo06b】RAG02_打造_RAG_系統`](https://github.com/yenlung/AI-Demo/blob/master/%E3%80%90Demo06b%E3%80%91RAG02_%E6%89%93%E9%80%A0_RAG_%E7%B3%BB%E7%B5%B1.ipynb), and [`【Demo06】用_RAG_打造心靈處方籤機器人`](https://github.com/yenlung/AI-Demo/blob/master/%E3%80%90Demo06%E3%80%91%E7%94%A8_RAG_%E6%89%93%E9%80%A0%E5%BF%83%E9%9D%88%E8%99%95%E6%96%B9%E7%B1%A4%E6%A9%9F%E5%99%A8%E4%BA%BA.ipynb) in the [AI-Demo](https://github.com/yenlung/AI-Demo) repo, and the week-8 assignment on the [Chang Gung satellite course page](https://yangchihyuan.github.io/courses/GenerativeAI2025). Access level: **A3**.

The notebook drift is especially visible this week, and I flag each case below: **the current repo version no longer matches what's on screen in the video.**

## Course video sources

These course video sources were already documented in this article. Playback has not been reverified for each video; no timestamp is supplied.

```youtube
url: https://www.youtube.com/watch?v=JClJEmZub-A
title: Generative AI 08: Retrieval-Augmented Generation (RAG), principles and practice (YouTube recording, in Mandarin)
```

Original videos: [Generative AI 08: Retrieval-Augmented Generation (RAG), principles and practice (YouTube recording, in Mandarin)](https://www.youtube.com/watch?v=JClJEmZub-A)

Course and recording entries:

- [Official course and recording entry](https://yangchihyuan.github.io/courses/GenerativeAI2025)

## Where this week sits

Session one of video 08 opens with an aside on Llama 4 (18:44), then covers what RAG is, how it works, memory, and finance applications (28:08–57:40), and starts on program A, the vector database. Session two builds and saves the database, introduces the embedding model, uploads it to the cloud with a direct download link, then writes program B, designs the prompt, builds the Gradio app, and explains the assignment at 2:01. Session three has lightning talks from NTHU and NCCU students and a TA segment.

The slides have three parts, "RAG", "Vector databases", and "Applications of RAG", followed by the assignment.

The Llama 4 aside is slide 2: Behemoth is a 2TB "super teacher" model, Maverick has 128 experts, and Scout has a 10-million-token context.

## Concept 1: can the computer fetch the information itself?

Slide 4 brings back the "prompts are simple" slide from [L06](/posts/ai/2026-09-30-nccu-genai-06-llm-applications-ethics-en): give it the correct information, plus clear instructions. This lecture's question: **can the computer find the information part in a database automatically?**

Slide 5's answer is RAG (Retrieval-Augmented Generation), a way to **reduce hallucination**. Recall the Karpathy quote in L06: hallucination is an LLM's nature, and what we want is an *assistant* that doesn't hallucinate. RAG doesn't change the model. Before each answer it puts the relevant correct material into the prompt, so the model answers from the material.

## Concept 2: RAG's two phases

### Preparation: every document gets a feature vector

Slide 7's diagram: documents 1, 2, and 3 each pass through the same function fθ to get feature vectors k₁, k₂, k₃. "Every important document finds its own representative feature vector." fθ is the embedding model, the same idea as [L02](/posts/ai/2026-09-30-nccu-genai-02-neural-networks-en)'s "a neural network is a function".

Slide 8 says to drop your files into an `uploaded_docs` folder. Plain text works best, but PDF and Word files are fine too.

Slide 9 handles a practical problem: a long document can't become a single vector, so you cut it into chunks. The slide's illustration uses 1,000-character chunks with 200 characters of overlap between neighbors, and adds "there's actually a lot more to it". The overlap keeps a sentence that straddles a boundary from becoming unreadable on both sides.

### Use: the question becomes a vector too, and you find the nearest

Slides 10–11: when the user asks a question, it goes through the **same** fθ to become a vector q. You compare q with k₁, k₂, k₃, find the closest and most relevant material, and put it into the prompt. The slide's aside: "This is how AI search works these days!"

Slides 12–13 split the new prompt into two variables and give a template:

- `question`: the user's original question
- `retrieved_chunks`: what RAG found

> 請根據 {retrieved_chunks} 裡的資訊, 來回應使用者的問題: {question}
> (Answer the user's question {question} based on the information in {retrieved_chunks}.)

That's all RAG is. Retrieval fills in `retrieved_chunks`; generation is still the LLM's job.

<details>
<summary>How is "closest" computed?</summary>

The slides just say "compare which is closest" without a formula. The current Demo06a/06b set `normalize_embeddings=True`, scaling every vector to length 1. Then the dot product of two vectors equals their cosine similarity cos θ: the closer to 1, the more aligned the direction and the closer the meaning. FAISS finds the top k nearest vectors quickly, even among many.

</details>

## Concept 3: vector databases and "memory"

Slide 16: one system can use two or more vector databases, say one for product manuals and one for support logs.

Slides 17–20 are what Tsai jokingly calls "the part where I show off". You often hear that LLMs have two kinds of memory:

- **Short-term memory** is the current conversation. Come back next time and everything is forgotten; worse, if the conversation runs too long, the early parts are forgotten too. That's the limit of resending the whole messages list every turn in [L07](/posts/ai/2026-09-30-nccu-genai-07-build-chatbot-en).
- **Long-term memory:** one way to build it is RAG, turning full past conversations into a vector database. The slide's example is a custom bot greeting a regular: "Welcome back! Just so you know, the dish you used to order isn't on the menu anymore."

Slide 22 lists possible RAG applications in finance: customer service and Q&A, internal knowledge management, education and training, personalized financial advice, investment research report generation, anti-money-laundering and fraud detection, regulatory and compliance advice, and financial news and trend summaries.

## This week's demo notebooks

Slide 23 splits the implementation into two programs: program A reads your data and builds the vector database (`yenlung.me/AI06a`); program B implements the RAG system (`yenlung.me/AI06b`). The split is practical: building the database is slow and happens once, while Q&A runs over and over.

### Program A: Demo06a builds the vector database (current repo version)

1. Create an `uploaded_docs` folder and upload `.txt`/`.pdf`/`.docx` files by hand. The notes suggest practicing on [NCCU's student rewards and discipline regulations](https://osa.nccu.edu.tw/files/1431422025610b81850375e.pdf) (in Mandarin).
2. Install `langchain`, `langchain-community`, `pypdf`, `python-docx`, `faiss-cpu`, and `sentence-transformers`.
3. Load each file with `TextLoader`, `PyPDFLoader`, or `UnstructuredWordDocumentLoader` depending on its extension.
4. Chunk with `RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=100)`.
5. Embed with `google/embeddinggemma-300m` from Hugging Face, which needs a `HuggingFace` token in Colab Secrets. Following Google's recommendation, the notebook prefixes documents with `title: none | text:` and queries with `task: search result | query:`.
6. Build with `FAISS.from_documents(...)`, `save_local("faiss_db")`, then `zip` it into `faiss_db.zip`.

**Version drift:** slide 9 illustrates 1000/200 chunking; the current notebook uses 500/100. Demo06b's section heading still says "custom E5 embedding class", while the code already uses EmbeddingGemma. For which embedding model the video introduces at 1:21, go by what's on screen. The concept doesn't change: documents and questions must go through the same fθ.

### Program B: Demo06b builds the RAG system (current repo version)

1. Download `faiss_db.zip` from a public Google Drive link with `gdown` and unzip it. This is the "download the database from the cloud" and Google Drive direct-link part of the video (1:33–1:36).
2. Load it with `FAISS.load_local(...)` using the same `EmbeddingGemmaEmbeddings` class, then `as_retriever(search_kwargs={"k": 4})` to fetch 4 chunks per query.
3. Call the LLM through [AISuite](https://github.com/andrewyng/aisuite) on Groq; currently `model = "groq:openai/gpt-oss-120b"`.
4. The prompt has two layers. The system message makes the model "NCCU's AI self-directed learning advisor". The user message is the template "Based on the following material: {retrieved_chunks}, answer the user's question: {question}", plus "if the material isn't enough, tell the student to ask the student affairs office."
5. `chat_with_rag()` retrieves, fills the template, and calls the model; `gr.Blocks` wraps it as an "AI school discipline advisor".

That line about what to do when the material falls short, in step 4, is worth copying. It gives the model a legitimate way out instead of inventing an answer.

Note that `chat_with_rag()` saves each exchange to `chat_history`, but the messages it sends contain only the system message and the current user turn. So it is single-turn RAG and won't remember the previous question. For multi-turn, bring in the L07 approach.

### Another example: Demo06, the "spiritual prescription" bot

[Demo06](https://github.com/yenlung/AI-Demo/blob/master/%E3%80%90Demo06%E3%80%91%E7%94%A8_RAG_%E6%89%93%E9%80%A0%E5%BF%83%E9%9D%88%E8%99%95%E6%96%B9%E7%B1%A4%E6%A9%9F%E5%99%A8%E4%BA%BA.ipynb) is a single-notebook version. Its data is the book *True Happiness* by Master Sheng Yen (the notes state the copyright belongs to Dharma Drum Publishing and it is used only as an example). It builds the database with `OpenAIEmbeddings` and FAISS, chunks at 1000/200, and uses a `RetrievalQA` chain with `gpt-4o`. The clever part is the prompt: it first draws a random "spiritual prescription" (a short aphorism), then hands the prescription, the retrieved text, and the user's question to the model and asks for a reply in a similar voice. It shows that a prompt can carry other material you want to control besides `retrieved_chunks`.

## The assignment: week 8 (Chang Gung satellite version)

From the [Chang Gung satellite course page](https://yangchihyuan.github.io/courses/GenerativeAI2025); NCCU's own grading differs. Slide 24's assignment: you may use the simulated NCCU club data (`yenlung.me/uploaded_docs`); program A builds a vector database from your data and saves it as `faiss_db.zip`; program B must read and unzip your `faiss_db.zip`; design your own prompt and build your own RAG-powered chatbot.

**The Chang Gung page's task: implement a RAG system**

1. Prepare your own practice data.
2. Adapt the instructor's code to make it your own.
3. Add code that reads your zip file from a URL so TAs can run it (convert the cloud file to a downloadable link).
4. Demo in Gradio.

**Submit:** a Colab link (only the second program), a description of your data, key screenshots, the persona/background, and Gradio conversation results. The 1132 deadline was 4/21.

**Rubric** (out of 10): identical to the example, 1; GPT-level or off-topic, 2; a theme close to the example (campus club data), 6; mostly meets the requirements, 7–8; meets the requirements, 9; +1 for an interesting theme. Minus 1 for not importing the instructor's fixed packages. For weeks 1–4 the Chang Gung page calls these "the fixed 4 lines of packages" without listing them. Demo04, Demo04c, and Demo06 all open with the same four lines, `%matplotlib inline` plus imports of numpy, pandas, and matplotlib, so that's most likely what it means. The current Demo06a/06b don't have them; add them before submitting.

**Choosing data:** pick something you look up yourself and that general-purpose models answer badly, such as your department's degree requirements or a club's bylaws. Prepare five questions you know the answers to and test each one once the database is built. When an answer is wrong, check the 4 retrieved chunks first. If the answer isn't there, it's a retrieval problem (chunking, embedding, k). If it is there and the answer is still wrong, it's the prompt or the model.

## Self-check

- Can you use L06's "information + instructions" to explain which part of the prompt RAG changes?
- Can you explain why documents are chunked and why neighboring chunks overlap?
- Can you explain why documents and questions must use the same embedding model?
- Can you put Demo06a's `faiss_db.zip` in the cloud, turn it into a direct download link, and have Demo06b fetch it with `gdown`?
- Given a wrong answer, can you tell whether retrieval or generation is at fault?

## Further reading

- Every RAG component compared: [The RAG Techniques Compendium](/series/rag-techniques); start with [Naive, Advanced, and Modular RAG](/posts/ai/2026-03-12-naive-advanced-modular-rag-evolution-en)
- Choosing a vector database and embedding model: [Vector database comparison](/posts/ai/2026-03-12-vector-database-comparison-en), [Choosing BGE-M3](/posts/ai/2026-03-12-bge-m3-embedding-model-selection-en)
- Letting the model decide whether to search again: [CMU 11-768 AI Agents guide](/posts/ai/2026-09-29-cmu-11768-course-overview-en)

Previous: [L07 Building Your Own Chatbot](/posts/ai/2026-09-30-nccu-genai-07-build-chatbot-en) | Next: [L09 Why 2025 Is the Year of AI Agents](/posts/ai/2026-09-30-nccu-genai-09-ai-agents-en) | [Series overview](/posts/ai/2026-09-30-nccu-genai-course-overview-en)

## Update Log

- 2026-10-10: Added explicit video status and checked recording sources and access notes.

## References

- [Generative AI 08: Retrieval-Augmented Generation (RAG), principles and practice (YouTube recording, in Mandarin)](https://www.youtube.com/watch?v=JClJEmZub-A)
- [Yen-Lung Tsai, 1132 Generative AI slide folder (GenAI08, in Mandarin)](https://drive.google.com/drive/folders/1c6A9Pa-c7cNi5kHUp7j-ccgYBRy9JpeA)
- [1132 video playlist (in Mandarin)](https://www.youtube.com/playlist?list=PL-eaXJVCzwbukEFU2k5vu_BlUqgVLsEnv)
- [Chang Gung satellite course page: Generative AI 2025 (in Mandarin)](https://yangchihyuan.github.io/courses/GenerativeAI2025)
- [yenlung/AI-Demo: Demo06a, building the vector database](https://github.com/yenlung/AI-Demo/blob/master/%E3%80%90Demo06a%E3%80%91RAG01_%E6%89%93%E9%80%A0%E5%90%91%E9%87%8F%E8%B3%87%E6%96%99%E5%BA%AB.ipynb)
- [yenlung/AI-Demo: Demo06b, building the RAG system](https://github.com/yenlung/AI-Demo/blob/master/%E3%80%90Demo06b%E3%80%91RAG02_%E6%89%93%E9%80%A0_RAG_%E7%B3%BB%E7%B5%B1.ipynb)
- [yenlung/AI-Demo: Demo06, the spiritual-prescription bot with RAG](https://github.com/yenlung/AI-Demo/blob/master/%E3%80%90Demo06%E3%80%91%E7%94%A8_RAG_%E6%89%93%E9%80%A0%E5%BF%83%E9%9D%88%E8%99%95%E6%96%B9%E7%B1%A4%E6%A9%9F%E5%99%A8%E4%BA%BA.ipynb)
- [Simulated NCCU club data, uploaded_docs.zip (in Mandarin)](https://raw.githubusercontent.com/yenlung/AI-Demo/refs/heads/master/data/uploaded_docs.zip)
- [FAISS (facebookresearch/faiss)](https://github.com/facebookresearch/faiss)
- [LangChain](https://github.com/langchain-ai/langchain)
- [google/embeddinggemma-300m (Hugging Face)](https://huggingface.co/google/embeddinggemma-300m)
