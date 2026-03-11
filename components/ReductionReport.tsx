"use client";

import { Button, Tag } from "antd";
import { PrinterOutlined } from "@ant-design/icons";
import type { ReductionReport as ReportType } from "@/lib/report-utils";
import { MATURITY_LABELS } from "@/lib/constants";

interface Props {
  report: ReportType;
}

export default function ReductionReport({ report }: Props) {

  const buildPrintHtml = () => {
    const m = (arr: typeof report.short_term) =>
      arr.length > 0
        ? arr
            .map(
              (x) =>
                `<div class="measure"><strong>${x.tech_name}</strong> <span class="tag">${MATURITY_LABELS[x.maturity_level]}</span><br/>适用环节：${x.applicable_process}${x.reduction_potential ? ` | 减排潜力：${x.reduction_potential}` : ""}</div>`
            )
            .join("")
        : `<p class="empty">暂无匹配技术</p>`;

    return `
      <h1>企业碳减排路径规划报告</h1>
      <div class="baseline">
        <h2>一、基准年信息</h2>
        <p><strong>所属行业：</strong>${report.industry_name}</p>
        <p><strong>能源基准年用量：</strong>${report.input.energy_baseline_usage || "—"}</p>
        <p><strong>基准年排放总量：</strong>${report.input.baseline_emissions || "—"}</p>
        ${report.input.reduction_target ? `<p><strong>减排目标：</strong>${report.input.reduction_target}</p>` : ""}
      </div>
      <div class="section"><h2>二、短期措施（1-3年）</h2>${m(report.short_term, "成熟商用")}</div>
      <div class="section"><h2>三、中期措施（3-5年）</h2>${m(report.mid_term, "示范推广")}</div>
      <div class="section"><h2>四、长期措施（5年以上）</h2>${m(report.long_term, "研发阶段")}</div>
      <p class="footer">报告生成时间：${report.generated_at}</p>
    `;
  };

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      window.print();
      return;
    }
    printWindow.document.write(`
      <!DOCTYPE html>
      <html><head><meta charset="utf-8"><title>减排路径规划报告</title>
      <style>
        body{font-family:'PingFang SC','Microsoft YaHei',sans-serif;padding:32px;max-width:800px;margin:0 auto;color:#1D2129}
        h1{font-size:22px;color:#0D7A6B;margin-bottom:24px}
        h2{font-size:16px;color:#0D7A6B;margin:24px 0 12px}
        .baseline{background:#F7F8FA;padding:16px;border-radius:8px;margin-bottom:16px}
        .section{margin-bottom:20px}
        .measure{padding:12px 0;border-bottom:1px solid #E4E7ED}
        .tag{display:inline-block;padding:2px 8px;border-radius:4px;font-size:12px;margin-left:8px}
        .empty{color:#A9AEB8;font-size:14px}
        .footer{color:#A9AEB8;font-size:12px;margin-top:24px}
      </style></head>
      <body>${buildPrintHtml()}</body></html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-text-primary">减排路径规划报告</h2>
        <Button type="primary" icon={<PrinterOutlined />} onClick={handlePrint}>
          导出/打印报告
        </Button>
      </div>

      <div className="bg-surface rounded-lg p-6" style={{ boxShadow: "var(--shadow-card)" }}>
        <h1 className="text-xl font-semibold mb-6" style={{ color: "var(--color-primary)" }}>
          企业碳减排路径规划报告
        </h1>

        {/* 基准信息 */}
        <div className="section mb-6 p-4 rounded-lg" style={{ background: "var(--color-bg)" }}>
          <h2 className="text-base font-medium mb-3" style={{ color: "var(--color-primary)" }}>
            一、基准年信息
          </h2>
          <p><strong>所属行业：</strong>{report.industry_name}</p>
          <p><strong>能源基准年用量：</strong>{report.input.energy_baseline_usage || "—"}</p>
          <p><strong>基准年排放总量：</strong>{report.input.baseline_emissions || "—"}</p>
          {report.input.reduction_target && (
            <p><strong>减排目标：</strong>{report.input.reduction_target}</p>
          )}
          <p className="text-text-secondary text-sm mt-2">
            工艺路径：{report.input.process_description.slice(0, 200)}
            {report.input.process_description.length > 200 ? "…" : ""}
          </p>
        </div>

        {/* 短期措施 1-3年 */}
        <div className="section mb-6">
          <h2 className="text-base font-medium mb-3" style={{ color: "var(--color-primary)" }}>
            二、短期措施（1-3年）— 成熟商用技术
          </h2>
          {report.short_term.length > 0 ? (
            report.short_term.map((m) => (
              <div key={m.tech_id} className="measure p-3 border-b border-border">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium">{m.tech_name}</span>
                  <Tag color="success">{MATURITY_LABELS[m.maturity_level]}</Tag>
                </div>
                <p className="text-text-secondary text-sm mb-1">适用环节：{m.applicable_process}</p>
                {m.reduction_potential && (
                  <p className="text-sm">减排潜力：{m.reduction_potential}</p>
                )}
                {(m.investment_cost || m.payback_period) && (
                  <p className="text-sm">投资：{m.investment_cost ?? "—"} | 回收期：{m.payback_period ?? "—"}</p>
                )}
              </div>
            ))
          ) : (
            <p className="text-text-secondary text-sm">暂无匹配的成熟商用技术</p>
          )}
        </div>

        {/* 中期措施 3-5年 */}
        <div className="section mb-6">
          <h2 className="text-base font-medium mb-3" style={{ color: "var(--color-primary)" }}>
            三、中期措施（3-5年）— 示范推广技术
          </h2>
          {report.mid_term.length > 0 ? (
            report.mid_term.map((m) => (
              <div key={m.tech_id} className="measure p-3 border-b border-border">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium">{m.tech_name}</span>
                  <Tag color="warning">{MATURITY_LABELS[m.maturity_level]}</Tag>
                </div>
                <p className="text-text-secondary text-sm mb-1">适用环节：{m.applicable_process}</p>
                {m.reduction_potential && <p className="text-sm">减排潜力：{m.reduction_potential}</p>}
              </div>
            ))
          ) : (
            <p className="text-text-secondary text-sm">暂无匹配的示范推广技术</p>
          )}
        </div>

        {/* 长期措施 5年以上 */}
        <div className="section">
          <h2 className="text-base font-medium mb-3" style={{ color: "var(--color-primary)" }}>
            四、长期措施（5年以上）— 研发阶段技术
          </h2>
          {report.long_term.length > 0 ? (
            report.long_term.map((m) => (
              <div key={m.tech_id} className="measure p-3 border-b border-border">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium">{m.tech_name}</span>
                  <Tag color="processing">{MATURITY_LABELS[m.maturity_level]}</Tag>
                </div>
                <p className="text-text-secondary text-sm mb-1">适用环节：{m.applicable_process}</p>
                {m.reduction_potential && <p className="text-sm">减排潜力：{m.reduction_potential}</p>}
              </div>
            ))
          ) : (
            <p className="text-text-secondary text-sm">暂无匹配的研发阶段技术</p>
          )}
        </div>

        <p className="text-text-disabled text-sm mt-6">
          报告生成时间：{report.generated_at} | 数据来源：行业减排技术库
        </p>
      </div>
    </div>
  );
}
