# X Thread: Progressive Disclosure and Support Ladder

## 1/4

Progressive disclosure does not mean forcing a workflow into more steps.

It means exposing only the minimum information and capabilities needed for the current task. A deeper layer appears only when the current context establishes a reason to need it.

Like a map: you do not see every alley at the city level.

## 2/4

For agents, this means not loading an entire codebase, knowledge base, and every tool description at the start.

Give the agent basic search and read capabilities. Search results point to files; files point to skills, APIs, or database guidance. The agent decides whether to expand based on the evidence it already found.

## 3/4

I built a small application of this idea: **Support Ladder**.

It starts with a customer message. A duplicate-charge report reveals an order summary; two successful payments reveal the idempotency record; only a confirmed duplicate charge reveals the refund policy.

Unrelated history, policies, and data are never loaded.

## 4/4

This is not just about saving tokens.

It makes an agent's context more relevant, data access more restrained, and decisions auditable: every read can answer what was read and why it was needed now.

I call this customer-support pattern evidence-gated support.

Project: https://github.com/Zhang21901/context-ladder
