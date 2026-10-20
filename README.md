# Support Ladder

A runnable, bilingual prototype for **evidence-gated support**: a practical application of progressive disclosure for customer-support workflows.

![Support Ladder workspace](assets/context-ladder-hero.png)

The interface defaults to English. Use the `EN / 中文` control in the header to switch every workflow label, case, evidence record, audit event, and reply draft to Chinese.

## What It Demonstrates

Instead of loading a customer profile, complete order history, every policy, and every support tool at the start, Support Ladder reveals the next record only when the evidence already collected justifies it.

For a duplicate charge, for example:

1. The customer message exposes an order clue and an amount.
2. That justifies reading the order summary.
3. Two successful payment callbacks justify reading the idempotency log.
4. A confirmed duplicate charge justifies reading the matching refund policy.
5. Once the evidence is sufficient, the system stops expanding context and produces a scoped resolution.

Every disclosure is recorded with its reason. Unrelated history, policy, and customer data remain unread.

The prototype includes three cases:

- Duplicate charge
- Late delivery
- Refund eligibility

## Run Locally

This is a static site with no build step. Open `index.html` directly, or start a local server:

```sh
python3 -m http.server 4173
```

Then open `http://localhost:4173`.

## Why Progressive Disclosure

Progressive disclosure is not merely splitting a fixed workflow into more steps. It starts from a deliberately small information surface and exposes a deeper layer only when the current task creates a reason for it.

For agents, that can mean beginning with basic search and read capabilities rather than preloading an entire codebase, knowledge base, or tool catalog. Search results can lead to files; files can lead to skills, APIs, or database guidance. The agent incrementally builds only the context needed to act.

## Assets

The workspace illustration at `assets/context-ladder-hero.png` was generated with OpenAI Image Generation.

## Post Copy

Ready-to-publish English X thread copy is in [TWEET.md](TWEET.md).

## License

MIT
