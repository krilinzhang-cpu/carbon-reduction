/** 技术成熟度枚举 - 禁止在代码中使用魔法字符串 */
export const MATURITY_LEVEL = {
  COMMERCIAL: "commercial",
  PILOT: "pilot",
  RD: "rd",
} as const;

export const MATURITY_LABELS: Record<string, string> = {
  [MATURITY_LEVEL.COMMERCIAL]: "成熟商用",
  [MATURITY_LEVEL.PILOT]: "示范推广",
  [MATURITY_LEVEL.RD]: "研发阶段",
};

/** 技术来源类型枚举 */
export const SOURCE_TYPE = {
  GOVERNMENT: "government",
  ASSOCIATION: "association",
  PAPER: "paper",
  ENTERPRISE: "enterprise",
  WECHAT: "wechat",
  MEDIA: "media",
} as const;

export const SOURCE_LABELS: Record<string, string> = {
  [SOURCE_TYPE.GOVERNMENT]: "政府文件",
  [SOURCE_TYPE.ASSOCIATION]: "协会/机构",
  [SOURCE_TYPE.PAPER]: "论文/报告",
  [SOURCE_TYPE.ENTERPRISE]: "企业案例",
  [SOURCE_TYPE.WECHAT]: "公众号",
  [SOURCE_TYPE.MEDIA]: "媒体",
};

/** 行业代码（GB/T 4754 示例 - 黑色金属冶炼） */
export interface IndustryOption {
  code: string;
  name: string;
  level?: number;
}

export const INDUSTRIES: IndustryOption[] = [
  { code: "C31", name: "黑色金属冶炼和压延加工业", level: 2 },
  { code: "C32", name: "黑色金属铸造", level: 2 },
  { code: "C33", name: "金属制品业", level: 2 },
  { code: "C34", name: "金属制品、机械和设备修理业", level: 2 },
  { code: "C25", name: "石油加工、炼焦和核燃料加工业", level: 2 },
  { code: "C26", name: "化学原料和化学制品制造业", level: 2 },
  { code: "C27", name: "医药制造业", level: 2 },
  { code: "C28", name: "化学纤维制造业", level: 2 },
  { code: "D44", name: "电力、热力生产和供应业", level: 2 },
  { code: "D45", name: "燃气生产和供应业", level: 2 },
];
