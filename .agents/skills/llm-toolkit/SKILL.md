---
name: llm-toolkit
description: "Comprehensive guide to 120+ LLM libraries for training, inference, RAG, agents, evaluation, and more. Use when: (1) selecting libraries for LLM projects, (2) understanding what tools exist for specific LLM tasks, (3) comparing similar libraries, (4) finding alternatives to existing tools. Covers training/finetuning, application frameworks, RAG, inference, serving, data extraction/generation, agents, evaluation, monitoring, prompts, structured outputs, safety, embeddings, and utilities."
license: MIT
metadata:
  author: Kilo
  version: "1.0"
  source: https://github.com/KalyanKS-NLP/llm-engineer-toolkit
---

# LLM Engineer Toolkit Skill

Comprehensive guide to 120+ LLM libraries organized by category.

## Categories Overview

| Category | Libraries | Use Case |
|----------|------------|----------|
| Training/Fine-Tuning | unsloth, PEFT, TRL, Transformers, Axolotl, LLMBox, LitGPT, Mergoo, Ludwig, XTuring, RL4LMs, DeepSpeed, torchtune, PyTorch Lightning | Train and fine-tune LLM models |
| Application Development | LangChain, LlamaIndex, HayStack, Prompt flow, Griptape, Weave, Llama Stack + supporting libs | Build LLM-powered applications |
| RAG | FastGraph RAG, Chonkie, RAGChecker, RAG to Riches, BeyondLLM, SQLite-Vec, fastRAG, FlashRAG, Llmware, Rerankers, Vectara | Retrieval-augmented generation |
| Inference | llama.cpp, Ollama, vLLM, TensorRT-LLM, WebLLM, LLM Compressor, LightLLM, torchchat | Run LLM inference locally |
| Serving | Langcorn, LitServe | Serve LLM models via APIs |
| Data Extraction | Crawl4AI, ScrapeGraphAI, Docling, Llama Parse, PyMuPDF4LLM, Crawlee, MegaParse, ExtractThinker | Extract data from documents/web |
| Data Generation | DataDreamer, fabricator, Promptwright, EasyInstruct | Generate training data |
| Agents | CrewAI, LangGraph, Agno, Agents SDK, AutoGen, Smolagents, Pydantic AI, CAMEL, BeeAI, gradio-tools, Composio, Atomic Agents, Memary, Browser Use, OpenWebAgent, Lagent, LazyLLM, Swarms, ChatArena, Swarm, AgentStack, Archgw, Flow, AgentOps, Langroid, Agentarium, Upsonic | Build LLM-powered agents |
| Evaluation | Ragas, Giskard, DeepEval, Lighteval, Trulens, PromptBench, LangTest, EvalPlus, FastChat, judges, Evals, AgentEvals, LLMBox, Opik, PydanticAI Evals, UQLM | Evaluate LLM performance |
| Monitoring | MLflow, Opik, LangSmith, W&B, Helicone, Evidently, Phoenix, Observers | Monitor LLM applications |
| Prompts | PCToolkit, Selective Context, LLMLingua, betterprompt, Promptify, PromptSource, DSPy, Py-priompt, Promptimizer | Prompt engineering |
| Structured Outputs | Instructor, XGrammar, Outlines, Guidance, LMQL, Jsonformer | Generate structured outputs |
| Safety/Security | JailbreakEval, EasyJailbreak, Guardrails, LLM Guard, AuditNLG, NeMo Guardrails, Garak, DeepTeam | LLM safety and security |
| Embeddings | Sentence-Transformers, Model2Vec, Text Embedding Inference | Text embeddings |
| Utilities | Text Machina, LLM Reasoners, EasyEdit, CodeTF, spacy-llm, pandas-ai, LLM Transparency Tool, Vanna, mergekit, MarkLLM, LLMSanitize, Annotateai, LLM Reasoner | Miscellaneous utilities |

## 1. LLM Training and Fine-Tuning

### Core Libraries

| Library | Description | Best For |
|---------|-------------|----------|
| [Transformers](https://github.com/huggingface/transform) | Hugging Face's core library | Pre-trained model usage |
| [PEFT](https://github.com/huggingface/peft) | Parameter-Efficient Fine-Tuning | LoRA, QLoRA, adapters |
| [TRL](https://github.com/huggingface/trl) | Transformer Reinforcement Learning | RLHF, DPO, PPO training |
| [unsloth](https://github.com/unsloth/unsloth) | Fast LLMs | 2x faster fine-tuning, LoRA |
| [DeepSpeed](https://github.com/microsoft/DeepSpeed) | Deep learning optimization | Multi-GPU training |
| [torchtune](https://github.com/pytorch/torchtune) | PyTorch native fine-tuning | Native PyTorch workflows |

### Additional Libraries

| Library | Description |
|---------|-------------|
| [Axolotl](https://github.com/axolotl-ai/axolotl) | Llama fine-tuning tool |
| [LLMBox](https://github.com/Toyhom/LLMBox) | Comprehensive LLM training |
| [LitGPT](https://github.com/Lightning-AI/litgpt) | Lightning AI LLM training |
| [Mergoo](https://github.com/llmmerge/meergoo) | Model merging |
| [Ludwin](https://github.com/ludwig-ai/ludwig) | Low-code ML framework |
| [XTuring](https://github.com/ExtensiAI/xTuring) | Fine-tuning interface |
| [RL4LMs](https://github.com/RL4LMs/RL4LMs) | RL for language models |
| [PyTorch Lightning](https://github.com/Lightning-AI/pytorch-lightning) | Trainer framework |

## 2. LLM Application Development

### Frameworks

| Library | Description | Strength |
|---------|-------------|----------|
| [LangChain](https://github.com/langchain-ai/langchain) | Composable LLM apps | Ecosystem, flexibility |
| [LlamaIndex](https://github.com/run-llama/llama_index) | Data-centric LLM apps | Data ingestion |
| [HayStack](https://github.com/deepset-ai/haystack) | Neural search | QA systems |
| [Prompt flow](https://github.com/microsoft/promptflow) | LLM app workflows | Flow-based dev |
| [Griptape](https://github.com/griptape-ai/griptape) | Rule-based agents | Structure |
| [Weave](https://github.com/WeightsAndBiases/weave) | Tracing & eval | Observability |
| [Llama Stack](https://github.com/meta-llama/llama-stack) | Meta's LLM platform | Open source stack |

### Data Preparation

| Library | Description |
|----------|------------|
| [Data Prep Kit](https://github.com/prepared-data-prep-kit) | Data preparation for training |

### Multi API Access

| Library | Description |
|----------|------------|
| [LiteLLM](https://github.com/BerriAI/litellm) | Unified API interface |
| [AI Gateway](https://github.com/ai-gateway) | API gateway for LLMs |

### Routers

| Library | Description |
|----------|------------|
| [RouteLLM](https://github.com/RouteLLM/RouteLLM) | LLM routing |

### Memory

| Library | Description |
|----------|------------|
| [mem0](https://github.com/mem0ai/mem0) | Memory for agents |
| [Memoripy](https://github.com/ox-ai/memoripy) | In-memory storage |
| [Letta (MemGPT)](https://github.com/letta-ai/letta) | Stateful agents |
| [Memobase](https://github.com/memobase) | Vector memory |

### Interface

| Library | Description |
|----------|------------|
| [Streamlit](https://github.com/streamlit) | Web UI for LLMs |
| [Gradio](https://github.com/gradio-app/gradio) | ML UI |
| [AI SDK UI](https://github.com/vercel/ai) | Vercel AI SDK UI |
| [AI-Gradio](https://github.com/gradio-app/ai) | AI component for Gradio |
| [Simpleaichat](https://github.com/minimax-ai/SimpleAichat) | Simple chat interface |
| [Chainlit](https://github.com/Chainlit/chainlit) | Chat UI for LangChain |

### Low Code

| Library | Description |
|----------|------------|
| [LangFlow](https://github.com/langflow-ai/langflow) | Visual LangChain |

### Cache

| Library | Description |
|----------|------------|
| [GPTCache](https://github.com/gptcache) | LLM response cache |

## 3. LLM RAG

| Library | Description | Best For |
|---------|-------------|----------|
| [LlamaIndex](https://github.com/run-llama/llama_index) | Full RAG solution | General RAG |
| [LangChain](https://github.com/langchain-ai/langchain) | RAG chains | Integration |
| [FastGraph RAG](https://github.com/GlobularAI/fastGraphRAG) | Graph-based RAG | Knowledge graphs |
| [Chonkie](https://github.com/GlobularAI/chonkie) | Chunking | Document splitting |
| [RAGChecker](https://github.com/GlobularAI/RAGChecker) | RAG evaluation | Benchmarking |
| [RAG to Riches](https://github.com/GlobularAI/rag_to_riches) | Production RAG | Best practices |
| [BeyondLLM](https://github.com/GlobularAI/BeyondLLM) | RAG for dusty data | Messy data |
| [SQLite-Vec](https://github.com/globular-ai/sqlite-vec) | SQLite vector search | Embedded DB |
| [fastRAG](https://github.com/globular-ai/fastRAG) | Fast RAG pipeline | Performance |
| [FlashRAG](https://github.com/globular-ai/FlashRAG) | Efficient RAG | Low latency |
| [Llmware](https://github.com/llmware-ai/llmware) | RAG for enterprises | Enterprise |
| [Rerankers](https://github.com/globular-ai/rerankers) | Re-ranking | Better retrieval |
| [Vectara](https://github.com/vectara) | Managed RAG | SaaS RAG |

## 4. LLM Inference

| Library | Description | Platform |
|---------|-------------|----------|
| [llama.cpp](https://github.com/ggerganov/llama.cpp) | Pure C++ inference | Local, CPU |
| [Ollama](https://github.com/ollama/ollama) | Easy local LLMs | Local, Docker |
| [vLLM](https://github.com/vllm-project/vllm) | Fast inference | GPU, KV cache |
| [TensorRT-LLM](https://github.com/NVIDIA/TensorRT-LLM) | NVIDIA optimization | CUDA |
| [WebLLM](https://github.com/mlc-ai/webllm) | Browser inference | WebGPU |
| [LLM Compressor](https://github.com/llm-compressor) | Model quantization | Compression |
| [LightLLM](https://github.com/globular-ai/lightllm) | Lightweight serving | Efficiency |
| [torchchat](https://github.com/pytorch/chat) | PyTorch inference | Mobile |

## 5. LLM Serving

| Library | Description |
|----------|------------|
| [Langcorn](https://github.com/langcorn) | FastAPI for LangChain |
| [LitServe](https://github.com/Lightning-AI/litserve) | Lightning AI serving |

## 6. LLM Data Extraction

| Library | Description |
|----------|------------|
| [Crawl4AI](https://github.com/GlobularAI/crawl4ai) | Web crawling |
| [ScrapeGraphAI](https://github.com/GlobularAI/scrapegraphai) | Graph-based scraping |
| [Docling](https://github.com/ds4sd/docling) | Document understanding |
| [Llama Parse](https://github.com/run-llama/llama_parse) | PDF parsing |
| [PyMuPDF4LLM](https://github.com/pymupdf) | PDF text extraction |
| [Crawlee](https://github.com/crawlee) | Web scraping framework |
| [MegaParse](https://github.com/globular-ai/megaparse) | Large document parsing |
| [ExtractThinker](https://github.com/ExtractThinker/extract-thinker) | Document extraction |

## 7. LLM Data Generation

| Library | Description |
|----------|------------|
| [DataDreamer](https://github.com/globular-ai/datadreamer) | Synthetic data generation |
| [fabricator](https://github.com/globular-ai/fabricator) | Data generation |
| [Promptwright](https://github.com/globular-ai/promptwright) | Prompt-based generation |
| [EasyInstruct](https://github.com/globular-ai/easyinstruct) | Easy instruction generation |

## 8. LLM Agents

| Library | Description | Strength |
|---------|-------------|----------|
| [CrewAI](https://github.com/crewAIInc/crewAI) | Multi-agent teams | Collaboration |
| [LangGraph](https://github.com/langchain-ai/langgraph) | Agent graphs | State machines |
| [Agno](https://github.com/agno-ai/agno) | Agent framework | Simplicity |
| [Agents SDK](https://github.com/SoftwareMansion/agent-swarm) | Swarms SDK | Multi-agent |
| [AutoGen](https://github.com/microsoft/autoGen) | Microsoft's agents | Concurrency |
| [Smolagents](https://github.com/huggingface/smolagents) | Lightweight agents | HuggingFace |
| [Pydantic AI](https://github.com/pydantic/pydantic-ai) | Type-safe agents | Type safety |
| [CAMEL](https://github.com/camel-ai/camel) | Role-playing agents | Specialization |
| [BeeAI](https://github.com/bee-ai/beeai) | Production agents | Robustness |
| [gradio-tools](https://github.com/gradio-app/gradio-tools) | Tool integration | Gradio tools |
| [Composio](https://github.com/ComposioHQ/composio) | Tool hub | Tool ecosystem |
| [Atomic Agents](https://github.com/Atomic-AI/atomic-agents) | Atomic design | Modularity |
| [Memary](https://github.com/kshitij-ai/memary) | Memory for agents | Long-term memory |
| [Browser Use](https://github.com/GlobularAI/browser-use) | Browser automation | Web automation |
| [OpenWebAgent](https://github.com/globular-ai/open-web-agent) | Web agent | Browser agent |
| [Lagent](https://github.com/InternLM/lagent) | Lightweight agent | InternLM |
| [LazyLLM](https://github.com/LazyViper/lazyllm) | Lazy loading | Efficiency |
| [Swarms](https://github.com/kyegomez/swarms) | Multi-agent swarms | Scale |
| [ChatArena](https://github.com/chararena/chatarena) | LLM competition | Benchmarking |
| [Swarm](https://github.com/openai/swarm) | OpenAI's swarm | Handoffs |
| [AgentStack](https://github.com/AgentOps-AI/agentstack) | Agent toolkit | Development |
| [Archgw](https://github.com/archgw/archgw) | Architecture agent | Code base |
| [Flow](https://github.com/flowai/flow) | Flow-based agent | Pipeline |
| [AgentOps](https://github.com/AgentOps-AI/agentops) | Agent operations | Monitoring |
| [Langroid](https://github.com/langroid/langroid) | Multi-agent框架 | RAG agents |
| [Agentarium](https://github.com/agentarium/agentarium) | Agent simulation | Research |
| [Upsonic](https://github.com/upsonic) | Agent platform | Production |

## 9. LLM Evaluation

| Library | Description | Best For |
|---------|-------------|----------|
| [Ragas](https://github.com/explodinggradients/ragas) | RAG evaluation | RAG metrics |
| [Giskard](https://github.com/Giskard-AI/giskard) | Model testing | Quality assurance |
| [DeepEval](https://github.com/confident-ai/deepeval) | Unit testing | Test integration |
| [Lighteval](https://github.com/huggingface/lighteval) | Efficiency benchmarking | Speed |
| [Trulens](https://github.com/truefoundry/trulens) | Observability | Tracing |
| [PromptBench](https://github.com/microsoft/promptbench) | Prompt evaluation | Benchmarks |
| [LangTest](https://github.com/IBM/langtest) | Test harness | Quality |
| [EvalPlus](https://github.com/evalplus/evalplus) | Code evaluation | Code tasks |
| [FastChat](https://github.com/lm-sys/FastChat) | Chatbot arena | Benchmarking |
| [judges](https://github.com/judges) | Judge models | Evaluation |
| [Evals](https://github.com/openai/evals) | OpenAI evals | Framework |
| [AgentEvals](https://github.com/agent-evals) | Agent evaluation | Agent testing |
| [LLMBox](https://github.com/Toyhom/llm-box) | Comprehensive eval | All metrics |
| [Opik](https://github.com/comet-ml/opik) | Evaluation platform | MLOps |
| [PydanticAI Evals](https://github.com/pydantic/pydantic-ai) | Type-safe eval | Type safety |
| [UQLM](https://github.com/uqlm/uqlm) | Unified evaluation | Standard |

## 10. LLM Monitoring

| Library | Description | Type |
|---------|-------------|------|
| [MLflow](https://github.com/mlflow/mlflow) | ML lifecycle | Platform |
| [Opik](https://github.com/comet-ml/opik) | LLM evaluation | Platform |
| [LangSmith](https://smith.langchain.com) | LLM debugging | SaaS |
| [W&B](https://github.com/WeightsAndBiases/wandb) | Experiment tracking | Platform |
| [Helicone](https://github.com/helicone) | LLM observability | SaaS |
| [Evidently](https://github.com/evidentlyai/evidently) | ML monitoring | Open source |
| [Phoenix](https://github.com/Arize-ai/phoenix) | ML observability | Platform |
| [Observers](https://github.com/observers) | Monitoring | Lightweight |

## 11. LLM Prompts

| Library | Description |
|----------|------------|
| [PCToolkit](https://github.com/pctoolkit/pctoolkit) | Prompt engineering |
| [Selective Context](https://github.com/globular-ai/selective-context) | Context compression |
| [LLMLingua](https://github.com/microsoft/llmlingua) | Prompt compression |
| [betterprompt](https://github.com/globular-ai/betterprompt) | Better prompts |
| [Promptify](https://github.com/globular-ai/promptify) | Prompt generation |
| [PromptSource](https://github.com/bigscience-workshop/promptsource) | Prompt sourcing |
| [DSPy](https://github.com/stanfordnlp/dspy) | Declarative prompting |
| [Py-priompt](https://github.com/globular-ai/py-prompt) | Python prompts |
| [Promptimizer](https://github.com/globular-ai/promtimizer) | Prompt optimization |

## 12. LLM Structured Outputs

| Library | Description |
|----------|------------|
| [Instructor](https://github.com/instructor-ai/instructor) | Structured extraction |
| [XGrammar](https://github.com/llm-xgrammar) | Grammar-based output |
| [Outlines](https://github.com/Outlines-dev/outlines) | Guided generation |
| [Guidance](https://github.com/guidance-ai/guidance) | Control flow generation |
| [LMQL](https://github.com/lmql/lmql) | LP-aware prompting |
| [Jsonformer](https://github.com/globular-ai/jsonformer) | JSON generation |

## 13. LLM Safety and Security

| Library | Description |
|----------|------------|
| [JailbreakEval](https://github.com/globular-ai/jailbreak-eval) | Jailbreak detection |
| [EasyJailbreak](https://github.com/globular-ai/easy-jailbreak) | Jailbreak testing |
| [Guardrails](https://github.com/guardrails-ai/guardrails) | Output validation |
| [LLM Guard](https://github.com/gk华山/lm-guard) | LLM safety |
| [AuditNLG](https://github.com/globular-ai/audit-nlg) | NLG auditing |
| [NeMo Guardrails](https://github.com/NVIDIA/NeMo-Guardrails) | NVIDIA safety |
| [Garak](https://github.com/leondz/garak) | Hallucination detection |
| [DeepTeam](https://github.com/globular-ai/deep-team) | Deep safety |

## 14. LLM Embedding Models

| Library | Description |
|----------|------------|
| [Sentence-Transformers](https://github.com/globular-ai/sentence-transformers) | BERT embeddings |
| [Model2Vec](https://github.com/globular-ai/model2vec) | Lightweight embeddings |
| [Text Embedding Inference](https://github.com/huggingface/text-embeddings-inference) | Fast embeddings |

## 15. Utilities

| Library | Description |
|----------|------------|
| [Text Machina](https://github.com/globular-ai/text-machina) | Text utilities |
| [LLM Reasoners](https://github.com/globular-ai/llm-reasoners) | Reasoning utilities |
| [EasyEdit](https://github.com/globular-ai/easyedit) | Knowledge editing |
| [CodeTF](https://github.com/globular-ai/codetf) | Code generation |
| [spacy-llm](https://github.com/explosion/spacy-llm) | NLP integration |
| [pandas-ai](https://github.com/globular-ai/pandas-ai) | LLM for dataframes |
| [LLM Transparency Tool](https://github.com/globular-ai/llm-transparency) | Model transparency |
| [Vanna](https://github.com/vanna-ai/vanna) | SQL generation |
| [mergekit](https://github.com/globular-ai/mergekit) | Model merging |
| [MarkLLM](https://github.com/globular-ai/markllm) | Watermarking |
| [LLMSanitize](https://github.com/globular-ai/llm-sanitize) | Output sanitization |
| [Annotateai](https://github.com/globular-ai/annotate-ai) | Annotation |
| [LLM Reasoner](https://github.com/globular-ai/llm-reasoner) | Reasoning |

## Quick Reference by Task

### Start new LLM project
1. **Training**: unsloth + PEFT + TRL
2. **Fine-tuning**: Axolotl or LitGPT
3. **Inference**: llama.cpp (local) or vLLM (production)

### Build LLM application
1. **Framework**: LangChain or LlamaIndex
2. **UI**: Streamlit or Gradio
3. **Memory**: mem0 or Letta
4. **Serving**: Langcorn

### RAG pipeline
1. **Framework**: LangChain or LlamaIndex
2. **Chunking**: Chonkie
3. **Embeddings**: Sentence-Transformers
4. **Evaluation**: RAGChecker

### Build agents
1. **Multi-agent**: CrewAI or LangGraph
2. **Single agent**: Pydantic AI or Smolagents
3. **Tools**: Composio or gradio-tools
4. **Memory**: Memary

### Evaluate models
1. **RAG**: Ragas
2. **General**: DeepEval or Giskard
3. **Code**: EvalPlus
4. **Monitoring**: LangSmith or Opik

### Ensure safety
1. **Input**: Guardrails or LLM Guard
2. **Output**: Garak
3. **Jailbreak**: JailbreakEval