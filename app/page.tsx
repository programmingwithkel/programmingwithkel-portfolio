import {
  ProfileHeader,
  AboutSection,
  TechStack,
  Experience,
  Projects,
  SchoolBackground,
  SocialLinks,
  Gallery,
  ChatButton,
  FadeIn,
} from './components';


const portfolioData = {
  profile: {
    name: "Michael Asis",
    location: "Camarines Norte, Philippines",
    roles: ["Aspiring Full-Stack Developer", "Tech Enthusiast"]
  },
  about: [
    "I am an Information Technology student and aspiring software developer passionate about building modern web and mobile applications. I am currently learning and working with JavaScript, TypeScript, and React while exploring backend development and system design.",
    "As a web, mobile, and system developer in training, I enjoy creating projects such as web applications, APIs, and simple management systems to strengthen my skills and gain real-world experience. I am continuously improving my problem-solving abilities by building practical and scalable solutions.",
    "I also enjoy integrating AI into my projects and experimenting with prompt engineering to create smarter and more interactive applications. I am committed to learning modern technologies, improving performance and user experience, and growing into a well-rounded full-stack developer."
  ],
  techStack: [
    {
      name: "Frontend",
      skills: ["JavaScript", "TypeScript", "React", "Next.js", "Vue.js", "Tailwind CSS"]
    },
    {
      name: "Backend",
      skills: ["Node.js", "Python", "Express", "PostgreSQL", "MongoDB", "MySQL", "Firebase"]
    },
    {
      name: "Tools & DevOps",
      skills: ["Git", "Vercel", "GitHub Actions"]
    }
  ],
  experiences: [
    {
      title: "Learning PyTorch",
      description: "Learning PyTorch for Deep Learning",
      year: "2026",
      current: true
    },
    {
      title: "AI Integration & Prompt Engineering",
      description: "Building AI integrations and prompt engineering for web and mobile applications.",
      year: "2025"
    },
    {
      title: "Desktop, Mobile & Web Development",
      description: "Building desktop, mobile, and web applications.",
      year: "2024"
    },
    {
      title: "My First Hello World",
      description: "My first experience in programming.",
      year: "2023"
    }

  ],
  schoolBackground: [
    { name: "Bachelor of Science in Information Technology", institution: "Camarines Norte State College", year: "2026" },
    { name: "Senior High School - ABM Strand", institution: "Vinzons Pilot High School", year: "2022" },
    { name: "Junior High School", institution: "Vinzons Pilot High School", year: "2020" },
    { name: "Elementary School", institution: "Juanita Balon Elementary School", year: "2016" }
  ],
  projects: [
    {
      name: "Fit Track",
      description: "An AI-powered that generate meal and workout plans.",
      subtitle: "AI-Powered Fitness Companion",
      longDescription: "Fit Track is an AI-powered fitness companion that generates personalized meal and workout plans based on user goals, dietary preferences, and fitness level. The application leverages machine learning to adapt recommendations over time, providing smarter and more effective plans as users progress.",
      image: "/images/FitTrack.png",
      technologies: ["Android Studio", "Java", "Gemini API", "Firebase"],
      dateRange: "2025",
      collaborators: [{ name: "Michael Asis", avatar: "/images/portfolioImage7.jpg" }],
      githubUrl: "https://github.com/programmingwithkel/FitTrack/tree/main",
      featured: true,
      type: "Mobile App",
      deploymentType: "Android"
    },
    {
      name: "Portfolio Website",
      description: "My first portfolio with parallax effect",
      subtitle: "Personal Portfolio with Parallax Effect",
      longDescription: "A visually stunning personal portfolio website featuring smooth parallax scrolling effects, CSS animations, and responsive design. Built to showcase projects and skills with an immersive user experience that stands out.",
      image: "/images/PortfolioWebsite.png",
      url: "https://programmingwithkel.netlify.app/",
      technologies: ["HTML", "CSS", "JavaScript", "Netlify"],
      dateRange: "2024",
      collaborators: [{ name: "Michael Asis", avatar: "/images/portfolioImage7.jpg" }],
      githubUrl: "https://github.com/programmingwithkel/deploy-portfolio",
      type: "Web App",
      deploymentType: "Netlify"
    },
    {
      name: "Kel EarthCare",
      description: "A responsive informative website for environmental awareness",
      subtitle: "Environmental Awareness Platform",
      longDescription: "Kel EarthCare is a responsive and informative website designed to raise environmental awareness. It features educational content about sustainability, climate change, and eco-friendly practices. The site is built with modern web technologies and optimized for all device sizes.",
      image: "/images/KelEarthCare.png",
      url: "https://kelearthcare.bsit2bcnsc.com/",
      technologies: ["HTML", "CSS", "JavaScript"],
      dateRange: "2025",
      collaborators: [{ name: "Michael Asis", avatar: "/images/portfolioImage7.jpg" }],
      githubUrl: "https://github.com/programmingwithkel/KelEarthCare",
      type: "Web App",
      deploymentType: "Live"
    },
    {
      name: "Hiraya Hotel Booking Management System",
      description: "A hotel booking management system for Hiraya Hotel.",
      subtitle: "Hotel Booking & Guest Management",
      longDescription: "A comprehensive hotel booking management system built for Hiraya Hotel. Features include room reservation, guest management, check-in/check-out tracking, billing, and reporting. The system streamlines hotel operations and provides a seamless booking experience for both staff and guests.",
      image: "/images/HirayaHotel.png",
      technologies: ["Visual Basic", ".NET", "MySQL", "WinForms", "Guna Framework", "PayMongo"],
      dateRange: "2025",
      collaborators: [{ name: "Michael Asis", avatar: "/images/portfolioImage7.jpg" }],
      githubUrl: "https://github.com/programmingwithkel/HirayaHotelBookingSystem",
      type: "Desktop App",
      deploymentType: "Local"
    },
    {
      name: "SK Cal Norte Youth Program Management System",
      description: "A youth program management system for SK Calangcawan Norte.",
      subtitle: "Youth Program & Activity Management",
      longDescription: "A comprehensive management system designed for Sangguniang Kabataan (SK) Calangcawan Norte to efficiently manage youth programs, activities, and member records. The system streamlines the organization and tracking of youth-oriented events, participant registration, and program reporting across the barangay.",
      image: "/images/CalNorte.png",
      technologies: ["Visual Basic", ".NET", "MySQL", "WinForms"],
      dateRange: "2025",
      collaborators: [{ name: "Michael Asis", avatar: "/images/portfolioImage7.jpg" }],
      githubUrl: "https://github.com/programmingwithkel/SK-Cal-Norte-Youth-Program-Management-System",
      type: "Desktop App",
      deploymentType: "Local"
    },
    {
      name: "Dolce Mejor E-Commerce",
      description: "An e-commerce website for Dolce Mejor bakery and pastry shop.",
      subtitle: "Bakery & Pastry Shop E-Commerce",
      longDescription: "Dolce Mejor is a responsive e-commerce website built for a bakery and pastry shop. It features product browsing, a shopping cart, order management, and a clean, appetizing visual design. The site provides customers with an easy-to-use platform to explore and order baked goods online.",
      image: "/images/DolceMejor.png",
      technologies: ["HTML", "CSS", "JavaScript"],
      dateRange: "2024",
      collaborators: [{ name: "Michael Asis", avatar: "/images/portfolioImage7.jpg" }],
      githubUrl: "https://github.com/programmingwithkel/Dolce-Mejor-E-Commerse",
      type: "Web App",
      deploymentType: "Local"
    }
  ],

  goals: [
    "To continuously improve my skills in web, mobile, and system development while exploring UI/UX, AI integration, and prompt engineering to build smarter solutions.",
    "To gain hands-on experience in web, mobile, and system development while improving my testing, debugging, and problem-solving skills through real-world projects."
  ],
  galleryImages: [
    { src: "/images/portfolioImage1.jpg", alt: "Photo 1" },
    { src: "/images/portfolioImage2.jpg", alt: "Photo 2" },
    { src: "/images/portfolioImage3.jpg", alt: "Photo 3" },
    { src: "/images/portfolioImage4.jpg", alt: "Photo 4" },
    { src: "/images/portfolioImage5.jpg", alt: "Photo 5" }
  ],
  socialLinks: [
    { name: "LinkedIn", url: "https://www.linkedin.com/in/michael-asis-23a59b189/", icon: "linkedin" as const },
    { name: "GitHub", url: "https://github.com/programmingwithkel", icon: "github" as const },
    { name: "Instagram", url: "https://www.instagram.com/kelzyxc_/", icon: "instagram" as const }
  ],

  contact: {
    email: "asismichael143@gmail.com",
    speakingInfo: "Open to collaborations on web design and development projects."
  }
};

export default function Home() {
  return (
    <div className="portfolio-container">
      <main className="portfolio-main">
        <FadeIn delay={0} direction="none">
          <ProfileHeader
            name={portfolioData.profile.name}
            location={portfolioData.profile.location}
            roles={portfolioData.profile.roles}
            avatarUrl="/images/portfolioImage7.jpg"
            email={`mailto:${portfolioData.contact.email}`}
            calendarUrl="https://calendly.com/asismichael143/30min"
          />
        </FadeIn>


        <FadeIn delay={50} direction="up">
          <div className="info-grid">
            <div className="info-grid__about">
              <AboutSection paragraphs={portfolioData.about} />
            </div>
            <div className="info-grid__right">
              <Experience experiences={portfolioData.experiences} />
              <SchoolBackground items={portfolioData.schoolBackground} />
            </div>
            <div className="info-grid__tech">
              <TechStack categories={portfolioData.techStack} />
            </div>
          </div>
        </FadeIn>

        {/* Projects */}
        <FadeIn delay={0} direction="up">
          <Projects projects={portfolioData.projects} />
        </FadeIn>

        {/* Footer with Goals, Social Links, Contact */}
        <FadeIn delay={0} direction="up">
          <SocialLinks
            socialLinks={portfolioData.socialLinks}
            speakingInfo={portfolioData.contact.speakingInfo}
            email={portfolioData.contact.email}
            goals={portfolioData.goals}
          />
        </FadeIn>

        <FadeIn delay={0} direction="up">
          <Gallery images={portfolioData.galleryImages} />
        </FadeIn>
      </main>

      {/* Site Footer */}
      <FadeIn delay={0} direction="none">
        <footer className="site-footer">
          <p className="site-footer__text">© 2026 Michael Asis. All rights reserved.</p>
        </footer>
      </FadeIn>

      <ChatButton />

    </div>
  );
}

