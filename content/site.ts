/*
 * Site-wide copy and links. Edit text here rather than in components.
 *
 * In intro lines, wrap words in **double asterisks** to set them in the
 * darker ink color, the way key names stand out in the introduction.
 */

export const site = {
  name: "Yoolim Kim",
  fullName: "Yoolim Emily Kim",
  initials: "YK",
  title: "Yoolim Kim, Product Designer",
  description:
    "Portfolio of Yoolim (Emily) Kim, a product designer studying User Experience Design at the University of Michigan.",

  nav: [
    { label: "Work", href: "/" },
    { label: "About", href: "/about" },
    { label: "Resume", href: "/resume.pdf", external: true },
  ],

  hero: {
    greeting: "Hi, I'm Yoolim!",
    aside: "Or you can call me Emily :)",
    intro: [
      "I'm a product designer who loves turning things we imagine into **digital experiences** we can interact with.",
      "Studying **User Experience Design** @ **University of Michigan**.",
    ],
  },

  contact: {
    closing: "Thanks for stopping by!",
    invitation: "I'd love to hear about what you're building. Say hi at **{email}**.",
    // Placeholders: replace with your real email and LinkedIn URL.
    email: "hello@example.com",
    linkedin: "https://www.linkedin.com/in/your-profile",
    resume: "/resume.pdf",
  },
} as const;
