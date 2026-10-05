// All copy for the landing page lives here so it can be edited in one place.
// Nothing below claims clients, prices or turnaround times — add those only when they are real.

export const brand = {
  name: "Edut Films",
  hebrew: "עֵדוּת",
  pronunciation: "eh-DOOT",
  meaning: "Testimony; witness.",
  places: "The Holy Land \u2013 Israel",
};

// TODO(Michael): real contact details. When filled in, they appear as direct links beside the enquiry form.
export const contact = {
  email: "",
  whatsapp: "",
  // where the enquiry form at the foot of the page sends its notes
  enquiryTo: "run1000hills@gmail.com",
};

export const hero = {
  headline: "Your pilgrimage, witnessed.",
  sub: "A filmmaker who lives here travels with your group, so the days you waited years for come home with you.",
  primaryCta: "Ask about your dates",
  secondaryCta: "Watch the films",
};

export const meaning = {
  line: "You came to see it for yourself. We make sure you can show it.",
  body: "Edut is the Hebrew word for testimony: what a witness carries away and tells. A pilgrimage is over in ten days. The film is how the people at home see what you saw.",
};

// Each service is named by one three-letter Hebrew word.
// `still` is the YouTube id of one of Michael's films, used as the picture behind the open panel.
export const services = [
  {
    n: "01",
    hebrew: "מַסָּע",
    translit: "masa",
    gloss: "journey",
    title: "Pilgrimage films",
    body: "One filmmaker on the road with your group, from the lake to the city. You go home with a film of the journey and the footage behind it.",
    still: "kjkTqrRwe1g",
  },
  {
    n: "02",
    hebrew: "אוֹר",
    translit: "or",
    gloss: "light",
    title: "Photography",
    body: "The group at each site, portraits, and the moments nobody poses for: the boat at first light, the water at the Jordan, the walk up to Jerusalem.",
    still: "XmsZDbzTUtE",
  },
  {
    n: "03",
    hebrew: "קוֹל",
    translit: "kol",
    gloss: "voice",
    title: "Films for ministries",
    body: "Short pieces for churches, schools and organizations working in the land: a conference recap, an invitation to next year's trip, a story that needs telling well.",
    still: "EpmmbXdu0L4",
  },
] as const;

// About Michael. Dates: first visit 2011, volunteer summer 2023, living at Magdala since 2024.
// TODO(Michael): confirm every line here before the site goes public.
export const about = {
  eyebrow: "Behind the camera",
  title: "Michael has made his home in Israel.",
  name: "Michael Folta",
  place: "Magdala, Sea of Galilee",
  body: [
    "Michael Folta first came to the Holy Land at fifteen and went home knowing he would come back. He returned in 2023 as a volunteer, and since 2024 he has lived and worked at Magdala, on the western shore of the Sea of Galilee.",
    "He is the filmmaker for One Step Closer, Magdala\u2019s work for unity among Christians, and for the pilgrim groups, conferences and communities that come through its gates. He also walks visitors through the first-century synagogue himself, so he knows the place as a guide as well as from behind a camera.",
    "That is the difference living here makes. He knows the sites, the roads between them, and the hour the light is best at each one, from the Galilee up to Jerusalem.",
  ],
  facts: [
    { k: "Home", v: "Israel and Tennessee" },
    { k: "In the land", v: "Since 2023" },
    { k: "Films for", v: "One Step Closer, Magdala and Christian groups" },
    { k: "Trained", v: "Architecture, Virginia Tech" },
  ],
};

export const closing = {
  title: "Coming to the Holy Land?",
  body: "Finish the sentence and send it. Michael will tell you plainly what is possible for your dates.",
};

// Michael's films, from his two public YouTube playlists ("Galilee Edits" and "Israel Edits").
// The carousel shows them newest first, by `published` (the YouTube publish date),
// except that a film marked `first: true` always leads.
// To add a film, add a line with its date; to drop one, delete its line.
export type Film = {
  id: string; // YouTube video id
  title: string;
  place: "Galilee" | "Jerusalem" | "Israel";
  length: string;
  published: string; // YYYY-MM-DD
  thumb?: "sd"; // set when YouTube has no full-size still for the video
  first?: true; // always opens the carousel, whatever its date
};

export const filmsIntro = {
  eyebrow: "The films",
  title: "Step inside.",
  body: "A selection of Michael's work from the Galilee and Jerusalem.",
};

const filmList: Film[] = [
  { id: "qENv5Y7MwzA", title: "Hope City in Israel: Feb 2026", place: "Israel", length: "1:33", published: "2026-10-03", first: true },
  { id: "w1u35MEqC4w", title: "Jan Barendse: Beit Virginia Retreat in Migdal", place: "Galilee", length: "1:41", published: "2026-09-24" },
  { id: "HVMTVKaKebw", title: "What Magdala Has Taught Me", place: "Galilee", length: "10:05", published: "2026-09-18" },
  { id: "EpmmbXdu0L4", title: "Women\u2019s Day 2025", place: "Galilee", length: "1:11", published: "2025-03-12" },
  { id: "kjkTqrRwe1g", title: "A Day on Tour with Philip\u2019s House", place: "Israel", length: "1:38", published: "2024-12-20" },
  { id: "IG4G1EktEx0", title: "Philos Leadership Institute: Nova", place: "Israel", length: "0:42", published: "2024-12-20" },
  { id: "c_CglizZ61c", title: "Duc in Altum Concert", place: "Galilee", length: "3:50", published: "2024-12-12" },
  { id: "XmsZDbzTUtE", title: "Tabgha", place: "Galilee", length: "2:54", published: "2024-11-28" },
  { id: "MaqJUqqVQNU", title: "Wind in Our Sails: Donor Thank You", place: "Galilee", length: "7:36", published: "2024-11-21" },
  { id: "NEjmMQd4LTw", title: "Philos Leadership Institute: Razzouk", place: "Jerusalem", length: "0:46", published: "2024-11-17" },
  { id: "AZfQgdc_oYU", title: "Holy Sepulcher Tour", place: "Jerusalem", length: "20:37", published: "2024-11-17", thumb: "sd" },
  { id: "8BLVZRDXM_E", title: "Old City Rooftop Tour", place: "Jerusalem", length: "15:00", published: "2024-11-17" },
  { id: "3NR-4X1TPw0", title: "Painting Lesson", place: "Jerusalem", length: "0:53", published: "2024-11-17" },
  { id: "_KxL-0kglKg", title: "Coming Soon: Pentecost Room Painting", place: "Jerusalem", length: "2:13", published: "2024-11-17" },
  { id: "x0XR9RwaBUU", title: "One Step Closer Intro", place: "Galilee", length: "1:46", published: "2024-11-13" },
];

// A film marked `first` leads; the rest follow newest first.
// Films published the same day keep the order written above.
export const films: Film[] = filmList
  .map((f, i) => ({ f, i }))
  .sort(
    (a, b) =>
      Number(Boolean(b.f.first)) - Number(Boolean(a.f.first)) ||
      b.f.published.localeCompare(a.f.published) ||
      a.i - b.i,
  )
  .map(({ f }) => f);
