# 推文文案

## 中文版

“渐进式披露”不只是把界面内容折叠起来。

对 Agent 而言，它意味着：不要一开始把所有数据、政策和工具都塞进上下文；让当前问题的证据，决定下一步读取什么。

我把这个思路做成了一个可运行的小项目 **Support Ladder**：一个客服升级工作台。

它从客户消息开始，只在必要时解锁订单、支付、物流或退款政策；每一次读取都会留下“为什么要读”的审计轨迹，最后才生成处理建议和客户答复。

这是一种我称为 evidence-gated support 的应用：用证据控制上下文，而不是让一个全知助手默认看到一切。

仓库链接：https://github.com/Zhang21901/context-ladder

## English version

Progressive disclosure is not just a UI pattern.

For agents, it means: do not load every data source, policy, and tool at the start. Let evidence from the current task determine what to read next.

I turned this into a runnable project called **Support Ladder**, an evidence-gated customer-support workspace.

It starts with the customer message, reveals order, payment, carrier, or policy records only when needed, logs why each record was read, and generates a resolution only after sufficient evidence exists.

This is evidence-gated support: context controlled by evidence, not an all-seeing assistant by default.

Repository: https://github.com/Zhang21901/context-ladder
