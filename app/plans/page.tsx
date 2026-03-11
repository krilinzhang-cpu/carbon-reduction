"use client";

import { useState } from "react";
import {
  Card,
  Form,
  Input,
  Select,
  Button,
  ConfigProvider,
  message,
} from "antd";
import { SendOutlined } from "@ant-design/icons";
import { INDUSTRIES } from "@/lib/constants";
import { generateReport } from "@/lib/report-utils";
import ReductionReport from "@/components/ReductionReport";

const { TextArea } = Input;

const theme = {
  token: {
    colorPrimary: "#0D7A6B",
    colorSuccess: "#00B42A",
    colorWarning: "#FF7D00",
    colorInfo: "#165DFF",
    colorError: "#F53F3F",
  },
};

export default function PlansPage() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<ReturnType<typeof generateReport> | null>(null);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      const r = generateReport({
        industry_code: values.industry_code,
        process_description: values.process_description,
        energy_types: values.energy_types,
        energy_baseline_usage: values.energy_baseline_usage ?? "",
        baseline_emissions: values.baseline_emissions ?? "",
        current_measures: values.current_measures,
        reduction_target: values.reduction_target,
      });
      setReport(r);
      message.success("减排路径规划报告已生成");
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    } catch {
      // 校验失败
    } finally {
      setLoading(false);
    }
  };

  return (
    <ConfigProvider theme={theme}>
      <div className="pt-6">
        <h1
          className="mb-6"
          style={{ fontSize: "var(--font-size-h1)", fontWeight: 600 }}
        >
          减排路径规划
        </h1>

        <Card
          styles={{ body: { padding: 24 } }}
          style={{
            background: "var(--color-surface)",
            borderRadius: "var(--radius-md)",
            boxShadow: "var(--shadow-card)",
            maxWidth: 720,
          }}
        >
          <p className="text-text-secondary mb-6" style={{ fontSize: 14 }}>
            填写基准年数据与工艺路径，系统将结合行业先进减排技术生成个性化减排报告。
          </p>

          <Form
            form={form}
            layout="vertical"
            requiredMark={false}
            onFinish={handleSubmit}
          >
            <Form.Item
              label="所属行业"
              name="industry_code"
              rules={[{ required: true, message: "请选择所属行业" }]}
            >
              <Select
                placeholder="选择行业（参照 GB/T 4754）"
                allowClear
                options={INDUSTRIES.map((i) => ({
                  label: `${i.code} ${i.name}`,
                  value: i.code,
                }))}
              />
            </Form.Item>

            <Form.Item
              label="工艺路径描述"
              name="process_description"
              rules={[
                { required: true, message: "请输入工艺路径描述" },
                { max: 3000, message: "最多 3000 字" },
              ]}
            >
              <TextArea
                rows={4}
                placeholder="请描述企业主要生产工艺流程、能源消耗结构、关键排放环节等"
                maxLength={3000}
                showCount
              />
            </Form.Item>

            <Form.Item
              label="能源基准年用量"
              name="energy_baseline_usage"
              rules={[{ required: true, message: "请填写能源基准年用量" }]}
              help="如：电力 5000万kWh，煤气 2亿立方米"
            >
              <TextArea
                rows={2}
                placeholder="请按能源品种分别填写基准年消费量数据"
                maxLength={500}
              />
            </Form.Item>

            <Form.Item
              label="基准年排放总量"
              name="baseline_emissions"
              rules={[{ required: true, message: "请填写基准年排放总量" }]}
              help="单位：tCO2e（吨二氧化碳当量）"
            >
              <Input placeholder="如：50万吨CO2当量" maxLength={100} />
            </Form.Item>

            <Form.Item
              label="主要能源品种"
              name="energy_types"
              help="可多选，如煤气、电力、天然气等"
            >
              <Select
                mode="tags"
                placeholder="输入后回车添加"
                maxTagCount={10}
                options={[
                  { label: "煤气", value: "煤气" },
                  { label: "电力", value: "电力" },
                  { label: "天然气", value: "天然气" },
                  { label: "煤炭", value: "煤炭" },
                  { label: "蒸汽", value: "蒸汽" },
                ]}
              />
            </Form.Item>

            <Form.Item
              label="已采用的节能减排措施"
              name="current_measures"
              rules={[{ max: 1000, message: "最多 1000 字" }]}
            >
              <TextArea
                rows={3}
                placeholder="如有，请简要列出已实施的技术措施"
                maxLength={1000}
                showCount
              />
            </Form.Item>

            <Form.Item
              label="减排目标"
              name="reduction_target"
              rules={[{ max: 100, message: "最多 100 字" }]}
            >
              <Input placeholder="如：2030年减排30%" maxLength={100} />
            </Form.Item>

            <Form.Item className="mb-0">
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                icon={<SendOutlined />}
                size="large"
              >
                生成减排路径规划报告
              </Button>
            </Form.Item>
          </Form>
        </Card>

        {report && (
          <Card
            className="mt-6"
            styles={{ body: { padding: 24 } }}
            style={{
              background: "var(--color-surface)",
              borderRadius: "var(--radius-md)",
              boxShadow: "var(--shadow-card)",
            }}
          >
            <ReductionReport report={report} />
          </Card>
        )}
      </div>
    </ConfigProvider>
  );
}
