const steps = [
  {
    kicker: "从问题开始",
    title: "“为什么支付接口在重试后重复扣款？”",
    copy: "Agent 不必先读完整支付系统。问题中的“重试”和“重复扣款”已经告诉它，应该优先寻找请求幂等、重试策略和订单状态机。",
    evidence: ["任务：排查重复扣款", "关键词：重试、幂等"],
    decision: "搜索 <code>idempotency</code> 与 <code>retry</code>",
  },
  {
    kicker: "找到入口",
    title: "从仓库中锁定支付边界",
    copy: "搜索结果将范围缩小到支付客户端、订单服务和接口约定。此时无需加载营销、库存或整个代码库的历史记录。",
    evidence: ["payment-client.ts", "order-service.ts", "API 契约：支付请求"],
    decision: "读取 <code>payment-client.ts</code> 中的重试分支",
  },
  {
    kicker: "沿证据展开",
    title: "一份代码，指向两份真正相关的资料",
    copy: "重试分支引用了幂等键规范和订单状态转换图。Agent 根据这个局部证据继续阅读，而不是用泛化检索猜测系统设计。",
    evidence: ["幂等键规范", "订单状态机", "重试分支调用栈"],
    decision: "比对失败请求的幂等键与状态迁移记录",
  },
  {
    kicker: "上下文已经足够",
    title: "根因：重试请求没有复用原始幂等键",
    copy: "现在 Agent 已具备提出修复和测试的精确依据：重试层生成了新键，导致支付网关将同一业务请求视为两次独立扣款。",
    evidence: ["根因已定位", "修复范围：重试层", "验证：重复提交测试"],
    decision: "修改重试逻辑，并新增幂等性回归测试",
  },
];

const buttons = [...document.querySelectorAll(".step")];
const kicker = document.querySelector("#panel-kicker");
const title = document.querySelector("#panel-title");
const copy = document.querySelector("#panel-copy");
const evidence = document.querySelector("#panel-evidence");
const decision = document.querySelector("#panel-decision strong");

function selectStep(index) {
  const step = steps[index];
  buttons.forEach((button, buttonIndex) => {
    const active = buttonIndex === index;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-selected", String(active));
  });

  kicker.textContent = step.kicker;
  title.textContent = step.title;
  copy.textContent = step.copy;
  evidence.replaceChildren(...step.evidence.map((item) => {
    const tag = document.createElement("span");
    tag.textContent = item;
    return tag;
  }));
  decision.innerHTML = step.decision;
}

buttons.forEach((button, index) => {
  button.addEventListener("click", () => selectStep(index));
  button.addEventListener("keydown", (event) => {
    if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const nextIndex = event.key === "ArrowDown"
      ? (index + 1) % buttons.length
      : event.key === "ArrowUp"
        ? (index - 1 + buttons.length) % buttons.length
        : event.key === "Home"
          ? 0
          : buttons.length - 1;
    buttons[nextIndex].focus();
    selectStep(nextIndex);
  });
});
