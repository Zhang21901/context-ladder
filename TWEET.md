# X 推文线程

## 中文版

### 1/4

“渐进式披露”不等于把一个流程强行拆成更多步骤。

它的意思是：默认只暴露完成当前任务所需的最小信息和能力；只有当前上下文证明“确实需要下一层”时，下一层才出现。

像地图不会一打开就显示每条巷子。你先看到城市，放大到街区，才看到细节。

### 2/4

放到 Agent 上，这意味着不要一开始就把整个代码库、知识库和所有工具说明塞进上下文。

先给它搜索、读取这类基础能力。搜索结果指向相关文件；文件再指向 Skill、API 或数据库说明。Agent 根据前一层证据，自己决定要不要继续展开。

### 3/4

我把这个想法做成了一个小项目：**Support Ladder**。

它从一条客户消息开始。例如“重复扣款”先触发订单摘要；两次成功支付才触发幂等记录；确认重复后，才读取退款政策。

不相关的客户历史、政策和数据始终不会被加载。

### 4/4

这不是只为了省 token。

它让 Agent 的上下文更相关，数据访问更克制，决策路径也可审计：每次读取都能回答“读了什么，以及为什么现在要读它”。

我把这种客服应用称为 evidence-gated support。

项目： https://github.com/Zhang21901/context-ladder

## English version

### 1/4

Progressive disclosure does not mean forcing a workflow into more steps.

It means exposing only the minimum information and capabilities needed for the current task. A deeper layer appears only when the current context establishes a reason to need it.

Like a map: you do not see every alley at the city level.

### 2/4

For agents, this means not loading an entire codebase, knowledge base, and every tool description at the start.

Give the agent basic search and read capabilities. Search results point to files; files point to skills, APIs, or database guidance. The agent decides whether to expand based on the evidence it already found.

### 3/4

I built a small application of this idea: **Support Ladder**.

It starts with a customer message. A duplicate-charge report reveals an order summary; two successful payments reveal the idempotency record; only a confirmed duplicate charge reveals the refund policy.

Unrelated history, policies, and data are never loaded.

### 4/4

This is not just about saving tokens.

It makes an agent's context more relevant, data access more restrained, and decisions auditable: every read can answer what was read and why it was needed now.

I call this customer-support pattern evidence-gated support.

Project: https://github.com/Zhang21901/context-ladder
