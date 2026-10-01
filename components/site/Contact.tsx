import { profile } from "@/content/profile";
import { socials } from "@/content/socials";
import { SplitHeading } from "./SplitHeading";
import { CopyEmail } from "./CopyEmail";
import layout from "./layout.module.css";
import styles from "./Contact.module.css";
import { ContactForm } from "./ContactForm";

export function Contact() {
  return (
    <>
      <section id="contact" className={layout.section} data-scene="4" aria-labelledby="contact-h">
        <div className={layout.column}>
          <SplitHeading id="contact-h" className={`${layout.heading} ${styles.heading}`}>
            Have a hard backend problem? Write to me.
          </SplitHeading>
          <p className={layout.lede} data-depth>I reply to every message about engineering roles and collaborations.</p>
          <div className={styles.grid}>
            <div data-depth>
              <ContactForm />
            </div>
            <div className={styles.side} data-depth>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className={styles.portrait} src={profile.photo} alt={`Portrait of ${profile.name}`} width={96} height={96} />
              <nav className={styles.links} aria-label="Elsewhere">
                <a href={`mailto:${profile.email}`}>{profile.email}</a>
                <CopyEmail email={profile.email} />
                <a href={profile.resume} target="_blank" rel="noopener noreferrer">
                  Résumé (PDF)
                </a>
                {socials.map((s) => (
                  <a key={s.id} href={s.url} target="_blank" rel="noopener noreferrer">
                    {s.label}
                  </a>
                ))}
              </nav>
            </div>
          </div>
        </div>
      </section>
      <footer className={styles.footer}>
        {profile.name}, {profile.location}. Built with Next.js, React Three Fiber, and Anime.js. Press T to change the theme.
      </footer>
    </>
  );
}
