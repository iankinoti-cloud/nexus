// 10 synthetic test cases — each has an enquiry object + discovery call transcript.
// All company names, contacts, and details are fictional.
// budgetMidpoint is the numeric midpoint of the stated budget range, used in scoring.

export const cases = [
  {
    id: 1,
    label: 'Brand identity — fintech startup',
    enquiry: {
      companyName: 'Vault Labs',
      contactName: 'Priya Sharma',
      industry: 'Fintech',
      serviceInterest: 'Brand Identity + Website',
      budgetRange: '$40,000–$60,000',
      timeline: '10 weeks',
    },
    budgetMidpoint: 50000,
    transcript: `Priya: Thanks for taking the time. We're a Series A fintech startup — we help SMEs access working capital via invoice financing. We launched six months ago and the product is solid but our visual identity is a mess. We need a full rebrand.

Agency: What does "mess" look like right now?

Priya: Our logo was done by a freelancer in a week. No brand guidelines, no colour palette. Our website is a Webflow template with our colours slapped on. We're going into fundraising in four months and need to look like a serious company.

Agency: Who's your target audience?

Priya: Two groups — CFOs and finance managers at SMEs between 20 and 200 employees, and the venture investors we're trying to impress. Both need to feel trust and credibility immediately.

Agency: What feeling should the brand communicate?

Priya: Smart, modern, trustworthy. Not a startup that's going to disappear. We want to look like we've been around for five years even though we haven't.

Agency: Budget range?

Priya: We've allocated $40,000 to $60,000 for the full scope — logo, brand guidelines, website redesign. Timeline is ten weeks because our next investor demo is in November.

Agency: Any existing brand assets we should preserve?

Priya: Nothing worth keeping. The only constraint is our domain name — vaultlabs.io — and we'd like to keep "Vault" as a concept in the visual language if it's relevant.`,
  },

  {
    id: 2,
    label: 'Social media campaign — fashion brand',
    enquiry: {
      companyName: 'Kesi Collective',
      contactName: 'Amara Osei',
      industry: 'Fashion & Lifestyle',
      serviceInterest: 'Social Media Campaign',
      budgetRange: '$25,000–$35,000',
      timeline: '6 weeks',
    },
    budgetMidpoint: 30000,
    transcript: `Amara: We're launching our Spring/Summer collection in eight weeks and need a full social media campaign to support it. We're primarily on Instagram and TikTok.

Agency: What's the campaign goal?

Amara: Two things — brand awareness in the 18-to-28 demographic, and driving traffic to our new e-commerce store. We're targeting a 30% increase in Instagram followers and at least 5,000 store visits from social in the first month.

Agency: Tell me about Kesi Collective's aesthetic.

Amara: We make contemporary African-inspired streetwear. Bold patterns, quality fabrics, price point around $80 to $150 per piece. Our existing content is inconsistent — some good editorial shots but no cohesive narrative.

Agency: What does the campaign need to include?

Amara: Content strategy for eight weeks, a campaign concept and visual theme, creation of content templates our team can use, and three to five hero content pieces — either photo or short video. We're also open to a small influencer strategy.

Agency: Budget?

Amara: We have $25,000 to $35,000 for the creative production — not including paid media spend. Timeline is tight: six weeks from brief to launch.`,
  },

  {
    id: 3,
    label: 'TVC production — telco',
    enquiry: {
      companyName: 'Nexacom',
      contactName: 'David Mwangi',
      industry: 'Telecommunications',
      serviceInterest: 'Video Production (TVC)',
      budgetRange: '$120,000–$160,000',
      timeline: '12 weeks',
    },
    budgetMidpoint: 140000,
    transcript: `David: We're refreshing our consumer brand this year and need three 30-second TV commercials for our home fibre product. These will run on national TV and digital pre-roll.

Agency: What's the story you want to tell?

David: Nexacom is the fastest home fibre in East Africa but customers see us as expensive and corporate. We want to shift that — more human, more relatable. The product benefit is speed and reliability but the emotional story is about families staying connected.

Agency: Any specific creative direction?

David: We want three spots that can work together as a campaign but stand alone. Each one should feature a different household type — a young couple, a family with kids, and a young professional working from home. Real-looking, not overly produced. Think documentary style.

Agency: Production requirements?

David: Full production — concept, scripting, casting, shoot, post-production including colour grade and sound mix, and delivery in broadcast formats for TV and digital. We may want a behind-the-scenes piece for social as a bonus if budget allows.

Agency: Budget and timeline?

David: Budget is $120,000 to $160,000 for all three spots. We need to deliver to TV stations in twelve weeks — our campaign goes live in Q4.`,
  },

  {
    id: 4,
    label: 'Annual report — bank',
    enquiry: {
      companyName: 'Horizon Bank',
      contactName: 'Fatou Diallo',
      industry: 'Financial Services',
      serviceInterest: 'Annual Report Design',
      budgetRange: '$18,000–$25,000',
      timeline: '8 weeks',
    },
    budgetMidpoint: 21500,
    transcript: `Fatou: We need a full annual report for the 2025 financial year. We've been using the same design agency for five years and they've become unresponsive, so we're looking for a new partner.

Agency: What does the report typically include?

Fatou: About 80 pages. Covers the Chairman's statement, CEO review, financial performance tables, sustainability section, and full IFRS financials at the back. We also do a printed version — 500 copies — plus a digital PDF and an interactive web version.

Agency: Any brand guidelines we'd be working to?

Fatou: Yes, we have a full brand guide. Navy, gold, and white palette. The design should feel premium and conservative — this goes to regulators and shareholders.

Agency: What content do you provide?

Fatou: We provide all written content, photography, and financial tables. You handle layout, typography, infographic design, and the interactive digital version. Copy editing is not in scope.

Agency: Timeline?

Fatou: Content is delivered to you in six weeks. You have two weeks for design and revisions. Budget is $18,000 to $25,000. We need print files and digital files ready by week eight.`,
  },

  {
    id: 5,
    label: 'Event branding — tech conference',
    enquiry: {
      companyName: 'AfriTech Summit',
      contactName: 'Kofi Mensah',
      industry: 'Events & Technology',
      serviceInterest: 'Event Branding',
      budgetRange: '$30,000–$45,000',
      timeline: '14 weeks',
    },
    budgetMidpoint: 37500,
    transcript: `Kofi: AfriTech Summit is Africa's largest developer conference — 3,000 attendees, 80 speakers, five tracks. We've been running it for three years with an internal team doing the design. This year we want to bring in professionals.

Agency: What scope are you looking at?

Kofi: Full event identity — a new visual theme for 2026 that feels fresh but connects to our existing brand. Then execution across all touchpoints: website, signage, badges, stage backdrop, social media templates, and speaker card templates. We also need a brand guide so our internal team can execute independently after the conference.

Agency: What's the tone for 2026?

Kofi: Bold and optimistic. The theme this year is "Build the Future" — we want the visuals to feel forward-looking, energetic. Not corporate. Our audience is developers, engineers, and founders aged 22 to 40.

Agency: Are there any constraints?

Kofi: We have an existing logo and colour palette — teal and black — that we're keeping. The new identity wraps around these. Budget is $30,000 to $45,000. We need the full brand system ready fourteen weeks from now so we can start marketing the event.`,
  },

  {
    id: 6,
    label: 'Product launch campaign — FMCG',
    enquiry: {
      companyName: 'Zuri Foods',
      contactName: 'Nadia Hassan',
      industry: 'FMCG',
      serviceInterest: 'Product Launch Campaign',
      budgetRange: '$55,000–$80,000',
      timeline: '10 weeks',
    },
    budgetMidpoint: 67500,
    transcript: `Nadia: We're launching a new line of organic snacks — six SKUs — into East African retail chains in ten weeks. We need a full launch campaign.

Agency: What channels are you targeting?

Nadia: In-store POS and shelf displays in 200 stores, out-of-home in Nairobi and Kampala, social media, and a trade-facing sales presentation kit. We're also open to a launch event concept if it fits the budget.

Agency: What's the product story?

Nadia: Zuri means beautiful in Swahili. These are snacks made from locally sourced ingredients — cassava chips, mango slices, groundnut bars. Healthy, affordable, genuinely Kenyan. We want the launch to feel celebratory and proud — not like a Western health food brand trying to fit in.

Agency: Target audience?

Nadia: Two audiences. End consumers: urban professionals and families aged 25 to 40 who care about what they eat. Trade buyers: category managers at Carrefour, Naivas, and Shoprite who need a professional pitch.

Agency: Budget?

Nadia: $55,000 to $80,000 for creative production and material design. We handle media buying separately. Ten weeks hard deadline — store listings are confirmed, we just need the assets.`,
  },

  {
    id: 7,
    label: 'Internal comms rebrand — law firm',
    enquiry: {
      companyName: 'Osei & Partners',
      contactName: 'James Osei-Bonsu',
      industry: 'Legal Services',
      serviceInterest: 'Brand Refresh + Communications Suite',
      budgetRange: '$20,000–$30,000',
      timeline: '8 weeks',
    },
    budgetMidpoint: 25000,
    transcript: `James: We're a mid-size commercial law firm — 45 lawyers across Accra, Lagos, and Nairobi. Our brand hasn't been touched in ten years. We're not doing a full rebrand but we need a meaningful refresh.

Agency: What's the scope of the refresh?

James: Updated logo — modernise it without losing the heritage. New colour palette, typography system, and brand guidelines. Then apply the refresh to a set of templates: pitch deck, client proposal, letterhead, email signature, and business cards.

Agency: What does your current brand communicate?

James: Established and trustworthy — which is good — but also outdated and stiff. We want to feel modern and approachable while still being serious. Our clients are major corporations and government agencies.

Agency: Any constraints?

James: The name "Osei & Partners" and the blue colour family must remain — it's recognisable to our clients. Everything else is open to interpretation.

Agency: Budget and timeline?

James: $20,000 to $30,000 for the refresh and the full template suite. Eight weeks — we have a major pitch to a new client in Q4 and want the new materials ready for that.`,
  },

  {
    id: 8,
    label: 'Documentary film — NGO',
    enquiry: {
      companyName: 'Roots Initiative',
      contactName: 'Zanele Dube',
      industry: 'Non-Profit',
      serviceInterest: 'Documentary Film Production',
      budgetRange: '$35,000–$50,000',
      timeline: '16 weeks',
    },
    budgetMidpoint: 42500,
    transcript: `Zanele: Roots Initiative works with smallholder farmers in rural Kenya and Tanzania. We want to produce a 20-to-25-minute documentary that tells the story of three farming families we've worked with over five years.

Agency: What's the purpose of the film?

Zanele: Donor communication and fundraising. We're presenting to three major foundations in Q1 next year and we need something that moves people emotionally and shows real impact. We also want a shorter version — three to five minutes — for social media.

Agency: Do you have existing footage?

Zanele: We have some archival footage from farm visits but it's low quality — mostly iPhone video. We'll need a full production shoot with a crew visiting both countries.

Agency: What does the creative direction look like?

Zanele: Authentic and human. No voiceover narrator — let the farmers tell their own story. Subtitles in English. We want it to feel like journalism, not a fundraising pitch. The emotion should come from the people, not manipulative music.

Agency: Budget?

Zanele: Our budget is $35,000 to $50,000 for full production including travel, crew, equipment, editing, colour grade, sound design, and music licensing. Sixteen weeks to final delivery.`,
  },

  {
    id: 9,
    label: 'Packaging redesign — food brand',
    enquiry: {
      companyName: 'Mara Milling',
      contactName: 'Wanjiku Kamau',
      industry: 'Food & Beverage',
      serviceInterest: 'Packaging Design',
      budgetRange: '$22,000–$32,000',
      timeline: '10 weeks',
    },
    budgetMidpoint: 27000,
    transcript: `Wanjiku: We make premium flour and grain products — maize flour, wheat flour, rice. We've been selling into Kenya for fifteen years but we're about to enter the Ugandan and Rwandan markets. Our packaging looks dated and won't compete on those shelves.

Agency: What does the redesign need to achieve?

Wanjiku: Stand out on shelf, communicate premium quality versus the cheap local alternatives, and work across all twelve of our SKUs. There's also a practical constraint — we can't change the shape of the packaging, only the label and print design.

Agency: What's your brand personality?

Wanjiku: Mara means grace in Swahili. We want to feel natural, wholesome, and trustworthy. Our current packaging is generic — a lot of green and yellow. We want something more distinctive.

Agency: What's the scope?

Wanjiku: A new packaging design system that works across all twelve SKUs. We need print-ready files in the correct format for our existing manufacturer. A brand guide showing how to apply the system to future products would be a bonus.

Agency: Budget?

Wanjiku: $22,000 to $32,000 for the design work and print-ready files. Ten weeks to delivery because we've already booked a print run.`,
  },

  {
    id: 10,
    label: 'DOOH campaign — real estate',
    enquiry: {
      companyName: 'Citadel Properties',
      contactName: 'Emmanuel Afolabi',
      industry: 'Real Estate',
      serviceInterest: 'Out-of-Home Advertising Campaign',
      budgetRange: '$38,000–$55,000',
      timeline: '6 weeks',
    },
    budgetMidpoint: 46500,
    transcript: `Emmanuel: We're launching a new mixed-use development in Lagos — 200 residential units and 20 retail units. We need a full out-of-home campaign to drive awareness and enquiries before the launch event in six weeks.

Agency: What formats are you buying?

Emmanuel: Billboards on three major expressways, digital screens in two shopping malls, and bus shelter ads in three high-traffic areas. The media buying is done — we just need the creative.

Agency: Who are you targeting?

Emmanuel: High-income professionals aged 30 to 50. Young families who are upgrading their first home and established professionals looking for investment properties. The development is positioned as premium but accessible — not ultra-luxury.

Agency: What's the campaign message?

Emmanuel: The development is called "The Meridian." We want to communicate location advantage — it's at the intersection of Lekki and the business district — and lifestyle premium. The strapline we're considering is "Where everything meets." Open to alternatives.

Agency: Budget?

Emmanuel: $38,000 to $55,000 for creative development and production of all OOH formats. We need print-ready and digital files delivered in six weeks. The launch event is non-negotiable.`,
  },
];
