"use client";

import { useState, useMemo } from "react";
import {
  Card,
  Table,
  Select,
  Input,
  Tag,
  Button,
  Space,
  ConfigProvider,
  Empty,
  Skeleton,
  Drawer,
  Descriptions,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  MATURITY_LEVEL,
  MATURITY_LABELS,
  SOURCE_LABELS,
  INDUSTRIES,
} from "@/lib/constants";
import type { CarbonTechnology } from "@/lib/types";
import { MOCK_TECHNOLOGIES } from "@/lib/mock-data";
import { SearchOutlined, LinkOutlined } from "@ant-design/icons";

// 主色配置以符合 .cursorrules 规范
const theme = {
  token: {
    colorPrimary: "#0D7A6B",
    colorSuccess: "#00B42A",
    colorWarning: "#FF7D00",
    colorInfo: "#165DFF",
    colorError: "#F53F3F",
  },
};

export default function TechnologiesPage() {
  const [industryCode, setIndustryCode] = useState<string | undefined>();
  const [maturityLevel, setMaturityLevel] = useState<string | undefined>();
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedTech, setSelectedTech] = useState<CarbonTechnology | null>(null);

  // 模拟加载
  const dataSource = useMemo(() => {
    let list = [...MOCK_TECHNOLOGIES];
    if (industryCode) {
      list = list.filter((t) => t.industry_code.includes(industryCode));
    }
    if (maturityLevel) {
      list = list.filter((t) => t.maturity_level === maturityLevel);
    }
    if (keyword.trim()) {
      const kw = keyword.toLowerCase();
      list = list.filter(
        (t) =>
          t.tech_name.includes(kw) ||
          t.applicable_process.includes(kw)
      );
    }
    return list;
  }, [industryCode, maturityLevel, keyword]);

  const handleReset = () => {
    setIndustryCode(undefined);
    setMaturityLevel(undefined);
    setKeyword("");
    setPage(1);
  };

  const getMaturityTagColor = (level: string) => {
    switch (level) {
      case MATURITY_LEVEL.COMMERCIAL:
        return "success";
      case MATURITY_LEVEL.PILOT:
        return "warning";
      case MATURITY_LEVEL.RD:
        return "processing";
      default:
        return "default";
    }
  };

  const openDetail = (record: CarbonTechnology) => {
    setSelectedTech(record);
    setDetailOpen(true);
  };

  const columns: ColumnsType<CarbonTechnology> = [
    {
      title: "技术名称",
      dataIndex: "tech_name",
      key: "tech_name",
      width: 180,
      ellipsis: true,
      sorter: (a, b) => a.tech_name.localeCompare(b.tech_name),
      render: (name, record) => (
        <button
          type="button"
          className="text-left text-primary hover:underline cursor-pointer"
          onClick={() => openDetail(record)}
        >
          {name}
        </button>
      ),
    },
    {
      title: "适用行业",
      key: "industry_code",
      width: 160,
      render: (_, record) =>
        record.industry_code
          .map((c) => INDUSTRIES.find((i) => i.code === c)?.name ?? c)
          .join("、") || "-",
    },
    {
      title: "适用环节",
      dataIndex: "applicable_process",
      key: "applicable_process",
      width: 140,
    },
    {
      title: "减排潜力",
      dataIndex: "reduction_potential",
      key: "reduction_potential",
      width: 140,
      render: (v) => v || "-",
    },
    {
      title: "成熟度",
      dataIndex: "maturity_level",
      key: "maturity_level",
      width: 100,
      filters: [
        { text: "成熟商用", value: MATURITY_LEVEL.COMMERCIAL },
        { text: "示范推广", value: MATURITY_LEVEL.PILOT },
        { text: "研发阶段", value: MATURITY_LEVEL.RD },
      ],
      render: (level: string) => (
        <Tag color={getMaturityTagColor(level)}>
          {MATURITY_LABELS[level] ?? level}
        </Tag>
      ),
    },
    {
      title: "投资成本",
      dataIndex: "investment_cost",
      key: "investment_cost",
      width: 120,
      render: (v) => v || "-",
    },
    {
      title: "来源",
      dataIndex: "source_type",
      key: "source_type",
      width: 100,
      render: (type: string, record) => (
        <span title={record.source_name}>
          {SOURCE_LABELS[type] ?? type}
        </span>
      ),
    },
  ];

  return (
    <ConfigProvider theme={theme}>
      <div className="pt-6">
        <h1
          className="mb-6"
          style={{ fontSize: "var(--font-size-h1)", fontWeight: 600 }}
        >
          行业减排技术查询
        </h1>

        <Card
          className="mb-6"
          styles={{ body: { padding: 24 } }}
          style={{
            background: "var(--color-surface)",
            borderRadius: "var(--radius-md)",
            boxShadow: "var(--shadow-card)",
          }}
        >
          <Space wrap size="middle" className="w-full">
            <Space>
              <span className="text-text-secondary text-sm">行业：</span>
              <Select
                placeholder="选择行业"
                allowClear
                style={{ width: 260 }}
                value={industryCode}
                onChange={setIndustryCode}
                options={INDUSTRIES.map((i) => ({
                  label: `${i.code} ${i.name}`,
                  value: i.code,
                }))}
              />
            </Space>
            <Space>
              <span className="text-text-secondary text-sm">成熟度：</span>
              <Select
                placeholder="全部"
                allowClear
                style={{ width: 120 }}
                value={maturityLevel}
                onChange={setMaturityLevel}
                options={[
                  { label: "成熟商用", value: MATURITY_LEVEL.COMMERCIAL },
                  { label: "示范推广", value: MATURITY_LEVEL.PILOT },
                  { label: "研发阶段", value: MATURITY_LEVEL.RD },
                ]}
              />
            </Space>
            <Space>
              <Input
                placeholder="技术名称或适用环节"
                prefix={<SearchOutlined className="text-text-disabled" />}
                style={{ width: 220 }}
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                allowClear
              />
            </Space>
            <Button type="primary" htmlType="button" onClick={() => setPage(1)}>
              查询
            </Button>
            <Button onClick={handleReset}>重置</Button>
          </Space>
        </Card>

        <Card
          styles={{ body: { padding: 0 } }}
          style={{
            background: "var(--color-surface)",
            borderRadius: "var(--radius-md)",
            boxShadow: "var(--shadow-card)",
          }}
        >
          {loading ? (
            <div className="p-6">
              <Skeleton active paragraph={{ rows: 6 }} />
            </div>
          ) : (
            <Table<CarbonTechnology>
              rowKey="tech_id"
              columns={columns}
              dataSource={dataSource}
              pagination={{
                current: page,
                pageSize,
                total: dataSource.length,
                showSizeChanger: true,
                showTotal: (total) => `共 ${total} 条`,
                pageSizeOptions: ["10", "20", "50", "100"],
                onChange: (p, ps) => {
                  setPage(p);
                  if (ps) setPageSize(ps);
                },
              }}
              locale={{
                emptyText: (
                  <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description={
                      <span className="text-text-secondary">
                        暂无符合条件的技术数据，请调整筛选条件或联系管理员录入
                      </span>
                    }
                  />
                ),
              }}
              style={{
                // 斑马纹由 Ant Design 内置实现，这里补充奇偶行色
              }}
              className="[&_.ant-table-tbody>tr:nth-child(even)>td]:bg-bg"
              onRow={(record) => ({
                onClick: () => openDetail(record),
                style: { cursor: "pointer" },
              })}
            />
          )}
        </Card>

        {/* 技术详情抽屉 */}
        <Drawer
          title={selectedTech?.tech_name ?? ""}
          placement="right"
          width={480}
          open={detailOpen}
          onClose={() => setDetailOpen(false)}
          footer={null}
          styles={{
            header: { fontSize: "var(--font-size-h3)", fontWeight: 600 },
          }}
        >
          {selectedTech && (
            <Descriptions column={1} bordered size="small">
              <Descriptions.Item label="适用行业">
                {selectedTech.industry_code
                  .map((c) => INDUSTRIES.find((i) => i.code === c)?.name ?? c)
                  .join("、")}
              </Descriptions.Item>
              <Descriptions.Item label="适用环节">
                {selectedTech.applicable_process}
              </Descriptions.Item>
              <Descriptions.Item label="减排潜力">
                {selectedTech.reduction_potential ?? "-"}
              </Descriptions.Item>
              <Descriptions.Item label="技术成熟度">
                <Tag color={getMaturityTagColor(selectedTech.maturity_level)}>
                  {MATURITY_LABELS[selectedTech.maturity_level]}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="投资成本">
                {selectedTech.investment_cost ?? "-"}
              </Descriptions.Item>
              <Descriptions.Item label="投资回收周期">
                {selectedTech.payback_period ?? "-"}
              </Descriptions.Item>
              <Descriptions.Item label="来源类型">
                {SOURCE_LABELS[selectedTech.source_type]}
              </Descriptions.Item>
              <Descriptions.Item label="来源名称">
                {selectedTech.source_name}
                {selectedTech.source_year && `（${selectedTech.source_year}年）`}
              </Descriptions.Item>
              {selectedTech.source_url && (
                <Descriptions.Item label="来源链接">
                  <a
                    href={selectedTech.source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue flex items-center gap-1"
                  >
                    <LinkOutlined />
                    查看原文
                  </a>
                </Descriptions.Item>
              )}
            </Descriptions>
          )}
        </Drawer>
      </div>
    </ConfigProvider>
  );
}
