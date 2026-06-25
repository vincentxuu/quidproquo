---
title: "Auto-Embedding on File Upload Is a Bad Default: A Survey of Adaptive / Agentic RAG and Agentic Parsing"
date: 2026-05-24
category: ai
type: deep-dive
tags: [rag, agentic-rag, adaptive-rag, tool-use, llm-agent, agentic-parsing, document-parsing]
lang: en
tldr: "Making 'chunk and embed every uploaded file automatically' the default behavior means making a decision for the LLM that it could have made itself. From Self-RAG (2310.11511) and Adaptive-RAG (2403.14403) to AgenticOCR (2602.24134), the academic trajectory is pushing three layers of decision-making -- whether to retrieve, whether to parse, and how to chunk -- from the ingestion pipeline back to the agent at conversation time."
description: "A survey of 30 papers mapping the relationships between Adaptive RAG, Self-RAG, Agentic RAG, and Agentic Parsing. Discusses why 'embed on upload' is the wrong default and the design rationale for wrapping both retrieval and parsers as function tools for the LLM to invoke."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-05-24-agentic-attachment-rag-survey)

A user uploads a file to a chat interface. What should the system do?

Most RAG products answer: immediately chunk it, embed it, and write it to the vector store. When the user later asks a question, retrieval fires automatically as well. This pipeline is locked in from the moment of upload.

But this default makes a decision for the LLM that it could have made itself -- "Should this file be embedded? Should RAG be used? Or should the full text simply be read directly?" A 200-word markdown file and a 300-page scanned PDF need different treatment; for the same file, "summarize this for me" and "what are the numbers in the table on page 47?" also call for different approaches. Locking these decisions in at ingestion time is equivalent to not making them at all.

This post surveys three academic threads -- **Adaptive RAG** (whether to retrieve), **Agentic RAG** (turning retrieval into a tool), and **Agentic Parsing** (letting the agent choose the parser too) -- to explain why another reasonable default is: **do nothing at upload time, wrap read / ingest / parse as function tools for the LLM, and let it decide at conversation time**.

## Adaptive RAG: Retrieval Is an Option for the LLM, Not a Default Action

The core thesis of Adaptive RAG: not every query warrants retrieval. For simple factual questions, common knowledge the model already has, or pure arithmetic, retrieval actually introduces noise.

Jeong et al. proposed **Adaptive-RAG** at NAACL 2024 (arxiv 2403.14403), training a classifier that routes queries to three strategies:

- `no-retrieval`: the model answers directly
- `single-step retrieval`: one round of retrieval
- `multi-step retrieval`: multiple rounds of retrieval + reasoning

According to the paper's data, this routing maintains accuracy on multi-hop QA while significantly reducing latency and cost compared to always-retrieve.

A year earlier, **Self-RAG** (Asai et al., ICLR 2024, arxiv 2310.11511) internalized this decision within the model itself, using four reflection tokens -- `[Retrieve]` / `[IsRel]` / `[IsSup]` / `[IsUse]` -- to let the LLM decide during generation whether to retrieve and whether the retrieval results are useful.

The shared message from both papers: **retrieval is an action worth deliberating over, not a free default**. Self-RAG's approach is to internalize it into the model, Adaptive-RAG's is to use an external classifier, and the more natural approach in 2026 is to use function calling to let the LLM decide whether to invoke the retrieval tool.

## Agentic RAG: Wrapping Retrieval as a Tool

Singh et al.'s 2025 survey **Agentic Retrieval-Augmented Generation** (arxiv 2501.09136) divides the evolution of RAG into three stages:

| Generation | Characteristics |
|---|---|
| **Naive RAG** | Fixed pipeline: query -> retrieve -> generate |
| **Modular RAG** | Adds swappable modules like rewrite / rerank / filter |
| **Agentic RAG** | Retrieval becomes an agent tool; multi-turn reasoning, self-correction, planner / reflector patterns |

According to the survey's taxonomy, agentic RAG has three core components: **Planner** (decides what to do next), **Tool Invocation** (including retrieval, parsing, web search, etc.), and **Control Policy** (when to stop, how to handle errors).

In terms of implementation, function calling has become the mainstream interface. Bhatt et al.'s reasoning agentic RAG survey (arxiv 2506.10408) states:

> For Agentic RAG, function calling provides a straightforward and structured way for the LLM agent to invoke a search API when its internal knowledge is insufficient.

The most noteworthy aspect of this thread is the failure modes. Kim et al.'s 2025 paper **Mitigating Sub-optimal Agentic Searches By Reducing Uncertainty** (arxiv 2505.17281) found that agents "search blindly" when uncertain -- after getting empty results from one retrieval, they continue to force-call the retrieval tool, doubling latency without improving accuracy. The solution is to have the agent evaluate "whether this retrieval is worthwhile" before executing it.

This observation directly echoes an engineering reality: if the tool description is not strong enough, the LLM will misselect tools.

## Agentic Parsing: Letting the Agent Choose the Parser Too (Emerging 2025-2026)

If retrieval should not be a default action, what about parsing? Traditional pipelines run OCR / layout detection / table extraction at upload time, producing chunks that are then embedded into the vector store. But these pre-processing choices are fixed -- regardless of what the user asks later, the parser has already been decided.

Lu et al.'s 2026 paper **AgenticOCR: Parsing Only What You Need for Efficient Retrieval** (arxiv 2602.24134) directly challenges this default:

> AgenticOCR transforms OCR from a static pre-processing step into a query-driven, agentic process.

The motto is "parse only what you need." The agent receives the query first, then decides which pages to OCR, whether to perform table extraction, and whether to call a vision-LLM. For scanned PDFs where OCR costs are non-trivial, the paper's experiments show that this approach significantly reduces token / compute costs while maintaining downstream QA accuracy.

Earlier, **AgenticIE** (arxiv 2509.11773) applied the same idea to information extraction: wrapping OCR, PDF parser, and layout detection as tools, letting the agent dynamically select the parser based on "user intent (key-value pair vs QA) + document modality (scanned vs digital)." **ARIAL** (arxiv 2511.18192) demonstrated the document VQA scenario, decomposing queries into OCR / retrieval / grounding tool calls.

To evaluate whether this approach truly outperforms traditional pipelines, **ParseBench** (arxiv 2604.08538) provides quantitative evidence: on document parsing benchmarks, LlamaParse's agentic version scored 80.62%, outperforming the traditional Azure pipeline at 73.8%. Doc-Researcher (arxiv 2510.21603) compiled a cost / quality tradeoff table for different parsing strategies.

## Connecting the Three Layers

Stacking these three threads reveals a consistent direction:

```
Adaptive RAG       ->  Whether to retrieve
       |
AgenticOCR         ->  Whether to parse, which sections to parse
       |
Adaptive Chunking  ->  How to chunk
(arxiv 2603.25333)
```

The shared pattern across all three layers: **shifting decisions from "system decides at ingestion time" to "agent decides at conversation time."** Wrap the following functions as function tools:

```python
# Tool set for the LLM
tools = [
    read_attachment_full_text,   # Small files / plain text -> use long-context
    ingest_attachment,           # Large files / binary -> trigger RAG indexing
    parse_with_ocr,              # Scanned PDFs
    parse_with_layout,           # Structured PDFs
    parse_table,                 # Excel / table-heavy files
    query_files,                 # Retrieval after indexing
    retrieve_text_nodes,
]
```

After `ingest_attachment`, the system triggers background indexing, then re-invokes the agent upon completion -- this control flow corresponds to the Agentic RAG survey's Tool Invocation + Control Policy.

## Long-Context vs RAG: When Not to RAG

"Not embedding by default" faces an immediate challenge: what about large files? The academic basis for this question is Li et al.'s **Self-Route** at EMNLP 2024 (arxiv 2407.16833). The paper compares long-context (LC) and RAG across multiple QA benchmarks, with the main conclusion:

> LC generally outperforms RAG on long-context tasks, while RAG is significantly cheaper. Self-Route, which lets the LLM decide between LC and RAG, achieves comparable performance to LC at significantly reduced cost.

Self-Route's design lets the LLM itself judge whether a query should use LC or RAG. This is precisely the academic version of "do nothing at upload time, let the agent decide at conversation time."

Counterarguments should also be noted: NVIDIA's **OP-RAG** (arxiv 2409.01666) shows that even when the context window is large enough to fit an entire document, RAG that preserves the original chunk order can still outperform direct long-context. Google's **Long-Context LLMs Meet RAG** (arxiv 2410.05983) found that retrieved hard negatives actually hurt long-context LLM performance -- which from another angle supports "don't retrieve by default."

## Engineering Reality: Tool Descriptions Are Contracts, Not READMEs

Once retrieval and parsers are both wrapped as tools, a new engineering challenge emerges: how does the LLM know which tool to choose?

Chen et al.'s 2026 paper **Learning to Rewrite Tool Descriptions** (arxiv 2602.20426) experimentally verified an intuitive fact: the wording of tool descriptions can quantifiably affect the LLM's tool selection accuracy. The same team's **Learning to Ask** (arxiv 2409.00557) cataloged four types of "instruction issues" that cause tool use failures, the most common being "conditional suggestions treated as optional."

The practical difference:

```python
# Old: Conditional suggestion -- LLM makes its own judgment
"if the file is larger or in a binary format, call ingest_attachment instead"

# New: Explicit rule -- no room for conditional interpretation
"ONLY supports: txt, md, csv, tsv, json, yaml, yml, log. "
"PDF, doc, docx, pptx, xlsx, html, images, and all other binary or non-plain-text formats "
"are REJECTED by this tool; call ingest_attachment for those."
```

Another pattern is "description pre-warning + return value reinforcement" -- stating the same instruction in both the tool description and the tool's return value. According to **Many-Tier Instruction Hierarchy** (arxiv 2604.09443), repeating instructions reduces the LLM's deviation rate.

## Overall Takeaways

From Self-RAG (2023) to AgenticOCR (2026), the core message of this academic thread is consistent: **ingestion should not pre-make decisions that ought to be left to the agent**. This principle applies to all three layers: retrieval, parsing, and chunking.

Tradeoffs for production systems:

- **Good fit**: Diverse attachment types (plain text / PDF / Excel / scanned images mixed), high variance in user intent (summarization vs precise extraction vs Q&A), scenarios where you want to save ingestion costs
- **Poor fit**: Highly homogeneous attachments (e.g., pure customer service FAQs), fixed retrieval patterns (always full-text search), scenarios extremely sensitive to first-interaction latency
- **Universal considerations**: Tool description wording directly impacts success or failure and must be written as contracts; agent multi-turn retries need stop-loss conditions to avoid the sub-optimal search failure mode

Essential reading list: Self-RAG (2310.11511), Adaptive-RAG (2403.14403), Self-Route (2407.16833), Agentic RAG Survey (2501.09136), plus AgenticOCR (2602.24134) from the parser thread. Eight papers to cover this entire design space.

## References

### Adaptive RAG / Self-RAG

- [Self-RAG: Learning to Retrieve, Generate, and Critique through Self-Reflection (Asai et al., 2023)](https://arxiv.org/abs/2310.11511)
- [Adaptive-RAG: Learning to Adapt Retrieval-Augmented LLMs through Question Complexity (Jeong et al., 2024)](https://arxiv.org/abs/2403.14403)
- [RetrievalQA: Assessing Adaptive Retrieval-Augmented Generation (ACL 2024 Findings)](https://arxiv.org/abs/2402.16457)
- [Lightweight Query Routing for Adaptive RAG (2026)](https://arxiv.org/abs/2604.03455)
- [R³AG: Retriever Routing for Retrieval-Augmented Generation (2026)](https://arxiv.org/abs/2604.22849)

### Agentic RAG

- [Agentic Retrieval-Augmented Generation: A Survey (Singh et al., 2025)](https://arxiv.org/abs/2501.09136)
- [A Survey on Reasoning Agentic RAG (Bhatt et al., 2025)](https://arxiv.org/abs/2506.10408)
- [SoK: Agentic Retrieval-Augmented Generation (2026)](https://arxiv.org/abs/2603.07379)
- [Mitigating Sub-optimal Agentic Searches By Reducing Uncertainty (2025)](https://arxiv.org/abs/2505.17281)
- [Benchmarking Agentic Information Seeking for RAG (2025)](https://arxiv.org/abs/2505.15872)

### Corrective RAG

- [CRAG: Corrective Retrieval Augmented Generation (Yan et al., 2024)](https://arxiv.org/abs/2401.15884)
- [ChunkRAG: LLM-Chunk Filtering Method (2024)](https://arxiv.org/abs/2410.19572)

### Long-context vs RAG

- [Retrieval Augmented Generation or Long-Context LLMs? A Comprehensive Study and Hybrid Approach (Li et al., EMNLP 2024)](https://arxiv.org/abs/2407.16833)
- [Long Context vs. RAG for LLMs: An Evaluation and Revisits (2024)](https://arxiv.org/abs/2501.01880)
- [In Defense of RAG in the Era of Long-Context LLMs / OP-RAG (NVIDIA, 2024)](https://arxiv.org/abs/2409.01666)
- [Long-Context LLMs Meet RAG: Overcoming Challenges for Long Inputs in RAG (Google, 2024)](https://arxiv.org/abs/2410.05983)

### Agentic Parsing

- [AgenticOCR: Parsing Only What You Need for Efficient Retrieval (2026)](https://arxiv.org/abs/2602.24134)
- [AgenticIE: An Adaptive Agent for Information Extraction from Documents (2025)](https://arxiv.org/abs/2509.11773)
- [ARIAL: An Agentic Framework for Document VQA with Precise Grounding (2025)](https://arxiv.org/abs/2511.18192)
- [DocLens: A Tool-Augmented Multi-Agent Framework for Long Document Understanding (2025)](https://arxiv.org/abs/2511.11552)
- [Doc-Researcher: A Unified System for Multimodal Document Understanding (2025)](https://arxiv.org/abs/2510.21603)
- [ParseBench: A Document Parsing Benchmark for AI Agents (2026)](https://arxiv.org/abs/2604.08538)
- [Document Parsing Unveiled: Techniques, Challenges, and Prospects (2024 survey)](https://arxiv.org/abs/2410.21169)
- [Optimizing Chunking-Method Selection for RAG / Adaptive Chunking (2026)](https://arxiv.org/abs/2603.25333)
- [Hybrid OCR-LLM Framework for Enterprise-Scale Document Processing (2025)](https://arxiv.org/abs/2510.10138)

### Tool Description / Tool Selection

- [Learning to Rewrite Tool Descriptions for Reliable LLM-Agent Tool Use (2026)](https://arxiv.org/abs/2602.20426)
- [Learning to Ask: When LLM Agents Meet Unclear Instruction (2024)](https://arxiv.org/abs/2409.00557)
- [Many-Tier Instruction Hierarchy in LLM Agents (2026)](https://arxiv.org/abs/2604.09443)
