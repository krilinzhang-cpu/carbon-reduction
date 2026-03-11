"use client";

import { useState } from "react";
import {
  Card,
  Form,
  Input,
  Select,
  Button,
  ConfigProvider,
  Empty,
  message,
} from "antd";
import { SendOutlined } from "@ant-design/icons";
import { INDUSTRIES } from "@/lib/constants";

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
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      // 预留 AI 路径规划接口调用
      await new Promise((r) => setTimeout(r, 800));
      message.success("工艺路径已提交，减排路径规划功能即将上线");
      setSubmitted(true);
      form.resetFields();
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
            根据企业工艺路径描述，AI 将为您生成个性化的短中长期减排路径规划建议。
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
                rows={6}
                placeholder="请描述企业主要生产工艺流程、能源消耗结构、关键排放环节等（如：炼钢-轧钢-热处理，主要能源为煤气和电力...）"
                maxLength={3000}
                showCount
              />
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
                生成减排路径规划
              </Button>
            </Form.Item>
          </Form>
        </Card>

        {/* 规划结果占位 - 后续接入 AI 流式输出 */}
        {submitted && (
          <Card
            className="mt-6"
            styles={{ body: { padding: 48 } }}
            style={{
              background: "var(--color-surface)",
              borderRadius: "var(--radius-md)",
              boxShadow: "var(--shadow-card)",
            }}
          >
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={
                <span className="text-text-secondary">
                  AI 减排路径规划结果将在此展示，支持短期（1-3年）、中期（3-5年）、长期（5年以上）分阶段展示
                </span>
              }
            />
          </Card>
        )}
      </div>
    </ConfigProvider>
  );
}
