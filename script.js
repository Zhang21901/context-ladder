const copy = {
  en: {
    title: "Support Ladder | Evidence-Gated Support",
    workspaceStatus: "Evidence-gated workspace",
    workspaceStatusLabel: "Workspace status",
    languageSelection: "Language selection",
    workspaceVisualAlt: "A workspace illustration of files and records connected in layers",
    caseIntake: "Case intake",
    chooseCase: "Choose a case to triage",
    customerRequest: "Customer request",
    customerMessage: "Customer message",
    initialSignals: "Initial signals",
    startTriage: "Start triage",
    resetCase: "Reset case",
    railNote: "Only the next record justified by current evidence can be read.",
    activeSupportCase: "Active support case",
    recordsRead: "Records read",
    minimumScope: "Minimum data scope",
    decisionState: "Decision state",
    initialScope: "Customer message only",
    awaitingTriage: "Awaiting triage",
    continueVerification: "Continue verification",
    resolutionReady: "Resolution ready",
    contextLadder: "Context ladder",
    evidencePath: "Evidence path",
    readNext: "Read next required record",
    allRead: "All required records have been read",
    currentEvidence: "Current evidence",
    currentBasis: "Current basis",
    notRead: "Not read",
    readCount: (count) => `Read ${count}`,
    evidenceEmpty: "Once triage starts, only the first record directly relevant to the case is shown.",
    readReason: "Why this was read",
    resolution: "Resolution",
    resolutionAdvice: "Resolution advice",
    pending: "Pending",
    ready: "Ready",
    resolutionEmpty: "Once sufficient evidence is collected, an executable response and escalation action will appear here.",
    recommendedAction: "Recommended action",
    replyDraft: "Customer reply draft",
    copyReply: "Copy reply",
    copied: "Copied",
    selected: "Reply selected",
    disclosureLog: "Disclosure log",
    auditTrail: "Audit trail",
    events: (count) => `${count} events`,
    event: (count) => `Event ${String(count).padStart(2, "0")}`,
    auditEmpty: "No activity yet. Each context disclosure will appear here with its reason after triage begins.",
    unlocked: "Read because current evidence justified it",
    intakeAuditTitle: "Case received",
    intakeAuditDetail: "Recorded the customer message and initial signals; no order history was read.",
    readAuditTitle: (name) => `Read: ${name}`,
    resolutionAuditTitle: "Resolution formed",
    resolutionAuditDetail: "All necessary evidence is available. Context expansion stopped.",
  },
  zh: {
    title: "Support Ladder | 证据驱动的客服工作台",
    workspaceStatus: "证据驱动工作台",
    workspaceStatusLabel: "工作台状态",
    languageSelection: "语言选择",
    workspaceVisualAlt: "文件与资料卡片被逐层连接的工作台插图",
    caseIntake: "案例接入",
    chooseCase: "选择一个待处理问题",
    customerRequest: "客户请求",
    customerMessage: "客户消息",
    initialSignals: "初始信号",
    startTriage: "开始分诊",
    resetCase: "重置当前案例",
    railNote: "仅在当前证据触发时读取下一份记录。",
    activeSupportCase: "当前支持案例",
    recordsRead: "已读取记录",
    minimumScope: "最小数据范围",
    decisionState: "决策状态",
    initialScope: "仅客户消息",
    awaitingTriage: "等待分诊",
    continueVerification: "继续核验",
    resolutionReady: "可执行处理",
    contextLadder: "上下文阶梯",
    evidencePath: "证据路径",
    readNext: "读取下一份必要记录",
    allRead: "已读取全部必要记录",
    currentEvidence: "当前依据",
    currentBasis: "当前依据",
    notRead: "尚未读取",
    readCount: (count) => `已读取 ${count} 份`,
    evidenceEmpty: "开始分诊后，系统只会展示与当前问题直接相关的首份记录。",
    readReason: "读取理由",
    resolution: "处理建议",
    resolutionAdvice: "处理建议",
    pending: "待定",
    ready: "可执行",
    resolutionEmpty: "收集到足够依据后，这里会生成可执行的答复与升级动作。",
    recommendedAction: "建议动作",
    replyDraft: "客户答复草案",
    copyReply: "复制答复",
    copied: "已复制",
    selected: "已选中答复",
    disclosureLog: "披露记录",
    auditTrail: "审计轨迹",
    events: (count) => `${count} 条事件`,
    event: (count) => `事件 ${String(count).padStart(2, "0")}`,
    auditEmpty: "尚无记录。分诊开始后，每次上下文展开都会在这里留下原因。",
    unlocked: "已依据当前信号读取",
    intakeAuditTitle: "接收案例",
    intakeAuditDetail: "记录初始客户消息与问题信号；未读取订单历史。",
    readAuditTitle: (name) => `读取：${name}`,
    resolutionAuditTitle: "形成处理建议",
    resolutionAuditDetail: "所有必要依据均已具备，停止扩展上下文。",
  },
};

const cases = {
  en: {
    "duplicate-charge": {
      id: "CS-2841", title: "Duplicate charge", goal: "Confirm whether the charge is duplicated, then resolve it without exposing irrelevant account records.",
      message: "I placed one order last night, but my bank sent two charge notifications for $18. Please fix this quickly.",
      meta: "Customer: Ming · Channel: In-app support · Priority: High", signals: ["Two charges", "Same order", "High priority"], scope: "Order identifier and payment summary",
      steps: [
        { name: "Order summary", subtitle: "Payment state for order CS-2841", reason: "The customer supplied an order clue and an amount, so first verify the order and number of payment attempts.", source: "Order service · order summary", title: "One order has two successful payment attempts", copy: "The order is paid. The payment service recorded two successful callbacks at 23:14:08 and 23:14:11, both for $18.", facts: [["Order status", "Paid"], ["Payment attempts", "2 successful"], ["Data exposed", "Order ID, amount, timestamps"]] },
        { name: "Payment idempotency log", subtitle: "Did both callbacks belong to one request?", reason: "The order summary shows two successful callbacks. Only the idempotency record can tell whether they were duplicate execution.", source: "Payments · idempotency log", title: "The retry used a new idempotency key", copy: "Both payment requests came from the same session, but the retry layer generated a new idempotency key. The gateway therefore treated it as a separate charge.", facts: [["Session", "Same customer session"], ["Idempotency keys", "2 different values"], ["Risk conclusion", "Duplicate charge confirmed"]] },
        { name: "Refund policy", subtitle: "Automatic handling rules for a confirmed duplicate", reason: "The duplicate charge is confirmed, so the matching refund authorization policy is now relevant.", source: "Support policy · duplicate charge", title: "An automatic original-method refund is allowed", copy: "For a confirmed, equal-amount duplicate charge, the later payment can be refunded automatically. Funds normally arrive in 3 to 5 business days.", facts: [["Refund eligibility", "Met"], ["Method", "Original payment method"], ["Human escalation", "Not required"]] },
      ],
      resolution: { action: "Refund the later $18 charge", copy: "The idempotency record confirms a duplicate charge. Refund only the later payment and retain the order and payment evidence chain.", reply: "Sorry for the trouble. We confirmed that this order was charged twice and have initiated a refund for the later $18 charge to your original payment method. Funds typically arrive within 3 to 5 business days." },
    },
    "late-delivery": {
      id: "CS-2907", title: "Late delivery", goal: "Identify the actual stalled shipment point, and read only the carrier and compensation rules needed to resolve it.",
      message: "My package reached a sorting center three days ago and has not updated since. Tomorrow is the promised delivery date.",
      meta: "Customer: Rui · Channel: Email · Priority: Standard", signals: ["Stalled scan", "Promise date near", "Intercity shipment"], scope: "Shipment state and delivery promise",
      steps: [
        { name: "Shipment summary", subtitle: "Verify the last scan and promised date", reason: "The customer reports a stalled scan, so verify the actual shipment timeline first.", source: "Fulfillment · shipment summary", title: "The parcel has been stalled at a regional sorting center for 72 hours", copy: "The last scan was recorded at a regional sorting center. The promised delivery date is tomorrow, with no outbound scan yet.", facts: [["Last scan", "72 hours ago"], ["Promise date", "Tomorrow"], ["Current node", "Regional sorting center"]] },
        { name: "Carrier incident", subtitle: "Verify a relevant transit disruption", reason: "The parcel has exceeded the normal dwell time, so read the carrier incident for this route.", source: "Carrier feed · lane incident", title: "Weather disruption paused line-haul transit", copy: "Carrier status indicates that weather paused line-haul transit for this region. The estimated recovery time is 18:00 today.", facts: [["Incident", "Weather disruption"], ["Scope", "Regional route"], ["Estimated recovery", "18:00 today"]] },
        { name: "Delay compensation policy", subtitle: "Confirm whether proactive compensation applies", reason: "The delivery promise may not be met, so now read the applicable boundary for delay compensation.", source: "Support policy · delivery promise", title: "A shipping credit applies only after the promise date passes", copy: "If the parcel has not arrived by the end of the promised date, a future-order shipping credit may be offered. The current order should not be cancelled yet.", facts: [["Compensation", "After promise date"], ["Method", "Shipping credit"], ["Cancellation", "Not advised yet"]] },
      ],
      resolution: { action: "Track the incident and schedule post-promise compensation", copy: "The transit issue is confirmed, but compensation should not be promised before the delivery deadline. Set a follow-up point for automatic handling after the promise date.", reply: "Sorry for the delay. We confirmed that your package is affected by a regional weather disruption, and the carrier expects transit to resume today. We will keep tracking it; if it does not arrive by the promised date, we will automatically provide shipping compensation." },
    },
    "refund-window": {
      id: "CS-2963", title: "Refund eligibility", goal: "Verify only product status, delivery time, and the applicable policy before accessing the broader order history.",
      message: "The item arrived yesterday but the size does not fit. Can I still request a refund? I opened the package.",
      meta: "Customer: Lin · Channel: In-app support · Priority: Standard", signals: ["Delivered within 24h", "Sizing issue", "Package opened"], scope: "Item, delivery time, and return terms",
      steps: [
        { name: "Order and delivery summary", subtitle: "Verify product type and return window", reason: "Refund eligibility starts with the product type and delivery date, not a customer's full purchase history.", source: "Order service · fulfillment summary", title: "The item is returnable apparel and was delivered under 24 hours ago", copy: "The item is standard apparel and was delivered yesterday at 16:34, leaving the order within its return window.", facts: [["Product category", "Standard apparel"], ["Delivered", "Yesterday at 16:34"], ["Return window", "7 days"]] },
        { name: "Product restrictions", subtitle: "Does opening the package affect this category?", reason: "The customer mentioned an opened package, so read the hygiene and packaging restrictions specific to this category.", source: "Catalog policy · apparel returns", title: "Opened packaging does not block an apparel return; tags must remain intact", copy: "Standard apparel may be opened and tried on. It remains returnable when the tags are intact and the item has no visible signs of use.", facts: [["Opened package", "Allowed"], ["Required condition", "Tags intact"], ["Return method", "Prepaid label"]] },
        { name: "Return workflow", subtitle: "Generate the next action for this order", reason: "The item satisfies return conditions, so the return label and refund-timing rules are now relevant.", source: "Support policy · return workflow", title: "A prepaid return label can be created now", copy: "The customer can receive a prepaid label. Refund processing starts at the warehouse's first scan and normally completes in 3 to 5 business days.", facts: [["Next action", "Create return label"], ["Refund trigger", "First warehouse scan"], ["Estimated arrival", "3 to 5 business days"]] },
      ],
      resolution: { action: "Create a prepaid return label", copy: "The order is in window and the category permits an opened package for fitting. Remind the customer to keep the tags intact, then issue the label for this order.", reply: "Yes, you can request a refund. This item is returnable apparel, and opening the package to try it on does not affect eligibility as long as the tags remain intact and the item shows no obvious use. We can create a prepaid return label now; your original-method refund begins after the warehouse's first scan." },
    },
  },
  zh: {
    "duplicate-charge": {
      id: "CS-2841", title: "重复扣款", goal: "确认扣款是否重复，并在不暴露无关账户记录的前提下完成退款或升级。",
      message: "我昨晚下单一次，银行卡却收到了两笔 128 元的扣款通知。请尽快处理。", meta: "客户：Ming · 渠道：站内支持 · 优先级：高", signals: ["双笔扣款", "同一订单", "高优先级"], scope: "订单标识与支付摘要",
      steps: [
        { name: "订单摘要", subtitle: "订单 CS-2841 的支付状态", reason: "客户提供了订单线索和金额，先核对订单与支付尝试次数。", source: "订单服务 · 订单摘要", title: "同一订单存在两次支付尝试", copy: "订单状态为已支付。支付服务在 23:14:08 与 23:14:11 记录了两次成功回调，金额均为 128 元。", facts: [["订单状态", "已支付"], ["支付尝试", "2 次成功"], ["暴露范围", "订单号、金额、时间"]] },
        { name: "支付幂等记录", subtitle: "两次回调是否属于同一请求", reason: "订单摘要显示两次成功回调，只有支付幂等记录能判断它们是否是重复执行。", source: "支付服务 · 幂等记录", title: "第二次回调使用了新的幂等键", copy: "两次支付请求来自同一会话，但重试层为第二次请求生成了新的幂等键。网关因此将其认定为独立扣款。", facts: [["会话", "同一用户会话"], ["幂等键", "2 个不同值"], ["风险结论", "确认重复扣款"]] },
        { name: "退款政策", subtitle: "已确认重复扣款的自动处理规则", reason: "重复扣款已被确认，才读取与此结果匹配的退款授权规则。", source: "支持政策 · 重复扣款", title: "可自动原路退款，无需人工审批", copy: "重复扣款且金额一致的订单，允许自动退回后一次支付；退款预计 3 至 5 个工作日到账。", facts: [["退款资格", "已满足"], ["处理方式", "原路退款"], ["人工升级", "无需"]] },
      ],
      resolution: { action: "发起 128 元原路退款", copy: "重复扣款已经由支付幂等记录确认。系统应只对后一次支付发起退款，并保留订单与支付证据链。", reply: "抱歉给您带来困扰。我们已确认该订单发生重复扣款，并已为后一次 128 元扣款发起原路退款。款项通常会在 3 至 5 个工作日内到账。" },
    },
    "late-delivery": {
      id: "CS-2907", title: "物流延迟", goal: "识别包裹停滞的真实节点，只读取必要的物流与补偿规则。",
      message: "包裹显示三天前已经到达分拣中心，但之后一直没有更新。明天是送达承诺日。", meta: "客户：Rui · 渠道：邮件 · 优先级：标准", signals: ["扫描停滞", "承诺日临近", "跨城配送"], scope: "运单状态与配送承诺",
      steps: [
        { name: "运单摘要", subtitle: "确认最后扫描与承诺日期", reason: "客户描述的是扫描停滞，先核对实际运单时间线。", source: "履约服务 · 运单摘要", title: "包裹在区域分拣中心停滞 72 小时", copy: "最后一次扫描发生在区域分拣中心。系统预计到达日为明天，当前没有出库扫描记录。", facts: [["最后扫描", "72 小时前"], ["承诺日", "明天"], ["当前节点", "区域分拣中心"]] },
        { name: "承运商异常", subtitle: "是否存在可验证的运输中断", reason: "包裹已超过正常节点停留时间，读取该线路的承运商异常说明。", source: "承运商状态 · 线路异常", title: "该线路因天气延误暂停干线转运", copy: "承运商状态表明该区域因天气影响暂停干线转运，预计恢复时间为今天 18:00。", facts: [["异常类型", "天气延误"], ["影响范围", "区域线路"], ["预计恢复", "今天 18:00"]] },
        { name: "延迟补偿政策", subtitle: "确认是否可主动提供补偿", reason: "承诺日可能无法满足，才读取延迟补偿的适用边界。", source: "支持政策 · 送达承诺", title: "承诺日未送达可提供运费抵扣券", copy: "若包裹在承诺日结束前仍未送达，可主动提供下一笔订单的运费抵扣券，不需要取消当前订单。", facts: [["补偿资格", "承诺日后生效"], ["补偿方式", "运费抵扣券"], ["取消建议", "暂不建议"]] },
      ],
      resolution: { action: "记录异常并设置承诺日后自动补偿", copy: "当前可确认运输异常，但不应在承诺日前承诺补偿。设置跟进节点，让系统在承诺日结束后自动处理。", reply: "抱歉让您久等。我们已确认包裹目前受到区域天气延误影响，承运商预计今天恢复转运。我们会持续跟进；若包裹未能在承诺日内送达，将自动为您提供运费补偿。" },
    },
    "refund-window": {
      id: "CS-2963", title: "退款资格", goal: "只核对商品状态、签收时间和适用政策，避免过早读取完整订单历史。",
      message: "商品昨天签收，但尺寸不合适。我还能申请退款吗？包装已经拆开了。", meta: "客户：Lin · 渠道：站内支持 · 优先级：标准", signals: ["签收后 24 小时", "尺码问题", "包装已拆"], scope: "商品、签收时间与售后条款",
      steps: [
        { name: "订单与签收摘要", subtitle: "确认商品类型与售后时限", reason: "退款资格首先取决于商品类型和签收日期，而非客户的完整购买历史。", source: "订单服务 · 履约摘要", title: "商品为可退换服饰，签收未满 24 小时", copy: "订单商品属于标准服饰类目，已在昨天 16:34 签收，当前仍位于售后时限内。", facts: [["商品类目", "标准服饰"], ["签收时间", "昨天 16:34"], ["售后时限", "7 天"]] },
        { name: "商品限制", subtitle: "拆封是否影响该类目的退款", reason: "客户提到已拆封，需查询该类目特有的卫生与包装限制。", source: "商品政策 · 服饰退货", title: "拆封不影响服饰退款，吊牌需保持完整", copy: "标准服饰允许试穿与拆封；只要吊牌未剪除、商品无明显使用痕迹，即可办理退款。", facts: [["拆封影响", "不影响"], ["必要条件", "吊牌完整"], ["寄回方式", "预付退货标签"]] },
        { name: "退货流程", subtitle: "生成匹配当前订单的下一步动作", reason: "商品满足退货条件，才读取寄回和退款时点的操作规则。", source: "支持政策 · 退货流程", title: "可立即生成预付退货标签", copy: "客户提交退货后可获得预付标签。仓库首次扫描后启动退款，原路退款通常需要 3 至 5 个工作日。", facts: [["当前动作", "生成退货标签"], ["退款触发", "仓库首次扫描"], ["预计到账", "3 至 5 个工作日"]] },
      ],
      resolution: { action: "生成预付退货标签", copy: "订单在时限内，且商品类目允许拆封试穿。下一步只需提醒客户保留完整吊牌，并生成该订单的退货标签。", reply: "可以申请退款。该商品属于可退换服饰，拆封试穿不影响售后；请确保吊牌保持完整且商品没有明显使用痕迹。我们可以立即为您生成预付退货标签，仓库首次扫描后将启动原路退款。" },
    },
  },
};

let locale = "en";
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

function words() { return copy[locale]; }
function activeCase() { return cases[locale][currentCaseKey]; }

function addAudit(title, detail) {
  audit.push({ title, detail, time: words().event(audit.length + 1) });
}

function renderStatic() {
  const text = words();
  document.documentElement.lang = locale === "en" ? "en" : "zh-CN";
  document.title = text.title;
  document.querySelectorAll("[data-i18n]").forEach((element) => { element.textContent = text[element.dataset.i18n]; });
  document.querySelectorAll("[data-i18n-aria]").forEach((element) => { element.setAttribute("aria-label", text[element.dataset.i18nAria]); });
  document.querySelectorAll("[data-i18n-alt]").forEach((element) => { element.alt = text[element.dataset.i18nAlt]; });
  document.querySelectorAll(".language-button").forEach((button) => {
    const selected = button.dataset.locale === locale;
    button.classList.toggle("is-active", selected);
    button.setAttribute("aria-pressed", String(selected));
  });
  [...caseSelect.options].forEach((option) => { option.textContent = cases[locale][option.value].title; });
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
    item.innerHTML = `<span class="context-index">${String(index + 1).padStart(2, "0")}</span><span><span class="context-name">${step.name}</span><span class="context-subtitle">${step.subtitle}</span>${index < revealed ? `<span class="unlock-note">${words().unlocked}</span>` : ""}</span>`;
    return item;
  }));
}

function renderEvidence() {
  const hasEvidence = revealed > 0;
  const step = activeCase().steps[Math.max(revealed - 1, 0)];
  $("#evidence-empty").hidden = hasEvidence;
  $("#evidence-content").hidden = !hasEvidence;
  $("#read-state").textContent = hasEvidence ? words().readCount(revealed) : words().notRead;
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
  $("#resolution-badge").textContent = complete ? words().ready : words().pending;
  $("#resolution-badge").classList.toggle("is-ready", complete);
  if (!complete) return;
  const resolution = activeCase().resolution;
  $("#resolution-action").textContent = resolution.action;
  $("#resolution-copy").textContent = resolution.copy;
  $("#reply-draft").textContent = resolution.reply;
}

function renderAudit() {
  const list = $("#audit-list");
  $("#audit-count").textContent = words().events(audit.length);
  if (audit.length === 0) {
    const empty = document.createElement("li");
    empty.className = "audit-empty";
    empty.textContent = words().auditEmpty;
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
  $("#data-scope").textContent = revealed === 0 ? words().initialScope : caseData.scope;
  $("#decision-state").textContent = complete ? words().resolutionReady : started ? words().continueVerification : words().awaitingTriage;
  revealButton.disabled = !started || complete;
  const label = complete ? words().allRead : words().readNext;
  revealButton.setAttribute("aria-label", label);
  revealButton.title = label;
}

function render() {
  renderStatic();
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
  addAudit(words().intakeAuditTitle, words().intakeAuditDetail);
  revealNext();
}

function revealNext() {
  if (!started || revealed >= activeCase().steps.length) return;
  const step = activeCase().steps[revealed];
  revealed += 1;
  addAudit(words().readAuditTitle(step.name), step.reason);
  if (revealed === activeCase().steps.length) addAudit(words().resolutionAuditTitle, words().resolutionAuditDetail);
  render();
}

function resetCase() {
  revealed = 0;
  started = false;
  audit = [];
  copyButton.textContent = words().copyReply;
  render();
}

async function copyReply() {
  const text = activeCase().resolution.reply;
  try {
    await navigator.clipboard.writeText(text);
    copyButton.textContent = words().copied;
  } catch {
    const draft = $("#reply-draft");
    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(draft);
    selection.removeAllRanges();
    selection.addRange(range);
    copyButton.textContent = words().selected;
  }
}

caseSelect.addEventListener("change", (event) => { currentCaseKey = event.target.value; resetCase(); });
startButton.addEventListener("click", startTriage);
resetButton.addEventListener("click", resetCase);
revealButton.addEventListener("click", revealNext);
copyButton.addEventListener("click", copyReply);
document.querySelectorAll(".language-button").forEach((button) => {
  button.addEventListener("click", () => {
    if (button.dataset.locale === locale) return;
    locale = button.dataset.locale;
    resetCase();
  });
});

render();
