import type { CarbonTechnology } from "./types";
import { MOCK_TECHNOLOGIES } from "./mock-data";
import { MATURITY_LEVEL, INDUSTRIES } from "./constants";

/** 减排路径规划输入 */
export interface PlanInput {
  industry_code: string;
  process_description: string;
  energy_types?: string[];
  energy_baseline_usage: string; // 能源基准年用量
  baseline_emissions: string;   // 基准年排放总量
  current_measures?: string;
  reduction_target?: string;
}

/** 技术措施项 */
export interface PlanMeasure {
  tech_id: string;
  tech_name: string;
  applicable_process: string;
  reduction_potential?: string;
  maturity_level: string;
  investment_cost?: string;
  payback_period?: string;
  source_name: string;
}

/** 减排报告结构 */
export interface ReductionReport {
  input: PlanInput;
  industry_name: string;
  short_term: PlanMeasure[];  // 1-3年：成熟商用
  mid_term: PlanMeasure[];    // 3-5年：示范推广
  long_term: PlanMeasure[];   // 5年以上：研发阶段
  generated_at: string;
}

/** 根据行业代码匹配适用技术，并按成熟度分配到短中长期 */
export function generateReport(input: PlanInput): ReductionReport {
  const industryCodes = [input.industry_code];
  const matched = MOCK_TECHNOLOGIES.filter((t) =>
    t.industry_code.some((c) => industryCodes.includes(c))
  );

  const toMeasure = (t: CarbonTechnology): PlanMeasure => ({
    tech_id: t.tech_id,
    tech_name: t.tech_name,
    applicable_process: t.applicable_process,
    reduction_potential: t.reduction_potential,
    maturity_level: t.maturity_level,
    investment_cost: t.investment_cost,
    payback_period: t.payback_period,
    source_name: t.source_name,
  });

  const short_term = matched
    .filter((t) => t.maturity_level === MATURITY_LEVEL.COMMERCIAL)
    .map(toMeasure);
  const mid_term = matched
    .filter((t) => t.maturity_level === MATURITY_LEVEL.PILOT)
    .map(toMeasure);
  const long_term = matched
    .filter((t) => t.maturity_level === MATURITY_LEVEL.RD)
    .map(toMeasure);

  const industry = INDUSTRIES.find((i) => i.code === input.industry_code);

  return {
    input,
    industry_name: industry?.name ?? input.industry_code,
    short_term,
    mid_term,
    long_term,
    generated_at: new Date().toLocaleString("zh-CN"),
  };
}
