import { type CSSProperties, Fragment } from "react";
import EnquiryForm from "@/components/EnquiryForm";
import FilmsSection from "@/components/FilmsSection";
import HeroVideo from "@/components/HeroVideo";
import InView from "@/components/InView";
import Portrait from "@/components/Portrait";
import JerusalemWall from "@/components/JerusalemWall";
import ServicesPanels from "@/components/ServicesPanels";
import StoneWall from "@/components/StoneWall";
import { about, brand, closing, contact, films, filmsIntro, hero, meaning, services } from "@/lib/content";

const label = "font-mono text-[11px] uppercase tracking-[0.22em]";

// Each Hebrew letter together with its vowel points, so a letter and its marks arrive as one.
const hebrewLetters = brand.hebrew.match(/\p{L}\p{M}*/gu) ?? [brand.hebrew];
const lineWords = meaning.line.split(" ");

export default function Home() {
  const hasContact = Boolean(contact.email || contact.whatsapp);

  return (
    <main className="flex-1">
      {/* Hero: one full screen, film behind, words at the foot */}
      <section className="relative flex min-h-[100svh] flex-col bg-ink text-bone">
        <HeroVideo />
        <header className="relative flex w-full items-center justify-between px-5 py-6 sm:px-6">
          <a href="#" className="flex items-baseline gap-3" aria-label={brand.name}>
            <span lang="he" dir="rtl" className="font-hebrew text-[26px] leading-none">
              {brand.hebrew}
            </span>
            <span className={`${label} text-bone/80`}>{brand.name}</span>
          </a>
          <nav className={`${label} flex items-center gap-7 text-bone/75`}>
            <a href="#films" className="hidden hover:text-bone sm:inline">Films</a>
            <a href="#services" className="hidden hover:text-bone sm:inline">Services</a>
            <a href="#about" className="hidden hover:text-bone sm:inline">About</a>
            <a href="#contact" className="rounded-full border border-bone/35 px-4 py-2 text-bone hover:border-bone">
              Enquire
            </a>
          </nav>
        </header>

        <div className="relative my-auto w-full px-5 pb-[26vh] pt-6 sm:px-6">
          <h1 className="max-w-[14ch] font-display text-[44px] leading-[1.04] tracking-[-0.01em] sm:text-[68px] lg:text-[86px]">
            {hero.headline}
          </h1>
          <p className="mt-7 max-w-[32rem] text-[17px] leading-relaxed text-bone/80 sm:text-[18px]">{hero.sub}</p>
          <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
            <a
              href="#contact"
              className="rounded-full bg-bone px-6 py-3 text-[15px] font-medium text-ink transition-colors hover:bg-white"
            >
              {hero.primaryCta}
            </a>
            <a href="#films" className="text-[15px] text-bone/85 underline decoration-bone/35 underline-offset-[6px] hover:decoration-bone">
              {hero.secondaryCta}
            </a>
          </div>
        </div>
        <JerusalemWall className="absolute inset-x-0 bottom-0" />
      </section>

      {/* The name: the word is set down letter by letter, right to left, as Hebrew is read */}
      <section>
        <InView className="mx-auto grid max-w-[1240px] gap-10 px-6 py-20 sm:px-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-16 lg:py-28">
          <div>
            <p lang="he" dir="rtl" aria-label={brand.hebrew} className="text-left font-hebrew text-[96px] leading-[0.9] sm:text-[128px]">
              {hebrewLetters.map((ch, i) => (
                <span key={i} data-r="letter" aria-hidden style={{ "--i": i * 230 } as CSSProperties}>
                  {ch}
                </span>
              ))}
            </p>
            <p data-r="block" style={{ "--i": 1000 } as CSSProperties} className={`${label} mt-6 text-ash`}>
              Edut · {brand.pronunciation} · Hebrew, noun
            </p>
            <p data-r="block" style={{ "--i": 1150 } as CSSProperties} className="mt-2 font-display text-[22px]">
              {brand.meaning}
            </p>
          </div>
          <div className="lg:pt-6">
            <p aria-label={meaning.line} className="font-display text-[30px] leading-[1.15] tracking-[-0.01em] sm:text-[38px]">
              {lineWords.map((w, i) => (
                <Fragment key={i}>
                  <span data-r="word" aria-hidden style={{ "--i": 500 + i * 70 } as CSSProperties}>
                    {w}
                  </span>{" "}
                </Fragment>
              ))}
            </p>
            <p
              data-r="block"
              style={{ "--i": 700 + lineWords.length * 70 } as CSSProperties}
              className="mt-6 max-w-[34rem] text-[17px] leading-relaxed text-ink/70"
            >
              {meaning.body}
            </p>
          </div>
        </InView>
      </section>

      {/* The films: a carousel hung on a wall of Jerusalem stone */}
      <FilmsSection {...filmsIntro} films={films} wall={<StoneWall />} />

      {/* What we film: three Hebrew words, one open at a time */}
      <ServicesPanels services={services} />

      {/* About */}
      <section id="about" className="scroll-mt-8 bg-bone">
        <InView className="mx-auto grid max-w-[1240px] gap-12 px-6 py-20 sm:px-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-16 lg:py-28">
          <div>
            <p data-r="block" className={`${label} text-ash`}>{about.eyebrow}</p>
            <h2
              data-r="block"
              style={{ "--i": 120 } as CSSProperties}
              className="mt-6 font-display text-[36px] leading-[1.08] tracking-[-0.01em] sm:text-[46px]"
            >
              {about.title}
            </h2>

            <div data-r="block" style={{ "--i": 320 } as CSSProperties} className="mt-10 flex items-end gap-6">
              <Portrait name={about.name} />
              <div className="min-w-0 pb-1">
                <p className="font-display text-[22px] leading-tight">{about.name}</p>
                <p className={`${label} mt-2 text-ash`}>{about.place}</p>
              </div>
            </div>
          </div>

          <div className="lg:pt-12">
            <div className="space-y-5 text-[17px] leading-relaxed text-ink/75">
              {about.body.map((p, i) => (
                <p key={i} data-r="block" style={{ "--i": 250 + i * 140 } as CSSProperties}>
                  {p}
                </p>
              ))}
            </div>
            <dl
              data-r="block"
              style={{ "--i": 250 + about.body.length * 140 } as CSSProperties}
              className="mt-10 grid grid-cols-2 gap-x-8 gap-y-5 border-t border-ink/15 pt-6 sm:grid-cols-4"
            >
              {about.facts.map((f) => (
                <div key={f.k}>
                  <dt className={`${label} text-ash`}>{f.k}</dt>
                  <dd className="mt-2 text-[15px] leading-snug text-ink">{f.v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </InView>
      </section>

      {/* Contact: one sentence to finish, one button to send */}
      <section id="contact" className="bg-ink text-bone">
        <div className="mx-auto grid max-w-[1240px] gap-10 px-6 py-14 sm:px-8 lg:grid-cols-[minmax(0,4fr)_minmax(0,7fr)] lg:gap-16 lg:py-16">
          <div>
            <p className={`${label} flex items-center gap-2 text-bone/60`}>
              <span className="rec-dot h-2 w-2 rounded-full bg-ahmar" /> Enquiries
            </p>
            <h2 className="mt-5 font-display text-[38px] leading-[1.06] tracking-[-0.01em] sm:text-[46px]">{closing.title}</h2>
            <p className="mt-4 max-w-[24rem] text-[16px] leading-relaxed text-bone/65">{closing.body}</p>
            {hasContact && (
              <p className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-[15px]">
                {contact.email && (
                  <a href={`mailto:${contact.email}`} className="text-bone/85 underline decoration-bone/30 underline-offset-[6px] hover:decoration-bone">
                    {contact.email}
                  </a>
                )}
                {contact.whatsapp && (
                  <a
                    href={`https://wa.me/${contact.whatsapp.replace(/\D/g, "")}`}
                    className="text-bone/85 underline decoration-bone/30 underline-offset-[6px] hover:decoration-bone"
                  >
                    WhatsApp
                  </a>
                )}
              </p>
            )}
          </div>
          <div className="lg:border-l lg:border-bone/12 lg:pl-16">
            <EnquiryForm />
          </div>
        </div>
        <footer className="border-t border-bone/10">
          <div className={`${label} mx-auto flex max-w-[1240px] flex-wrap items-center justify-between gap-3 px-6 py-6 text-bone/50 sm:px-8`}>
            <span>© {new Date().getFullYear()} {brand.name}</span>
            <span>{brand.places}</span>
          </div>
        </footer>
      </section>
    </main>
  );
}
