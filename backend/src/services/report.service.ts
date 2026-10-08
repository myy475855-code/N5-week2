import { Prisma } from "@prisma/client";
import { prisma } from "../db/prisma";

export interface CompanyFunnelRow {
  id: number;
  name: string;
  internship_count: number;
  application_count: number;
  accepted_count: number;
  acceptance_rate_pct: number | null;
}

export interface SkillMatchRow {
  student_id: number;
  name: string;
  matched_skills: number;
  required_skills: number;
  match_pct: number | null;
}

export const reportService = {
  /**
   * RAW SQL #1 - Top 5 companies by internship count, with application funnel.
   * Casts to ::int because COUNT() returns bigint, which JSON cannot serialise.
   */
  topCompanies: () =>
    prisma.$queryRaw<CompanyFunnelRow[]>`
      SELECT c.id,
             c.name,
             COUNT(DISTINCT i.id)::int                                  AS internship_count,
             COUNT(a.id)::int                                           AS application_count,
             (COUNT(a.id) FILTER (WHERE a.status = 'ACCEPTED'))::int    AS accepted_count,
             ROUND(100.0 * COUNT(a.id) FILTER (WHERE a.status = 'ACCEPTED')
                   / NULLIF(COUNT(a.id), 0), 1)::float8                 AS acceptance_rate_pct
      FROM companies c
      LEFT JOIN internships  i ON i.company_id    = c.id
      LEFT JOIN applications a ON a.internship_id = i.id
      GROUP BY c.id, c.name
      ORDER BY internship_count DESC, application_count DESC, c.name ASC
      LIMIT 5`,

  /**
   * RAW SQL #2 - Rank students by how many of an internship's required skills they have.
   * Uses both join tables via a CTE; the denominator is a scalar subquery.
   */
  skillMatches: (internshipId: number) =>
    prisma.$queryRaw<SkillMatchRow[]>(Prisma.sql`
      WITH required AS (
        SELECT skill_id FROM internship_skills WHERE internship_id = ${internshipId}
      )
      SELECT s.id                                              AS student_id,
             s.name,
             COUNT(r.skill_id)::int                            AS matched_skills,
             (SELECT COUNT(*) FROM required)::int              AS required_skills,
             ROUND(100.0 * COUNT(r.skill_id)
                   / NULLIF((SELECT COUNT(*) FROM required), 0), 0)::float8 AS match_pct
      FROM students s
      JOIN student_skills ss ON ss.student_id = s.id
      JOIN required r        ON r.skill_id    = ss.skill_id
      GROUP BY s.id, s.name
      ORDER BY matched_skills DESC, s.name ASC`),
};
