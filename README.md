# Mandrake Open Problems #1: The Retroviral Wall

A machine learning challenge by [Mandrake Bioworks](https://www.mandrakebio.com) — making gene editing scalable with AI.

**Submissions close:** April 30, 2026
**Details & prizes:** [mandrakebio.com/retroviral-wall-challenge](https://mandrakebio.com/retroviral-wall-challenge)
**Submit to:** challenges@mandrakebio.com

---

## The Problem

Prime editing is one of the most precise genome editing technologies available — it can write any small DNA change without double-strand breaks or donor DNA. It works by fusing a Cas9 nickase to a reverse transcriptase (RT), which reads an RNA template and writes the edit directly into the genome.

But prime editing has its own challenges. The most efficient RTs come from MMLV (Moloney Murine Leukemia Virus) — but they're large, limiting delivery options. We need smaller editors with higher processivity and efficiency. The problem: **predicting which RT enzymes will actually work is hard.**

Most ML models trained on this data just memorize "Retroviral = active" and fail when tested on held-out evolutionary families. We want models that learn real biophysical patterns, not family shortcuts.

---

## Why This Is Hard

Yes, 57 samples with 98 features is a small-data problem. Standard ML approaches will overfit. That's the point — we want to see who can extract real signal from limited, high-dimensional biological data. This mirrors the reality of experimental biology, where datasets are expensive and small.

---

## Baseline Results (Leave-One-Family-Out)

We've tested several approaches. Here's what we've tried — beat this:

| Approach | F1 | AUC | TP/21 | Retroviral TP/12 | Notes |
|----------|-----|-----|-------|------------------|-------|
| Predict all inactive | 0.000 | 0.500 | 0/21 | 0/12 | Trivial baseline |
| ESM-2 + Ridge (α=1000) | 0.000 | 0.548 | 0/21 | 0/12 | Embeddings memorize family |
| ESM-2 + RF (d=10) | 0.000 | 0.485 | 0/21 | 0/12 | Same problem |
| **HandCrafted + RF (d=10)** | **0.533** | **0.777** | **8/21** | **2/12** | Best overall (98 features) |
| HandCrafted + LogReg (C=0.01) | 0.467 | 0.460 | 7/21 | 2/12 | |
| PLS experts + RF | 0.533 | 0.495 | 8/21 | 2/12 | PLS compression doesn't help |
| PLS + LightGBM LambdaRank | 0.524 | 0.759 | 11/21 | 6/12 | Best Retroviral recall, but 10 FPs |
| Within-family pairwise SVM | 0.426 | 0.563 | 10/21 | 2/12 | More TPs, many more FPs |

**Key insight:** ESM-2 embeddings completely fail under LOFO — they encode evolutionary relationships so strongly that the model just learns "Retroviral = active". Hand-crafted biophysical features generalize better.

---

## Evaluation

### Stage 1: Cross-Validation (April 2026)
- **Primary metric**: LOFO Macro-F1 across 4 informative folds (Retroviral, Retron, LTR_Retrotransposon, Group_II_Intron)
- **Secondary**: Retroviral fold TP/12, LOO-CV F1
- **Bonus**: Spearman ρ on ranking active RTs by efficiency

Top 3-5 finalists selected based on quantitative performance + methodological novelty.

### Stage 2: Proprietary Validation (Q2 2026)
Finalist approaches run on Mandrake's internal experimental data — RT enzymes not in this dataset, tested in our lab. Final winner determined by generalization to this unseen data.

---

## Data Files

```
data/
├── rt_sequences.csv          # RT names, sequences, activity labels, families
├── handcrafted_features.csv  # 98 biophysical features per RT
├── esm2_embeddings.npz       # 1280-dim ESM-2 embeddings
├── family_splits.csv         # Family assignments for LOFO evaluation
├── feature_dictionary.csv    # Feature descriptions
└── structures/               # ESMFold predicted structures (PDB format)
```

---

## Rules

1. Report both LOFO and LOO-CV results
2. Report Retroviral fold separately
3. External data allowed (public databases, LLMs, structural predictions) — describe everything
4. Pipeline must be fully automated and reproducible. We will run your code.
5. No manual curation of predictions
6. All submissions open-sourced under MIT license upon winner announcement

---

## Submission

Email to **challenges@mandrakebio.com** by **April 30, 2026** with:

1. **Code**: Full runnable pipeline (notebook or scripts) with `requirements.txt`
2. **Predictions CSV**: `rt_name, predicted_active, predicted_score`
3. **Writeup**: 1-2 pages. What you did, why, what worked, what didn't.

See `submissions/example_submission.csv` for format.

---

## License

**Code**: MIT
**Data**: Derived from Doman et al. (2023), features and embeddings provided under CC-BY-4.0.

---

## Links

- [Challenge Website](https://mandrakebio.com/retroviral-wall-challenge)
- [Mandrake Bioworks](https://mandrakebio.com)
- [Doman et al. (2023) Paper](https://www.nature.com/articles/s41587-023-01685-z)
