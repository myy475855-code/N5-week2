import { ApplicationStatus, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const skills = [
  "JavaScript", "TypeScript", "React", "Node.js", "PostgreSQL", "Python", "Docker",
  "Figma", "SQL", "Data Analysis", "Git", "REST APIs", "Machine Learning", "Tailwind CSS", "Testing",
];

const companies = [
  { name: "Nexora Labs", website: "https://nexora.example.com" },
  { name: "Brightline Software", website: "https://brightline.example.com" },
  { name: "Orbit Analytics", website: "https://orbitanalytics.example.com" },
  { name: "Kinetic Health", website: "https://kinetichealth.example.com" },
  { name: "Paperplane Studio", website: "https://paperplane.example.com" },
  { name: "Gridwork Systems", website: "https://gridwork.example.com" },
];

const internships = [
  { company: "Nexora Labs", title: "Frontend Engineering Intern", location: "Lahore", isRemote: false, skills: ["React", "TypeScript", "Tailwind CSS"], description: "Build accessible UI components for our customer dashboard." },
  { company: "Nexora Labs", title: "Backend Engineering Intern", location: "Lahore", isRemote: true, skills: ["Node.js", "PostgreSQL", "REST APIs"], description: "Design and ship REST endpoints backed by PostgreSQL." },
  { company: "Nexora Labs", title: "QA Automation Intern", location: "Remote", isRemote: true, skills: ["JavaScript", "Testing", "Git"], description: "Write end-to-end tests for release candidates." },
  { company: "Brightline Software", title: "Full Stack Intern", location: "Karachi", isRemote: false, skills: ["React", "Node.js", "PostgreSQL", "Git"], description: "Own a small feature from schema to UI." },
  { company: "Brightline Software", title: "DevOps Intern", location: "Karachi", isRemote: false, skills: ["Docker", "Git", "Python"], description: "Help containerise services and improve CI pipelines." },
  { company: "Orbit Analytics", title: "Data Analyst Intern", location: "Islamabad", isRemote: false, skills: ["SQL", "Python", "Data Analysis"], description: "Turn raw event data into weekly business reports." },
  { company: "Orbit Analytics", title: "ML Research Intern", location: "Islamabad", isRemote: true, skills: ["Python", "Machine Learning", "Data Analysis"], description: "Prototype ranking models on anonymised datasets." },
  { company: "Kinetic Health", title: "Mobile Web Intern", location: "Faisalabad", isRemote: false, skills: ["JavaScript", "React", "REST APIs"], description: "Improve the patient appointment web app." },
  { company: "Kinetic Health", title: "Data Engineering Intern", location: "Remote", isRemote: true, skills: ["SQL", "PostgreSQL", "Python"], description: "Maintain ETL jobs feeding the reporting database." },
  { company: "Paperplane Studio", title: "Product Design Intern", location: "Lahore", isRemote: false, skills: ["Figma", "Tailwind CSS"], description: "Prototype flows and hand off specs to engineers." },
  { company: "Paperplane Studio", title: "Creative Developer Intern", location: "Remote", isRemote: true, skills: ["JavaScript", "TypeScript", "Figma"], description: "Implement interactive marketing pages." },
  { company: "Gridwork Systems", title: "Platform Intern", location: "Rawalpindi", isRemote: false, skills: ["Node.js", "Docker", "PostgreSQL", "Testing"], description: "Work on internal platform tooling and service templates." },
];

const students = [
  { name: "Ayesha Khan", email: "ayesha.khan@example.edu", university: "FAST-NUCES", skills: ["React", "TypeScript", "Tailwind CSS", "Git"] },
  { name: "Bilal Ahmed", email: "bilal.ahmed@example.edu", university: "LUMS", skills: ["Node.js", "PostgreSQL", "REST APIs", "Docker"] },
  { name: "Fatima Noor", email: "fatima.noor@example.edu", university: "NUST", skills: ["Python", "SQL", "Data Analysis", "Machine Learning"] },
  { name: "Hamza Raza", email: "hamza.raza@example.edu", university: "GIKI", skills: ["JavaScript", "React", "Node.js", "Git"] },
  { name: "Iqra Malik", email: "iqra.malik@example.edu", university: "UET Lahore", skills: ["Figma", "Tailwind CSS", "JavaScript"] },
  { name: "Junaid Siddiqui", email: "junaid.siddiqui@example.edu", university: "NED", skills: ["Docker", "Git", "Python", "Testing"] },
  { name: "Kiran Shah", email: "kiran.shah@example.edu", university: "COMSATS", skills: ["SQL", "PostgreSQL", "Python"] },
  { name: "Laiba Tariq", email: "laiba.tariq@example.edu", university: "UAF", skills: ["React", "REST APIs", "JavaScript", "Testing"] },
];

// [student email, internship title, status]
const applications: [string, string, ApplicationStatus][] = [
  ["ayesha.khan@example.edu", "Frontend Engineering Intern", "ACCEPTED"],
  ["ayesha.khan@example.edu", "Full Stack Intern", "REVIEWED"],
  ["bilal.ahmed@example.edu", "Backend Engineering Intern", "ACCEPTED"],
  ["bilal.ahmed@example.edu", "Platform Intern", "PENDING"],
  ["bilal.ahmed@example.edu", "Full Stack Intern", "REJECTED"],
  ["fatima.noor@example.edu", "Data Analyst Intern", "ACCEPTED"],
  ["fatima.noor@example.edu", "ML Research Intern", "REVIEWED"],
  ["hamza.raza@example.edu", "Full Stack Intern", "PENDING"],
  ["hamza.raza@example.edu", "Frontend Engineering Intern", "REJECTED"],
  ["iqra.malik@example.edu", "Product Design Intern", "ACCEPTED"],
  ["iqra.malik@example.edu", "Creative Developer Intern", "PENDING"],
  ["junaid.siddiqui@example.edu", "DevOps Intern", "REVIEWED"],
  ["junaid.siddiqui@example.edu", "QA Automation Intern", "PENDING"],
  ["kiran.shah@example.edu", "Data Engineering Intern", "ACCEPTED"],
  ["kiran.shah@example.edu", "Data Analyst Intern", "PENDING"],
  ["laiba.tariq@example.edu", "Mobile Web Intern", "ACCEPTED"],
  ["laiba.tariq@example.edu", "Frontend Engineering Intern", "PENDING"],
];

// Re-runnable: everything is upserted or guarded by find-first.
async function main() {
  for (const name of skills) await prisma.skill.upsert({ where: { name }, update: {}, create: { name } });
  const skillId = new Map((await prisma.skill.findMany()).map((s) => [s.name, s.id]));

  for (const c of companies) await prisma.company.upsert({ where: { name: c.name }, update: {}, create: c });
  const companyId = new Map((await prisma.company.findMany()).map((c) => [c.name, c.id]));

  const internshipId = new Map<string, number>();
  for (const i of internships) {
    const cid = companyId.get(i.company)!;
    const existing = await prisma.internship.findFirst({ where: { companyId: cid, title: i.title } });
    const row =
      existing ??
      (await prisma.internship.create({
        data: {
          companyId: cid,
          title: i.title,
          description: i.description,
          location: i.location,
          isRemote: i.isRemote,
          deadline: new Date(Date.now() + 45 * 24 * 3600 * 1000),
        },
      }));
    internshipId.set(i.title, row.id);
    await prisma.internshipSkill.createMany({
      data: i.skills.map((s) => ({ internshipId: row.id, skillId: skillId.get(s)! })),
      skipDuplicates: true,
    });
  }

  const studentId = new Map<string, number>();
  for (const s of students) {
    const row = await prisma.student.upsert({
      where: { email: s.email },
      update: {},
      create: { name: s.name, email: s.email, university: s.university },
    });
    studentId.set(s.email, row.id);
    await prisma.studentSkill.createMany({
      data: s.skills.map((k) => ({ studentId: row.id, skillId: skillId.get(k)! })),
      skipDuplicates: true,
    });
  }

  for (const [email, title, status] of applications) {
    const key = { studentId: studentId.get(email)!, internshipId: internshipId.get(title)! };
    await prisma.application.upsert({
      where: { studentId_internshipId: key },
      update: {},
      create: { ...key, status },
    });
  }

  console.log(
    `Seeded ${companies.length} companies, ${internships.length} internships, ` +
      `${students.length} students, ${skills.length} skills, ${applications.length} applications.`,
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
