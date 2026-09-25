import crypto from 'crypto';
import bcrypt from 'bcryptjs';

// In-Memory Database Store for robust local operation & fallback
export class LocalStore {
  constructor() {
    this.users = new Map();
    this.documents = new Map();
    this.insights = new Map();
    
    // Seed default demo user & documents
    this._seedInitialData();
  }

  async _seedInitialData() {
    const demoPasswordHash = await bcrypt.hash('demo123456', 10);
    const demoUser = {
      id: 'usr-demo-001',
      email: 'researcher@insightmesh.ai',
      password_hash: demoPasswordHash,
      created_at: new Date().toISOString()
    };
    this.users.set(demoUser.id, demoUser);

    // Seed Sample Research Paper 1
    const doc1Id = 'doc-sample-001';
    const doc1 = {
      id: doc1Id,
      user_id: demoUser.id,
      title: 'Quantum Neural Architecture Search in High-Dimensional Search Spaces.pdf',
      file_path: 'uploads/sample-quantum-nas.pdf',
      extracted_text: `ABSTRACT:
Quantum Neural Architecture Search (Q-NAS) has emerged as a landmark paradigm for optimizing deep learning hyper-parameters on NISQ (Noisy Intermediate-Scale Quantum) devices. We evaluate multi-qubit parameterized quantum circuits (PQCs) combined with Gemini 3 Flash semantic optimization routines.

SECTION 1: INTRODUCTION & CORE HYPOTHESIS
Classical neural architecture search requires massive compute overhead (over 10,000 GPU hours). By mapping neural search spaces to Hilbert state spaces, Q-NAS reduces architectural iteration latency by 68%. Our key finding demonstrates that Quantum-Classical Hybrid Ensembles achieve 94.2% top-1 accuracy on ImageNet-1k while reducing parameter count by 42%.

SECTION 2: METHODOLOGY & ENTITY MAPPING
We deploy Variational Quantum Eigensolvers (VQE) coupled with Entanglement-Guided Pruning. The principal methodology relies on Tensor Network Contraction and Flash-Attention 3 mechanisms. We observe a strong positive correlation between qubit entanglement entropy and downstream fine-tuning convergence speed.

SECTION 3: CLAIMS AND CONTRADICTIONS
Claim 1: Quantum Entanglement Pruning eliminates 90% of redundant attention heads without loss of expressivity.
Claim 2: NISQ decoherence noise can be effectively mitigated using Zero-Noise Extrapolation (ZNE) without active quantum error correction.
Claim 3: Q-NAS outperforms standard Auto-Keras by 4.3x in hyper-parameter exploration speed.`,
      created_at: new Date(Date.now() - 3600000 * 24).toISOString()
    };
    this.documents.set(doc1Id, doc1);

    // Seed Sample Research Paper 2
    const doc2Id = 'doc-sample-002';
    const doc2 = {
      id: doc2Id,
      user_id: demoUser.id,
      title: 'Cross-Document Semantic Knowledge Graph Extraction via Multi-Model Orchestration.txt',
      file_path: 'uploads/sample-knowledge-graph.txt',
      extracted_text: `ABSTRACT:
Automated synthesis of heterogeneous literature across biomedical and computer science domains demands real-time evidence traceability. In this work, we propose InsightMesh: a multi-model orchestration framework leveraging Google Gemini 3 Flash and Gemini 3 Pro.

SECTION 1: ARCHITECTURAL OVERVIEW
The InsightMesh framework processes uploaded PDF and text documents through automated tokenization, paragraph indexing, and prompt-driven JSON extraction. Entities are classified into Concepts, Methodologies, Organizations, and Findings. Each claim is bound to a precise paragraph reference ID.

SECTION 2: EMPIRICAL BENCHMARKS & CLAIMS
Claim 1: Zero-Noise Extrapolation is insufficient for high-depth quantum circuits beyond 50 qubits, contradicting early Q-NAS claims regarding decoherence resilience.
Claim 2: Multi-Model Orchestration with Gemini 3 Flash reduces entity relation parsing latency to sub-800ms per 10k tokens.
Claim 3: Visual Knowledge Graph representations improve human evidence verification speed by 3.8x compared to tabular search interfaces.

SECTION 3: RELATED WORKS & CONFLICT ANALYSIS
While earlier literature argued that Hilbert space search scaling is linear with qubit depth, our empirical benchmarks demonstrate exponential decoherence degradation above 32 qubits unless active Fault-Tolerant Surface Codes are applied.`,
      created_at: new Date(Date.now() - 3600000 * 12).toISOString()
    };
    this.documents.set(doc2Id, doc2);

    // Seed Insights for doc 1
    this.insights.set(doc1Id, {
      id: 'ins-sample-001',
      document_id: doc1Id,
      summary: '1. Introduces Quantum Neural Architecture Search (Q-NAS) reducing compute overhead by 68% on NISQ hardware.\n2. Demonstrates 94.2% accuracy on ImageNet-1k with 42% fewer parameters using Hybrid Quantum-Classical Ensembles.\n3. Uses Entanglement-Guided Pruning and Zero-Noise Extrapolation to mitigate quantum decoherence noise.',
      key_entities: [
        { name: 'Quantum Neural Architecture Search (Q-NAS)', type: 'Methodology', importance: 'High', description: 'Quantum search paradigm mapping neural spaces to Hilbert state spaces.' },
        { name: 'Variational Quantum Eigensolver (VQE)', type: 'Methodology', importance: 'High', description: 'Quantum algorithm used for ground state energy estimation.' },
        { name: 'Zero-Noise Extrapolation (ZNE)', type: 'Methodology', importance: 'Med', description: 'Error mitigation technique for NISQ devices without full error correction.' },
        { name: 'Entanglement Entropy', type: 'Concept', importance: 'Med', description: 'Measure of quantum correlation driving convergence speed.' },
        { name: 'Google Gemini 3 Flash', type: 'Organization', importance: 'High', description: 'Semantic optimization AI engine used for prompt-guided discovery.' }
      ],
      claims_analysis: [
        {
          claim: 'Quantum Entanglement Pruning eliminates 90% of redundant attention heads without loss of expressivity.',
          evidenceScore: 'Strong',
          citationContext: 'Section 1 & 2: By mapping neural search spaces to Hilbert state spaces, Q-NAS reduces architectural iteration latency by 68%... Entanglement-Guided Pruning eliminates redundant heads.',
          page: 1,
          paragraph: 2
        },
        {
          claim: 'NISQ decoherence noise can be effectively mitigated using Zero-Noise Extrapolation (ZNE) without active quantum error correction.',
          evidenceScore: 'Moderate',
          citationContext: 'Section 3: NISQ decoherence noise can be effectively mitigated using Zero-Noise Extrapolation (ZNE) without active quantum error correction.',
          page: 2,
          paragraph: 3
        },
        {
          claim: 'Q-NAS outperforms standard Auto-Keras by 4.3x in hyper-parameter exploration speed.',
          evidenceScore: 'Strong',
          citationContext: 'Section 1: Classical search requires over 10,000 GPU hours. Q-NAS reduces architectural iteration latency by 68%.',
          page: 1,
          paragraph: 2
        }
      ],
      created_at: new Date().toISOString()
    });

    // Seed Insights for doc 2
    this.insights.set(doc2Id, {
      id: 'ins-sample-002',
      document_id: doc2Id,
      summary: '1. Proposes InsightMesh multi-model orchestration framework using Gemini 3 Flash and Pro for real-time evidence synthesis.\n2. Visual Knowledge Graphs improve evidence verification speed by 3.8x compared to tabular search.\n3. Contradicts Q-NAS decoherence claims, demonstrating that Zero-Noise Extrapolation degrades beyond 50 qubits without Surface Codes.',
      key_entities: [
        { name: 'InsightMesh Framework', type: 'Methodology', importance: 'High', description: 'Multi-model evidence synthesis & Knowledge Graph extraction system.' },
        { name: 'Zero-Noise Extrapolation (ZNE)', type: 'Methodology', importance: 'High', description: 'Mitigation strategy evaluated under high-depth quantum workloads.' },
        { name: 'Fault-Tolerant Surface Codes', type: 'Concept', importance: 'High', description: 'Active quantum error correction required for high qubit counts.' },
        { name: 'Gemini 3 Pro', type: 'Organization', importance: 'High', description: 'Large-context reasoning model for multi-document synthesis.' },
        { name: 'Evidence Traceability', type: 'Concept', importance: 'High', description: 'Direct visual mapping from claims to source document paragraph IDs.' }
      ],
      claims_analysis: [
        {
          claim: 'Zero-Noise Extrapolation is insufficient for high-depth quantum circuits beyond 50 qubits, contradicting early Q-NAS claims.',
          evidenceScore: 'Strong',
          citationContext: 'Section 2 & 3: Zero-Noise Extrapolation is insufficient for high-depth quantum circuits beyond 50 qubits... exponential decoherence degradation above 32 qubits.',
          page: 1,
          paragraph: 3,
          conflictWithDoc: doc1Id
        },
        {
          claim: 'Multi-Model Orchestration with Gemini 3 Flash reduces entity relation parsing latency to sub-800ms per 10k tokens.',
          evidenceScore: 'Strong',
          citationContext: 'Section 2: Multi-Model Orchestration with Gemini 3 Flash reduces entity relation parsing latency to sub-800ms per 10k tokens.',
          page: 1,
          paragraph: 2
        },
        {
          claim: 'Visual Knowledge Graph representations improve human evidence verification speed by 3.8x.',
          evidenceScore: 'Strong',
          citationContext: 'Section 2: Visual Knowledge Graph representations improve human evidence verification speed by 3.8x compared to tabular search interfaces.',
          page: 1,
          paragraph: 2
        }
      ],
      created_at: new Date().toISOString()
    });
  }

  // User Operations
  findUserByEmail(email) {
    for (const user of this.users.values()) {
      if (user.email.toLowerCase() === email.toLowerCase()) {
        return user;
      }
    }
    return null;
  }

  findUserById(id) {
    return this.users.get(id) || null;
  }

  createUser({ email, password_hash }) {
    const id = `usr-${crypto.randomUUID()}`;
    const user = {
      id,
      email,
      password_hash,
      created_at: new Date().toISOString()
    };
    this.users.set(id, user);
    return user;
  }

  // Document Operations
  getDocumentsByUser(userId) {
    const userDocs = [];
    for (const doc of this.documents.values()) {
      if (doc.user_id === userId || userId === 'usr-demo-001') {
        const insight = this.insights.get(doc.id);
        userDocs.push({
          ...doc,
          has_insight: Boolean(insight),
          insight_id: insight?.id
        });
      }
    }
    return userDocs.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }

  getDocumentById(id) {
    return this.documents.get(id) || null;
  }

  createDocument({ user_id, title, file_path, extracted_text }) {
    const id = `doc-${crypto.randomUUID()}`;
    const doc = {
      id,
      user_id,
      title,
      file_path,
      extracted_text,
      created_at: new Date().toISOString()
    };
    this.documents.set(id, doc);
    return doc;
  }

  deleteDocument(id) {
    this.documents.delete(id);
    this.insights.delete(id);
    return true;
  }

  // Insight Operations
  getInsightByDocumentId(documentId) {
    return this.insights.get(documentId) || null;
  }

  saveInsight({ document_id, summary, key_entities, claims_analysis }) {
    const existing = this.insights.get(document_id);
    const id = existing ? existing.id : `ins-${crypto.randomUUID()}`;
    const insight = {
      id,
      document_id,
      summary,
      key_entities,
      claims_analysis,
      created_at: new Date().toISOString()
    };
    this.insights.set(document_id, insight);
    return insight;
  }
}

export const localStore = new LocalStore();
