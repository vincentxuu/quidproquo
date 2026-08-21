---
title: "LlamaIndex Is Not a RAG Framework Anymore, and Old Tutorials Won't Tell You"
date: 2026-08-21
category: ai
type: deep-dive
tags: [llamaindex, rag, ai-agent, python, framework]
lang: en
tldr: "LlamaIndex (51,775 GitHub stars, MIT, verified 2026-08-21) has moved its center of gravity from indexing to Workflows: the standalone llama-index-workflows package pulls 2.81M weekly PyPI downloads, more than the 1.97M of the llama-index umbrella package itself. This post covers the core abstractions, the trade-off against hand-rolling a pipeline, and a hands-on test of its defaults on Traditional Chinese text — at the same chunk_size=1024, English fits 4,645 characters and Traditional Chinese only 1,332. Plus one fact you need before choosing: the TypeScript port is archived and unmaintained."
description: "A deep dive on where LlamaIndex stands in 2026: the shift from indexing framework to event-driven Workflows, the four abstractions beneath the five-line starter, the trade-off against a hand-rolled RAG pipeline, a hands-on test of its defaults on Traditional Chinese, and honest caveats including the discontinued TypeScript port."
series:
  name: "Technology Choices in the AI Era"
  order: 10
draft: false
---

🌏 [中文版](/posts/ai/2026-08-21-llamaindex-rag-framework)

This site has published thirty-odd posts on RAG techniques — [chunking strategies](/posts/ai/2026-03-12-chunking-strategies-en), [HyDE](/posts/ai/2026-03-12-hyde-hypothetical-document-embeddings-en), [CRAG](/posts/ai/2026-03-12-corrective-rag-crag-en), [GraphRAG](/posts/ai/2026-03-12-graph-rag-en), [hybrid search and RRF](/posts/ai/2026-03-12-hybrid-search-bm25-vector-rrf-en) — and not one on frameworks. The practical question after the techniques is: what do I bolt all of this onto? This post covers the leading candidate.

Start with a fact that changes how you read older tutorials: [LlamaIndex](https://github.com/run-llama/llama_index) no longer centers on indexing.

## 1. What it actually is now

LlamaIndex opened in November 2022 under the name GPT Index, and the pitch was the name itself: turn your documents into an index. Today the [official docs](https://developers.llamaindex.ai/python/framework/) define it in one line as "the leading framework for building LLM-powered agents over your data with LLMs and workflows." Indexing hasn't disappeared, but it has been demoted to a part. Workflows now sits in the middle of the sentence.

This is not marketing drift; the download numbers say the same thing. [llama-index-workflows](https://pypi.org/project/llama-index-workflows/), a standalone package born only last summer, already out-downloads the three-and-a-half-year-old umbrella package `llama-index` on PyPI.

| Package | Weekly downloads (verified 2026-08-21) |
|---|---|
| [llama-index-core](https://pypi.org/project/llama-index-core/) | 3,494,317 |
| [llama-index-workflows](https://pypi.org/project/llama-index-workflows/) | 2,809,641 |
| [llama-index](https://pypi.org/project/llama-index/) (umbrella) | 1,973,736 |

The product line has been reframed too: the docs site's top navigation reads LlamaParse, LiteParse, LlamaAgents, LlamaIndex Framework — "Framework" is one slot out of four. The [LlamaAgents README](https://github.com/run-llama/llama-agents) puts the positioning more bluntly than the docs homepage does:

> An open-source framework for building and shipping document-centric agents in Python.

So if you arrived via a 2024 tutorial, your mental image of "LlamaIndex = RAG in five lines" covers one slot of four. It is now a **document-centric agent framework**, with indexing and retrieval as one segment of it.

## 2. The five-line starter and the four abstractions beneath it

The famous five lines are still there, preserved verbatim on the docs homepage:

```python
from llama_index.core import VectorStoreIndex, SimpleDirectoryReader

documents = SimpleDirectoryReader("data").load_data()
index = VectorStoreIndex.from_documents(documents)
query_engine = index.as_query_engine()
response = query_engine.query("Some question about the data should go here")
print(response)
```

The value of those five lines is not that they run — it's the four abstractions they hide. Whether this framework suits you comes down to whether you need to reach in and move them individually:

- **Document / Node**: a `Document` wraps one source of raw data; a `Node` is a chunk cut from it, carrying metadata that points back to its parent and its neighbors. Every strategy discussed in this site's [chunking post](/posts/ai/2026-03-12-chunking-strategies-en) is, here, a matter of swapping the node parser.
- **Index**: organizes Nodes into something queryable, usually vector embeddings plus a pile of metadata strategies.
- **Retriever / Node Postprocessor**: the first decides how to fetch, the second what to filter and re-rank afterwards. [RRF](/posts/ai/2026-03-12-rrf-multi-source-fusion-en), [MMR](/posts/ai/2026-03-12-mmr-diversity-reranking-en), and rerankers all hang off this layer.
- **Response Synthesizer**: takes the query plus a stack of nodes and produces the final answer.

That four-way split is the framework's biggest asset. It lines up almost item for item with the interfaces this site derived in the [modular RAG post](/posts/ai/2026-03-12-modular-rag-pipeline-architecture-en) — the difference being that that post asks you to build them yourself.

**What to do**: you can test the fit tonight. Walk through your current hand-rolled retrieval flow and map each stage onto one of the four nouns above. If every stage maps to one, LlamaIndex has simply already written them for you. If two or more stages don't map — say your retrieval has to hit a relational database first to decide the namespace — read the next section.

## 3. Workflows: retreating from DAGs back to Python

Workflows is LlamaIndex's second answer to "how do I assemble a multi-step flow," and it openly concedes that the first answer was wrong. From the [official Workflows docs](https://developers.llamaindex.ai/python/llamaagents/workflows/):

> Other frameworks and LlamaIndex itself have attempted to solve this problem previously with directed acyclic graphs (DAGs) but these have a number of limitations that workflows do not.

The three limitations it lists are worth remembering: loops and branches had to be encoded into the graph's edges, which made them hard to read; passing data between DAG nodes grew complexity around optional and default values; and the most candid one — DAGs did not feel natural to developers.

What replaced the DAG fits in one sentence: **a step receives an event, does work, and returns another event; the returned event triggers whichever step's type annotation accepts it**.

```python
from workflows import Workflow, step
from workflows.events import Event, StartEvent, StopEvent


class Retrieved(Event):
    chunks: list[str]


class RagFlow(Workflow):
    @step
    async def retrieve(self, ev: StartEvent) -> Retrieved:
        return Retrieved(chunks=await search(ev.query))

    @step
    async def synthesize(self, ev: Retrieved) -> StopEvent:
        return StopEvent(result=await answer(ev.chunks))
```

Branching is an ordinary `if` returning different event types. A loop is a step returning an event that an earlier step consumes. Concurrency is a step returning `list[Event]` paired with a step accepting `list[Event]`. There is no DSL; the type annotations are the edges — and the framework validates the whole graph from those annotations before a run: start and stop events present, produced events consumed, consumed events produced, no accidental dead ends.

If you know [LangGraph](/posts/ai/2026-03-27-langgraph-agent-orchestration-en), this is a different answer to the same question. LangGraph asks you to declare nodes and edges explicitly; Workflows asks you to declare them implicitly through types. The former visualizes and time-travels better; the latter reads more like Python you would have written anyway.

Worth noting: it already runs without the rest of LlamaIndex. `pip install llama-index-workflows` gets you the whole thing — no index, no retriever, not even an LLM required. Which is exactly why its download count passes the flagship package's.

## 4. The trade-off against hand-rolling

Most people reading this already have a hand-rolled retrieval flow in production. The honest comparison looks like this:

| | Hand-rolled | LlamaIndex |
|---|---|---|
| Swap vector database | Edit your adapter | Swap a `llama-index-vector-stores-*` package |
| Swap embedding / LLM provider | Edit your client | Swap a `llama-index-embeddings-*` / `llama-index-llms-*` package |
| Read a new file format | Write a loader | A LlamaHub reader package |
| Debugging path | All of it is your code | Your code plus the framework's abstraction layer |
| Upgrade cost | You decide | You follow upstream |

The first three rows are what you buy; the last two are what you pay. Whether the trade is worth it turns on one thing: **which axis your uncertainty lives on**. If the open question is "which vector store, whose embeddings, reranker or not," LlamaIndex is buying you reversibility, and cheaply. If the open question is "my retrieval logic itself is weird," that's a different situation. Hitting a business API first to decide which namespace to search, assembling filters dynamically from user permissions, fusing scores from three heterogeneous sources under custom rules — under that kind of requirement, the abstraction layer is just one more thing between you and your own logic. You will spend your time reading framework source.

There is a middle path the ecosystem explicitly supports: **use Workflows without the indexing**. It's a standalone package with few dependencies, so you can wrap your hand-rolled retrieval as a single step and borrow only the event-driven skeleton and state management. That path makes particular sense for the kind of thing covered in this site's [multi-agent RAG post](/posts/ai/2026-03-16-multi-agent-rag-patterns-en).

## 5. What actually happens on Traditional Chinese text

I ran this section myself, because I could not find existing data on it. Setup: `llama-index-core` 0.14.24 plus `tiktoken`, with the Chinese and English bodies of this site's [llms.txt post](/posts/tech/2026-08-21-llms-txt-en) as the corpus (code fences and link URLs stripped). The conclusion in one line: **the defaults are all tuned for English, and they fail silently**.

The first problem is that the token math doesn't carry over. `SentenceSplitter` counts tokens with `tiktoken`'s `gpt-3.5-turbo` encoding — that is, `cl100k_base`. Write the same `chunk_size=1024` and Traditional Chinese fits under a third of the characters English does:

| Language | Characters per token | Fits in 1024 tokens |
|---|---|---|
| English | 4.49 | 4,645 characters |
| Traditional Chinese | 1.18 | 1,332 characters |

The `chunk_size=1024` you copied from an English tutorial produces far shorter chunks on Chinese text, and the semantic completeness of what you retrieve is not what you assumed it was.

The second problem is better hidden. `SentenceSplitter`'s primary sentence tokenizer is NLTK's Punkt, trained on English. I fed it a 400-character Traditional Chinese block and it returned **one sentence** — no split at all. What actually splits Chinese is the fallback regex, and the fallback regex reads:

```python
CHUNKING_REGEX = "[^,.;。？！]+[,.;。？！]?|[,.;。？！]"
```

`。`, `？`, and `！` are in there, but **the full-width comma `，`, the enumeration comma `、`, the full-width semicolon `；`, and the colon `：` are not**. Chinese prose runs long sentences dense with commas, so a long paragraph without a full stop stays one block, and when it can't be split it falls all the way through to character-by-character splitting.

**What to do**: two lines fix most of it. When you construct the splitter, add full-width punctuation to the fallback regex and swap in the tokenizer of the model you actually use:

```python
from llama_index.core.node_parser import SentenceSplitter

splitter = SentenceSplitter(
    chunk_size=512,
    secondary_chunking_regex="[^,.;:，。；：？！、]+[,.;:，。；：？！、]?|[,.;:，。；：？！、]",
    tokenizer=your_model_tokenizer,   # do not inherit cl100k_base
)
```

That only fixes the chunking layer. The upstream problem for Traditional Chinese RAG — how the embedding model itself performs — has [its own post here](/posts/ai/2026-06-04-zh-tw-embedding-rag-failures-en), and its conclusion is that buying a more expensive embedding model usually doesn't rescue you. Read together, the two say: **most Traditional Chinese RAG failures are not the model being too weak, they are you not having changed the defaults**.

## 6. Honest caveats

Three things worth knowing before you choose, none of which is on the homepage.

**The TypeScript port is discontinued.** This matters most to readers of this series. The [LlamaIndexTS repo](https://github.com/run-llama/LlamaIndexTS) is archived and its README opens with a `CAUTION`: "This project is deprecated and no longer maintained." The last `llamaindex` release on npm was 2025-12-02. Yet the Python docs homepage still says the framework is "available in Python and TypeScript" and links across, and the [TypeScript docs page](https://developers.llamaindex.ai/typescript/framework/) still calls itself "the leading framework ... in JavaScript and TypeScript" with no deprecation notice anywhere on it. For doing this work on Node, the framework is not an option right now — and the documentation will tell you it is.

**The version number is permanently 0.x, and releases are frequent.** The umbrella package has accumulated 504 releases on PyPI and has never reached 1.0. That is not evidence of instability. `llama-index-core`'s public API compatibility is maintained reasonably well — when Workflows was folded into core, the `llama_index.core.workflow` import path was deliberately kept intact. But it does mean you should plan for version pinning and scheduled upgrades rather than writing `>=` into requirements and forgetting about it.

**The number of integration packages cuts both ways.** There are 950 packages on PyPI whose names start with `llama-index-` (breakdown in the appendix). The upside is that whatever you want to connect, someone has probably connected it. The downside is that maintenance activity across that set varies enormously, and many are one-off community contributions that were never touched again. Before you install, check the last release date of that specific package, not of the main project.

As for "LlamaIndex or LangGraph," community opinion diverges sharply and I'm not going to score either side. Here are the checkable facts (2026-08-21):

| Project | GitHub stars | Weekly PyPI downloads |
|---|---|---|
| [langgraph](https://github.com/langchain-ai/langgraph) | 40,139 | 16,771,338 |
| [llama_index](https://github.com/run-llama/llama_index) (`llama-index-core`) | 51,775 | 3,494,317 |
| [haystack](https://github.com/deepset-ai/haystack) (`haystack-ai`) | 26,265 | 198,902 |

Stars and downloads point in opposite directions here, which is itself the finding: they measure different things (attention versus how often something is depended on, transitive dependencies included). Don't take either one alone as the conclusion.

## 7. When to use it and when not to

**Use it** when your hard problem is on the document side — PDFs, contracts, filings, scans — rather than the control-flow side. When you want to keep the option to change your mind between vector stores or embedding providers. When your team writes Python and is too thin to maintain its own retrieval abstraction. Or when you only want the event-driven skeleton of Workflows and will do the rest yourself.

**Don't use it** when your product lives on Node/TypeScript (see the previous section). When your retrieval logic is itself the competitive core of the product and an abstraction layer will only get in the way. When what you actually need is "a vector store plus one LLM call" — call the vector store's SDK directly; a framework at that scale is a net loss. Or when your control-flow complexity far exceeds your data complexity, in which case a graph-centric tool like LangGraph will sit closer to how you think.

One more signal worth filing under this series' criteria: the LlamaIndex docs site ships [a full kit for agents](https://developers.llamaindex.ai/for-agents/) — `llms.txt`, raw Markdown for any page by appending `index.md`, BM25 full-text search at `/api/search` and regex search at `/api/grep`, plus a hosted MCP server. This site's [llms.txt post](/posts/tech/2026-08-21-llms-txt-en) argued that this is the main weapon obscure libraries have against a training-data disadvantage. LlamaIndex is not obscure; its reason is that the API surface is large and moves fast — having a coding agent look things up is far more reliable than having it guess from memory.

## Overall

Evaluate LlamaIndex as "a RAG framework" and you will be evaluating the part it has stopped caring most about. Its bet today is on **document processing and event-driven orchestration**, with indexing as the segment that joins them. The pivot makes sense: RAG techniques are highly public knowledge by now — thirty-odd posts on this site are the evidence — and the hard part was never knowing how HyDE works. It was assembling a pile of such techniques into something that runs, stays changeable, and can be debugged when it breaks.

Whether it's worth adopting isn't a property of the framework; it's a property of your axis of change. If your uncertainty is "what do I connect to," it buys you reversibility. If your uncertainty is "how should retrieval itself think," it's one more layer. And either way, for Traditional Chinese you have to change the defaults yourself.

## Appendix: verification method and dates

All figures verified 2026-08-21.

- **PyPI downloads**: `pypistats.org/api/packages/<pkg>/recent`, `last_week` field.
- **Release history**: the `releases` object of `pypi.org/pypi/llama-index/json`. Earliest release 0.4.4 on 2023-02-16; 504 releases to date; latest 0.14.24 on 2026-08-19. `llama-index-workflows` first shipped 0.1.0 on 2025-06-10 and is now 2.23.2 (2026-08-17).
- **npm downloads and publish times**: `api.npmjs.org/downloads/point/last-week/<pkg>` and `registry.npmjs.org/<pkg>`. `llamaindex` latest is 0.12.1, published 2025-12-02T08:59:24Z; `@llamaindex/core` is 0.6.23, published 2026-03-09.
- **GitHub figures**: `api.github.com/repos/<owner>/<repo>`. `run-llama/llama_index` was created 2022-11-02, license MIT; the `archived` field is `true` for both `run-llama/LlamaIndexTS` and `run-llama/workflows-ts`.
- **Integration package count**: fetched the full `pypi.org/simple/` index and ran `grep -o 'llama-index-[a-z0-9-]*' | sort -u | wc -l`, giving 950; counting each prefix separately gives readers 193, llms 123, vector-stores 100, embeddings 74. This counts package names on PyPI carrying that prefix, which is not the same as the number officially maintained.
- **Traditional Chinese chunking test**: `llama-index-core` 0.14.24 plus `tiktoken`, corpus being the Chinese and English bodies of this site's llms.txt post (code fences and link URLs removed): Chinese 2,573 characters / 2,176 tokens, English 5,543 characters / 1,234 tokens. The Punkt test took the first 400 characters of the Chinese corpus with newlines removed and called `globals_helper.punkt_tokenizer.span_tokenize()`, which returned a single span.
- **`CHUNKING_REGEX`**: read from `llama-index-core/llama_index/core/node_parser/text/sentence.py` on the main branch; the default tokenizer comes from `get_tokenizer(model_name="gpt-3.5-turbo")` in `core/utils.py` of the same repo.

## References

- [LlamaIndex Python docs homepage (developers.llamaindex.ai)](https://developers.llamaindex.ai/python/framework/)
- [Workflows introduction (official docs)](https://developers.llamaindex.ai/python/llamaagents/workflows/)
- [Using LlamaIndex with AI Agents (official for-agents page)](https://developers.llamaindex.ai/for-agents/)
- [Introduction to RAG (official docs)](https://developers.llamaindex.ai/python/framework/understanding/rag/)
- [Node Parser Usage Pattern (official docs)](https://developers.llamaindex.ai/python/framework/module_guides/loading/node_parsers/)
- [run-llama/llama-agents README (GitHub)](https://github.com/run-llama/llama-agents)
- [run-llama/LlamaIndexTS README (with deprecation notice, GitHub)](https://github.com/run-llama/LlamaIndexTS)
- [Welcome to LlamaIndex.TS (TypeScript docs page)](https://developers.llamaindex.ai/typescript/framework/)
- [sentence.py source (llama-index-core)](https://github.com/run-llama/llama_index/blob/main/llama-index-core/llama_index/core/node_parser/text/sentence.py)
- [utils.py source (`get_tokenizer`, llama-index-core)](https://github.com/run-llama/llama_index/blob/main/llama-index-core/llama_index/core/utils.py)
- [developers.llamaindex.ai/llms.txt](https://developers.llamaindex.ai/llms.txt)
- On this site: [Chunking Strategies](/posts/ai/2026-03-12-chunking-strategies-en), [Modular RAG Pipeline](/posts/ai/2026-03-12-modular-rag-pipeline-architecture-en), [LangGraph](/posts/ai/2026-03-27-langgraph-agent-orchestration-en), [Three Layers of Traditional Chinese RAG Failure](/posts/ai/2026-06-04-zh-tw-embedding-rag-failures-en), [llms.txt](/posts/tech/2026-08-21-llms-txt-en)
