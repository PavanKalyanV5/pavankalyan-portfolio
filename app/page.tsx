import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/hero/Hero";
import { About } from "@/components/about/About";
import { ExperienceSection } from "@/components/experience/ExperienceSection";
import { ProjectsSection } from "@/components/projects/ProjectsSection";
import { EducationSection } from "@/components/education/EducationSection";
import { SkillsSection } from "@/components/skills/SkillsSection";
import { CertificationsSection } from "@/components/certifications/CertificationsSection";
import { SocialsSection } from "@/components/socials/SocialsSection";
import { ContactForm } from "@/components/contact/ContactForm";
import { Container, Typography, Box } from "@mui/material";

export default function HomePage() {
  return (
    <>
      <Header />
      <Hero />
      <About />
      <ExperienceSection />
      <ProjectsSection />
      <EducationSection />
      <SkillsSection />
      <CertificationsSection />
      <SocialsSection />
      <Box component="section" id="contact" sx={{ py: 10 }}>
        <Container maxWidth="md">
          <Typography variant="h3" component="h2" fontWeight={700} gutterBottom>
            Contact
          </Typography>
          <ContactForm />
        </Container>
      </Box>
      <Footer />
    </>
  );
}
