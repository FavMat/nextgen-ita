// NextGen Ita — AI Bits Config
// Manage which posts appear on bits.html
// Use admin.html to toggle and generate articles visually

const NEXTGEN_POSTS = [
  {
    id: "01",
    published: true,
    date: "Apr 2025",
    tag: "AI",
    title: "Anthropic Paid $400M for a Problem",
    excerpt: "Fewer than 10 people. No product. No revenue. Here is what Anthropic actually bought, and why pharma is the next AI infrastructure war.",
    file: "bit-01.html",
    readTime: "4 min",
    author: "Matteo Favilli",
    linkedin: "https://www.linkedin.com/in/matteo-favilli/",
    text: `Last week Anthropic paid $400 million for a startup that was eight months old. Yes, I know what you're thinking. Fewer than 10 people. No product. No revenue.

I spend a lot of time with pharma clients leading AI projects. One thing comes up constantly: the models don't speak biology. They speak English. The scientists feel the difference the first time they use these tools.

That's the gap Coefficient Bio was working on. Former top researchers, building models that reason about molecules directly, not just papers about them. Anthropic didn't buy a product but paid $400 million for a problem most of the industry is still pretending doesn't exist.

And the timing makes sense. In 2026 alone already:
- Eli Lilly + Insilico Medicine: $2.75B for AI-discovered drugs (Mar 2026)
- Isomorphic Labs + Johnson and Johnson: AI molecules for hard-to-drug targets (Jan 2026)
- NVIDIA + Eli Lilly: $1B AI lab (Jan 2026)
- GSK + NOETIK: $50M to license biological foundation models (Jan 2026)
- Bayer + Cradle: AI inside antibody design workflows (Jan 2026)

Pharma isn't buying AI tools anymore. It's buying infrastructure. Whoever gets inside the R&D pipeline early owns that relationship for years.

Same week, OpenAI bought a podcast. Both moves make sense. But in a few years, one of these bets will age much better than the other.`
  },
  {
    id: "02",
    published: true,
    date: "Apr 2025",
    tag: "AI",
    title: "What the Stanford AI Index 2026 Actually Says",
    excerpt: "The performance gap between top models has shrunk to 2.7%. Global adoption is moving faster than the internet. Here are the data points that matter.",
    file: "bit-02.html",
    readTime: "3 min",
    author: "Matteo Favilli",
    linkedin: "https://www.linkedin.com/in/matteo-favilli/",
    text: `The new 2026 AI Index from Stanford Institute for Human-Centered Artificial Intelligence (HAI) is officially out.

The data highlights a massive shift: the performance gap between top models has shrunk to a razor-thin 2.7% (Anthropic at the top), and global adoption is moving faster than the internet ever did.

The 8 key takeaways:
1. Performance gap between top models: 2.7%
2. Global AI adoption rate outpacing early internet adoption
3. Infrastructure investment concentrated in US and China
4. Model costs dropping dramatically, making AI more accessible
5. AI-related risks and incidents up significantly year on year
6. Talent: demand for AI skills growing faster than supply
7. Scientific breakthroughs: AI now co-authoring papers and discovering molecules
8. Regulatory activity accelerating across Europe and Asia

A reflection for organizations: How can we use these insights to actually evolve our business models, rather than just automating what we have?`
  },
  {
    id: "03",
    published: false,
    date: "Apr 2025",
    tag: "Innovation",
    title: "Dario Amodei Moves to Italy",
    excerpt: "The Anthropic CEO announced he is moving to Massa Marittima, Tuscany. A short thought on what this signals.",
    file: "",
    readTime: "2 min",
    author: "Matteo Favilli",
    linkedin: "https://www.linkedin.com/in/matteo-favilli/",
    text: `Ci vediamo in Piazza Dario! Anthropic CEO Dario Amodei announced he is moving to Massa Marittima, a small town in Tuscany, his father's hometown. He will lead Anthropic in full remote for 6 months a year from the Maremma.`
  },
  {
    id: "04",
    published: false,
    date: "Jul 2025",
    tag: "AI",
    title: "How Generative AI Is Transforming the Way We Work",
    excerpt: "A conversation with Michael Wolf at the FoodAI Colab on AI adoption across industries, roles, and generations.",
    file: "",
    readTime: "3 min",
    author: "Matteo Favilli",
    linkedin: "https://www.linkedin.com/in/matteo-favilli/",
    text: `I'm joining the FoodAI Colab to discuss with Michael Wolf how Generative AI is transforming the way we work across industries, roles, and generations. We'll dive into AI adoption across companies and sectors, how work processes and team skills are evolving, and what cross-functional AI fluency really means in practice.`
  }
];
