import { AppShell } from "@/components/layout/AppShell";
import type { PanelId } from "@/components/layout/panels";
import { Hero } from "@/components/hero/Hero";
import { About } from "@/components/about/About";
import { ExperienceSection } from "@/components/experience/ExperienceSection";
import { ProjectsSection } from "@/components/projects/ProjectsSection";
import { EducationSection } from "@/components/education/EducationSection";
import { SkillsSection } from "@/components/skills/SkillsSection";
import { CertificationsSection } from "@/components/certifications/CertificationsSection";
import { SocialsSection } from "@/components/socials/SocialsSection";
import { ContactForm } from "@/components/contact/ContactForm";
import { FadeInSection } from "@/components/motion/FadeInSection";
import { Container, Typography, Box, Link } from "@mui/material";
import type { ReactNode } from "react";

const CONTACT_EMAIL = "vetlapavankalyan5@gmail.com";

const panels: Record<PanelId, ReactNode> = {
  home: (
    <>
      <Hero />
      <FadeInSection>
        <About />
      </FadeInSection>
    </>
  ),
  experience: <ExperienceSection />,
  projects: <ProjectsSection />,
  education: <EducationSection />,
  skills: <SkillsSection />,
  certifications: <CertificationsSection />,
  connect: (
    <>
      <FadeInSection>
        <SocialsSection />
      </FadeInSection>
      <FadeInSection>
        <Box component="section" id="contact" sx={{ py: 6 }}>
          <Container maxWidth="md">
            <Typography variant="h3" component="h2" fontWeight={700} gutterBottom>
              Contact
            </Typography>
            <ContactForm />
            <Typography variant="body1" sx={{ mt: 3 }}>
              Prefer email? Reach me directly at{" "}
              <Link href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</Link>
            </Typography>
          </Container>
        </Box>
      </FadeInSection>
      <Box sx={{ py: 4, textAlign: "center" }}>
        <Typography variant="body2" color="text.secondary">
          © {new Date().getFullYear()} Pavan Kalyan Vetla. Built with Next.js, MUI, and React
          Three Fiber.
        </Typography>
      </Box>
    </>
  ),
};

export default function HomePage() {
  return <AppShell panels={panels} />;
}
