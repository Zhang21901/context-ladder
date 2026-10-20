const cases = {
  "duplicate-charge": {
    id: "CS-2841",
    title: "重复扣款",
    goal: "确认扣款是否重复，并在不暴露无关账户记录的前提下完成退款或升级。",
    message: "我昨晚下单一次，银行卡却收到了两笔 128 元的扣款通知。请尽快处理。",
    meta: "客户：Ming · 渠道：站内支持 · 优先级：高",
    signals: ["双笔扣款", "同一订单", "高优先级"],
    scope: "订单标识与支付摘要",
    steps: [
      {
        name: "订单摘要",
        subtitle: "订单 CS-2841 的支付状态",
        reason: "客户提供了订单线索和金额，先核对订单与支付尝试次数。",
        source: "Order service · order summary",
        title: "同一订单存在两次支付尝试",
        copy: "订单状态为已支付。支付服务在 23:14:08 与 23:14:11 记录了两次成功回调，金额均为 128 元。",
        facts: [["订单状态", "已支付"], ["支付尝试", "2 次成功"], ["暴露范围", "订单号、金额、时间"]],
      },
      {
        name: "支付幂等记录",
        subtitle: "两次回调是否属于同一请求",
        reason: "订单摘要显示两次成功回调，只有支付幂等记录能判断它们是否是重复执行。",
        source: "Payments · idempotency log",
        title: "第二次回调使用了新的幂等键",
        copy: "两次支付请求来自同一会话，但重试层为第二次请求生成了新的幂等键。网关因此将其认定为独立扣款。",
        facts: [["会话", "同一用户会话"], ["幂等键", "2 个不同值"], ["风险结论", "确认重复扣款"]],
      },
      {
        name: "退款政策",
        subtitle: "已确认重复扣款的自动处理规则",
        reason: "重复扣款已被确认，才读取与此结果匹配的退款授权规则。",
        source: "Support policy · duplicate charge",
        title: "可自动原路退款，无需人工审批",
        copy: "重复扣款且金额一致的订单，允许自动退回后一次支付；退款预计 3 至 5 个工作日到账。",
        facts: [["退款资格", "已满足"], ["处理方式", "原路退款"], ["人工升级", "无需"]],
      },
    ],
    resolution: {
      action: "发起 128 元原路退款",
      copy: "重复扣款已经由支付幂等记录确认。系统应只对后一次支付发起退款，并保留订单与支付证据链。",
      reply: "抱歉给您带来困扰。我们已确认该订单发生重复扣款，并已为后一次 128 元扣款发起原路退款。款项通常会在 3 至 5 个工作日内到账。",
    },
  },
  "late-delivery": {
    id: "CS-2907",
    title: "物流延迟",
    goal: "识别包裹停滞的真实节点，只读取必要的物流与补偿规则。",
    message: "包裹显示三天前已经到达分拣中心，但之后一直没有更新。明天是送达承诺日。",
    meta: "客户：Rui · 渠道：邮件 · 优先级：标准",
    signals: ["扫描停滞", "承诺日临近", "跨城配送"],
    scope: "运单状态与配送承诺",
    steps: [
      {
        name: "运单摘要",
        subtitle: "确认最后扫描与承诺日期",
        reason: "客户描述的是扫描停滞，先核对实际运单时间线。",
        source: "Fulfillment · shipment summary",
        title: "包裹在区域分拣中心停滞 72 小时",
        copy: "最后一次扫描发生在区域分拣中心。系统预计到达日为明天，当前没有出库扫描记录。",
        facts: [["最后扫描", "72 小时前"], ["承诺日", "明天"], ["当前节点", "区域分拣中心"]],
      },
      {
        name: "承运商异常",
        subtitle: "是否存在可验证的运输中断",
        reason: "包裹已超过正常节点停留时间，读取该线路的承运商异常说明。",
        source: "Carrier feed · lane incident",
        title: "该线路因天气延误暂停干线转运",
        copy: "承运商状态表明该区域因天气影响暂停干线转运，预计恢复时间为今天 18:00。",
        facts: [["异常类型", "天气延误"], ["影响范围", "区域线路"], ["预计恢复", "今天 18:00"]],
      },
      {
        name: "延迟补偿政策",
        subtitle: "确认是否可主动提供补偿",
        reason: "承诺日可能无法满足，才读取延迟补偿的适用边界。",
        source: "Support policy · delivery promise",
        title: "承诺日未送达可提供运费抵扣券",
        copy: "若包裹在承诺日结束前仍未送达，可主动提供下一笔订单的运费抵扣券，不需要取消当前订单。",
        facts: [["补偿资格", "承诺日后生效"], ["补偿方式", "运费抵扣券"], ["取消建议", "暂不建议"]],
      },
    ],
    resolution: {
      action: "记录异常并设置承诺日后自动补偿",
      copy: "当前可确认运输异常，但不应在承诺日前承诺补偿。设置跟进节点，让系统在承诺日结束后自动处理。",
      reply: "抱歉让您久等。我们已确认包裹目前受到区域天气延误影响，承运商预计今天恢复转运。我们会持续跟进；若包裹未能在承诺日内送达，将自动为您提供运费补偿。",
    },
  },
  "refund-window": {
    id: "CS-2963",
    title: "退款资格",
    goal: "只核对商品状态、签收时间和适用政策，避免过早读取完整订单历史。",
    message: "商品昨天签收，但尺寸不合适。我还能申请退款吗？包装已经拆开了。",
    meta: "客户：Lin · 渠道：站内支持 · 优先级：标准",
    signals: ["签收后 24 小时", "尺码问题", "包装已拆"],
    scope: "商品、签收时间与售后条款",
    steps: [
      {
        name: "订单与签收摘要",
        subtitle: "确认商品类型与售后时限",
        reason: "退款资格首先取决于商品类型和签收日期，而非客户的完整购买历史。",
        source: "Order service · fulfillment summary",
        title: "商品为可退换服饰，签收未满 24 小时",
        copy: "订单商品属于标准服饰类目，已在昨天 16:34 签收，当前仍位于售后时限内。",
        facts: [["商品类目", "标准服饰"], ["签收时间", "昨天 16:34"], ["售后时限", "7 天"]],
      },
      {
        name: "商品限制",
        subtitle: "拆封是否影响该类目的退款",
        reason: "客户提到已拆封，需查询该类目特有的卫生与包装限制。",
        source: "Catalog policy · apparel returns",
        title: "拆封不影响服饰退款，吊牌需保持完整",
        copy: "标准服饰允许试穿与拆封；只要吊牌未剪除、商品无明显使用痕迹，即可办理退款。",
        facts: [["拆封影响", "不影响"], ["必要条件", "吊牌完整"], ["寄回方式", "预付退货标签"]],
      },
      {
        name: "退货流程",
        subtitle: "生成匹配当前订单的下一步动作",
        reason: "商品满足退货条件，才读取寄回和退款时点的操作规则。",
        source: "Support policy · return workflow",
        title: "可立即生成预付退货标签",
        copy: "客户提交退货后可获得预付标签。仓库首次扫描后启动退款，原路退款通常需要 3 至 5 个工作日。",
        facts: [["当前动作", "生成退货标签"], ["退款触发", "仓库首次扫描"], ["预计到账", "3 至 5 个工作日"]],
      },
    ],
    resolution: {
      action: "生成预付退货标签",
      copy: "订单在时限内，且商品类目允许拆封试穿。下一步只需提醒客户保留完整吊牌，并生成该订单的退货标签。",
      reply: "可以申请退款。该商品属于可退换服饰，拆封试穿不影响售后；请确保吊牌保持完整且商品没有明显使用痕迹。我们可以立即为您生成预付退货标签，仓库首次扫描后将启动原路退款。",
    },
  },
};

let currentCaseKey = "duplicate-charge";
let revealed = 0;
let started = false;
let audit = [];

const $ = (selector) => document.querySelector(selector);
const caseSelect = $("#case-select");
const startButton = $("#start-triage");
const resetButton = $("#reset-case");
const revealButton = $("#reveal-next");
const copyButton = $("#copy-reply");

function activeCase() {
  return cases[currentCaseKey];
}

function addAudit(title, detail) {
  audit.push({ title, detail, time: `事件 ${String(audit.length + 1).padStart(2, "0")}` });
}

function renderCaseDetails() {
  const caseData = activeCase();
  $("#customer-message").textContent = `“${caseData.message}”`;
  $("#case-meta").textContent = caseData.meta;
  $("#signal-list").replaceChildren(...caseData.signals.map((signal) => {
    const tag = document.createElement("span");
    tag.textContent = signal;
    return tag;
  }));
  $("#case-id").textContent = caseData.id;
  $("#case-title").textContent = caseData.title;
  $("#case-goal").textContent = caseData.goal;
}

function renderContextList() {
  const steps = activeCase().steps;
  const list = $("#context-list");
  list.replaceChildren(...steps.map((step, index) => {
    const item = document.createElement("li");
    item.className = "context-item";
    if (index < revealed) item.classList.add("is-read");
    if (started && index === revealed && revealed < steps.length) item.classList.add("is-current");
    if (index > revealed || !started) item.classList.add("is-locked");
    item.innerHTML = `
      <span class="context-index">${String(index + 1).padStart(2, "0")}</span>
      <span>
        <span class="context-name">${step.name}</span>
        <span class="context-subtitle">${step.subtitle}</span>
        ${index < revealed ? `<span class="unlock-note">已依据当前信号读取</span>` : ""}
      </span>
    `;
    return item;
  }));
}

function renderEvidence() {
  const hasEvidence = revealed > 0;
  const step = activeCase().steps[Math.max(revealed - 1, 0)];
  $("#evidence-empty").hidden = hasEvidence;
  $("#evidence-content").hidden = !hasEvidence;
  $("#read-state").textContent = hasEvidence ? `已读取 ${revealed} 份` : "尚未读取";
  $("#read-state").classList.toggle("is-ready", hasEvidence);

  if (!hasEvidence) return;

  $("#evidence-source").textContent = step.source;
  $("#evidence-title").textContent = step.title;
  $("#evidence-copy").textContent = step.copy;
  $("#evidence-reason").textContent = step.reason;
  $("#evidence-facts").replaceChildren(...step.facts.map(([term, value]) => {
    const row = document.createElement("div");
    const dt = document.createElement("dt");
    const dd = document.createElement("dd");
    dt.textContent = term;
    dd.textContent = value;
    row.append(dt, dd);
    return row;
  }));
}

function renderResolution() {
  const complete = revealed === activeCase().steps.length;
  $("#resolution-empty").hidden = complete;
  $("#resolution-content").hidden = !complete;
  $("#resolution-badge").textContent = complete ? "可执行" : "待定";
  $("#resolution-badge").classList.toggle("is-ready", complete);
  if (!complete) return;

  const resolution = activeCase().resolution;
  $("#resolution-action").textContent = resolution.action;
  $("#resolution-copy").textContent = resolution.copy;
  $("#reply-draft").textContent = resolution.reply;
}

function renderAudit() {
  const list = $("#audit-list");
  $("#audit-count").textContent = `${audit.length} events`;
  if (audit.length === 0) {
    const empty = document.createElement("li");
    empty.className = "audit-empty";
    empty.textContent = "尚无记录。分诊开始后，每次上下文展开都会在这里留下原因。";
    list.replaceChildren(empty);
    return;
  }
  list.replaceChildren(...audit.map((entry) => {
    const item = document.createElement("li");
    item.innerHTML = `<span class="audit-time">${entry.time}</span><strong>${entry.title}</strong><p>${entry.detail}</p>`;
    return item;
  }));
}

function renderMetrics() {
  const caseData = activeCase();
  const complete = revealed === caseData.steps.length;
  $("#record-count").textContent = `${revealed} / ${caseData.steps.length}`;
  $("#data-scope").textContent = revealed === 0 ? "仅客户消息" : caseData.scope;
  $("#decision-state").textContent = complete ? "可执行处理" : started ? "继续核验" : "等待分诊";
  revealButton.disabled = !started || complete;
  revealButton.setAttribute("aria-label", complete ? "已读取全部必要记录" : "读取下一份必要记录");
  revealButton.title = revealButton.getAttribute("aria-label");
}

function render() {
  renderCaseDetails();
  renderContextList();
  renderEvidence();
  renderResolution();
  renderAudit();
  renderMetrics();
}

function startTriage() {
  if (started) return;
  started = true;
  addAudit("接收案例", "记录初始客户消息与问题信号；未读取订单历史。 ");
  revealNext();
}

function revealNext() {
  if (!started || revealed >= activeCase().steps.length) return;
  const step = activeCase().steps[revealed];
  revealed += 1;
  addAudit(`读取：${step.name}`, step.reason);
  if (revealed === activeCase().steps.length) {
    addAudit("形成处理建议", "所有必要依据均已具备，停止扩展上下文。 ");
  }
  render();
}

function resetCase() {
  revealed = 0;
  started = false;
  audit = [];
  copyButton.textContent = "复制答复";
  render();
}

async function copyReply() {
  const text = activeCase().resolution.reply;
  try {
    await navigator.clipboard.writeText(text);
    copyButton.textContent = "已复制";
  } catch {
    const draft = $("#reply-draft");
    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(draft);
    selection.removeAllRanges();
    selection.addRange(range);
    copyButton.textContent = "已选中答复";
  }
}

caseSelect.addEventListener("change", (event) => {
  currentCaseKey = event.target.value;
  resetCase();
});
startButton.addEventListener("click", startTriage);
resetButton.addEventListener("click", resetCase);
revealButton.addEventListener("click", revealNext);
copyButton.addEventListener("click", copyReply);

render();
