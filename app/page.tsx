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
import { FadeInSection } from "@/components/motion/FadeInSection";
import { Container, Typography, Box, Link } from "@mui/material";

const CONTACT_EMAIL = "vetlapavankalyan5@gmail.com";

export default function HomePage() {
  return (
    <>
      <Header />
      <Hero />
      <FadeInSection>
        <About />
      </FadeInSection>
      <FadeInSection>
        <ExperienceSection />
      </FadeInSection>
      <FadeInSection>
        <ProjectsSection />
      </FadeInSection>
      <FadeInSection>
        <EducationSection />
      </FadeInSection>
      <FadeInSection>
        <SkillsSection />
      </FadeInSection>
      <FadeInSection>
        <CertificationsSection />
      </FadeInSection>
      <FadeInSection>
        <SocialsSection />
      </FadeInSection>
      <FadeInSection>
        <Box component="section" id="contact" sx={{ py: 10 }}>
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
      <Footer />
    </>
  );
}
