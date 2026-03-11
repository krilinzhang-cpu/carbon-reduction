/** 减排技术项 */
export interface CarbonTechnology {
  tech_id: string;
  tech_name: string;
  industry_code: string[];
  applicable_process: string;
  reduction_potential?: string;
  maturity_level: "commercial" | "pilot" | "rd";
  investment_cost?: string;
  payback_period?: string;
  source_type: string;
  source_name: string;
  source_url?: string;
  source_year?: number;
}
