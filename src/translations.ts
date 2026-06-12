export const translations = {
  en: {
    nav: {
      home: "Home",
      education: "Education",
      projects: "Projects",
      connect: "Connect",
      resume: "Resume"
    },
    hero: {
      title: "Software Engineering Student at ÉTS | Developing reliable architectures and high-performance systems.",
      viewWork: "View education"
    },
    education: {
      title: "Education & Skills.",
      degree: "Bachelor in Software Engineering",
      expected: "SEPT 2025 - PRESENT",
      foundations: "TECHNICAL SKILLS",
      courses: [
        "> C++, TypeScript, JS, Java, Python, Lua, Assembly",
        "> React, React Native, Express, Node.js, GraphQL",
        "> Qt, Drogon, GTest, Jest",
        "> Git, Docker, GitHub Actions, Linux",
        "> PostgreSQL, MySQL, SQLite, Redis",
        "> Software Architecture, Zero-Knowledge, CI/CD, TDD"
      ]
    },
    projects: {
      showcase: "Interactive Engineering Showcase",
      all: "All Projects",
      academic: "Academic",
      personal: "Personal",
      academicTitle: "Academic Projects",
      academicDesc: "University and college projects demonstrating software architecture, backend systems, and team collaboration.",
      academicLabel: "Coursework",
      personalTitle: "Personal Projects",
      personalDesc: "Self-directed explorations focusing on systems programming, security, and reverse engineering.",
      personalLabel: "Self-directed"
    },
    connect: {
      title: "Let's connect.",
      subtitle: "Interested in high-throughput systems, security, or full-stack development? Drop me a message to build reliable architectures.",
      emailPortal: "Email Contact Portal",
      directEmail: "Contact Me",
      copyEmail: "Copy Email",
      copiedEmail: "Copied!",
      orUseClient: "Or write directly via client: ",
      directStream: "Direct SMTP Contact Stream",
      successMsg: "[SUCCESS] Connection secure. Message dispatched successfully. Keep an eye out for a thread response!",
      nameLabel: "Name",
      namePlaceholder: "e.g. John Doe",
      emailLabel: "Your Email Address",
      emailPlaceholder: "engineer@example.com",
      messageLabel: "Message",
      messagePlaceholder: "Hello, I would like to chat about your systems engineering work...",
      dispatching: "DISPATCHING PAYLOAD...",
      transmit: "TRANSMIT MESSAGE",
      copyright: "© 2026 Natael Lavoie. Built with precision.",
      systemStatus: "System Status: Optimal"
    },
    modal: {
      techStack: "Tech Stack & Targets",
      architecture: "Architecture & Implementation Details",
      simulator: "Interactive Engineering Simulator",
      projectType: "PROJECT"
    },
    projectData: {
      academic: [
        {
          id: "microservices_cicd",
          title: "Microservices Architecture & CI/CD Pipeline",
          category: "academic",
          description: "Deployed a microservices architecture with a Python backend, GraphQL API, and Redis cache, fully containerized and orchestrated.",
          longDescription: "Designed and automated continuous integration and deployment pipelines using GitHub Actions for automated testing. Configured and secured Linux VMs to host self-hosted runners, ensuring complete control over the execution environment.",
          tags: ["Python", "GraphQL", "Redis", "Docker", "GitHub Actions"],
          metrics: [
            { label: "Institution", value: "ÉTS" },
            { label: "Architecture", value: "Microservices" },
            { label: "Automation", value: "CI/CD Pipelines" },
          ],
          keyFeatures: [
            "Containerization using Docker and Docker Compose.",
            "Automated CI/CD pipelines with GitHub Actions.",
            "Self-hosted Linux runner configuration and security."
          ],
        },
        {
          id: "cnn_platform",
          title: "Interactive CNN Learning Platform",
          category: "academic",
          description: "Developed a Convolutional Neural Network (CNN) entirely in TypeScript without external libraries, featuring an interactive React UI.",
          longDescription: "Implemented a responsive user interface in React to visualize weight adjustments and facilitate model learning. Collaborated actively within a scientific research team at LRIMA, co-authoring and presenting the final project at the 90th Acfas Congress.",
          tags: ["TypeScript", "React", "Machine Learning"],
          metrics: [
            { label: "Institution", value: "Maisonneuve" },
            { label: "Algorithm", value: "CNN from scratch" },
            { label: "Achievement", value: "Presented at Acfas" },
          ],
          keyFeatures: [
            "Algorithmic design of CNN entirely in TypeScript.",
            "Real-time weight adjustment visualization in React.",
            "Scientific research and active team collaboration."
          ],
        },
        {
          id: "riskquest",
          title: "RiskQuest Strategy Game",
          category: "academic",
          description: "Developed a cross-platform strategy game with a PHP/SQL REST API and a React Native mobile client.",
          longDescription: "Built a secure PHP backend managing game logic, data persistence, and JWT authentication. Created the Android client with React Native and TypeScript, ensuring smooth global state management. Enforced strict client-server decoupling to allow web and mobile clients to consume the same REST API.",
          tags: ["PHP", "React Native", "TypeScript", "SQL"],
          metrics: [
            { label: "Institution", value: "ÉTS" },
            { label: "Platforms", value: "Web & Mobile" },
            { label: "Security", value: "JWT Auth" },
          ],
          keyFeatures: [
            "REST API managing game logic and authentication.",
            "Mobile app state management and async requests.",
            "Strict client-server decoupling architecture."
          ],
        }
      ],
      personal: [
        {
          id: "truepass",
          title: "TruePass Password Manager",
          category: "personal",
          description: "A Zero-Knowledge password manager built in C++23, utilizing OPAQUE authentication and TPM hardware security.",
          longDescription: "Engineered a strict Zero-Knowledge architecture storing sensitive data only locally. Integrated an aPAKE protocol wrapper with heavy Argon2 hashing executed client-side. Cryptographically bound access keys to the machine's physical TPM module via Windows NCrypt API, with a high-performance Drogon backend.",
          tags: ["C++23", "Qt", "Drogon", "OpenSSL", "Windows API"],
          metrics: [
            { label: "Architecture", value: "Zero-Knowledge" },
            { label: "Security", value: "TPM & OPAQUE" },
            { label: "Hashing", value: "Argon2" }
          ],
          keyFeatures: [
            "Zero-Knowledge architecture with local encryption.",
            "Hardware-bound cryptographic keys via TPM.",
            "High-performance async C++ backend using Drogon."
          ],
        },
        {
          id: "rev_eng",
          title: "Reverse Engineering Challenges",
          category: "personal",
          description: "Continuous resolution of varying complexity challenges requiring static and dynamic analysis of obscure binaries.",
          longDescription: "Engaged in reverse-engineering tasks on Crackmes.one, analyzing x86 assembly and developing key generators in C++. Focused on business logic reconstruction, bypassing software protection, and deepening understanding of low-level execution environments.",
          tags: ["Assembly", "C++", "IDA Pro", "Reverse-Eng"],
          metrics: [
            { label: "Analysis", value: "Static & Dynamic" },
            { label: "Target", value: "x86 Binaries" },
          ],
          keyFeatures: [
            "Static and dynamic binary analysis.",
            "Software protection bypass and keygen development.",
            "Business logic reconstruction from assembly code."
          ],
        },
        {
          id: "physics_engine",
          title: "2D Physics Engine",
          category: "personal",
          description: "Developed a custom modular 2D physics engine in C++20 with collision detection and a graphical rendering pipeline.",
          longDescription: "Built an OOP-based modular architecture decoupling the physics engine, collision system, and rendering pipeline using SFML. Authored a complete 2D vector mathematics library and a kinematic integrator for gravity simulation.",
          tags: ["C++20", "SFML", "Physics", "Math"],
          metrics: [
            { label: "Architecture", value: "Modular OOP" },
            { label: "Math", value: "Custom 2D Vectors" },
          ],
          keyFeatures: [
            "Decoupled physics, collision, and rendering pipelines.",
            "Custom 2D vector mathematics library.",
            "Kinematic integrator for realistic gravity simulation."
          ],
        }
      ]
    }
  },
  fr: {
    nav: {
      home: "Accueil",
      education: "Éducation",
      projects: "Projets",
      connect: "Contact",
      resume: "CV"
    },
    hero: {
      title: "Étudiant en génie logiciel à l'ÉTS | Concepteur d'architectures fiables et de systèmes performants.",
      viewWork: "Voir la formation"
    },
    education: {
      title: "Formation et Compétences.",
      degree: "Baccalauréat en génie logiciel",
      expected: "SEPTEMBRE 2025 - PRÉSENT",
      foundations: "COMPÉTENCES TECHNIQUES",
      courses: [
        "> C++, TypeScript, JS, Java, Python, Lua, Assembleur",
        "> React, React Native, Express, Node.js, GraphQL",
        "> Qt, Drogon, GTest, Jest",
        "> Git, Docker, GitHub Actions, Linux",
        "> PostgreSQL, MySQL, SQLite, Redis",
        "> Architecture logicielle, Zero-Knowledge, CI/CD, TDD"
      ]
    },
    projects: {
      showcase: "Vitrine Interactive d'Ingénierie",
      all: "Tous les Projets",
      academic: "Académique",
      personal: "Personnel",
      academicTitle: "Projets Académiques",
      academicDesc: "Projets universitaires et collégiaux démontrant l'architecture logicielle, les systèmes backend et la collaboration en équipe.",
      academicLabel: "Travaux scolaires",
      personalTitle: "Projets Personnels",
      personalDesc: "Explorations autodirigées axées sur la programmation système, la sécurité et la rétro-ingénierie.",
      personalLabel: "Autodidacte"
    },
    connect: {
      title: "Contactons-nous.",
      subtitle: "Intéressé par les systèmes à haut débit, la sécurité ou le développement full-stack ? Laissez-moi un message.",
      emailPortal: "Portail de Contact Courriel",
      directEmail: "Contactez-moi",
      copyEmail: "Copier le courriel",
      copiedEmail: "Copié !",
      orUseClient: "Ou écrivez directement via : ",
      directStream: "Flux de Contact SMTP Direct",
      successMsg: "[SUCCÈS] Connexion sécurisée. Message envoyé avec succès. Surveillez votre boîte de réception pour une réponse !",
      nameLabel: "Nom",
      namePlaceholder: "ex: Jean-François",
      emailLabel: "Votre Adresse Courriel",
      emailPlaceholder: "ingenieur@exemple.ca",
      messageLabel: "Message",
      messagePlaceholder: "Bonjour, j'aimerais discuter de votre travail en ingénierie des systèmes...",
      dispatching: "ENVOI EN COURS...",
      transmit: "TRANSMETTRE LE MESSAGE",
      copyright: "© 2026 Natael Lavoie. Construit avec précision.",
      systemStatus: "État du Système : Optimal"
    },
    modal: {
      techStack: "Technologies & Cibles",
      architecture: "Détails d'Architecture & Implémentation",
      simulator: "Simulateur d'Ingénierie Interactif",
      projectType: "PROJET"
    },
    projectData: {
      academic: [
        {
          id: "microservices_cicd",
          title: "Architecture de microservices et pipeline CI/CD",
          category: "academic",
          description: "Déploiement d'une architecture orientée microservices (Backend Python, API GraphQL, cache Redis) et orchestration des services locaux via Docker Compose.",
          longDescription: "Conception et automatisation de pipelines avec GitHub Actions pour assurer la validation et les tests automatisés du code. Configuration et sécurisation de machines virtuelles Linux pour l'hébergement de runners personnalisés (self-hosted), garantissant un contrôle total de l'environnement d'exécution.",
          tags: ["Python", "GraphQL", "Redis", "Docker", "GitHub Actions"],
          metrics: [
            { label: "Établissement", value: "ÉTS" },
            { label: "Architecture", value: "Microservices" },
            { label: "Automatisation", value: "Pipelines CI/CD" },
          ],
          keyFeatures: [
            "Conteneurisation via Docker et Docker Compose.",
            "Pipelines CI/CD automatisés avec GitHub Actions.",
            "Configuration et sécurisation de runners Linux self-hosted."
          ],
        },
        {
          id: "cnn_platform",
          title: "Plateforme interactive d'apprentissage (CNN)",
          category: "academic",
          description: "Élaboration et développement de l'architecture d'un réseau de neurones convolutif (CNN) entièrement en TypeScript sans bibliothèque externe.",
          longDescription: "Implémentation d'une interface utilisateur réactive en React pour visualiser l'ajustement des poids et faciliter l'apprentissage du modèle. Collaboration au sein d'une équipe de recherche scientifique (LRIMA), coauteur et présentateur du projet final lors du 90e Congrès de l'Acfas.",
          tags: ["TypeScript", "React", "Machine Learning"],
          metrics: [
            { label: "Établissement", value: "Maisonneuve" },
            { label: "Algorithme", value: "CNN maison" },
            { label: "Accomplissement", value: "Présenté à l'Acfas" },
          ],
          keyFeatures: [
            "Conception algorithmique d'un CNN en TypeScript.",
            "Visualisation en temps réel de l'ajustement des poids.",
            "Recherche scientifique et collaboration en équipe."
          ],
        },
        {
          id: "riskquest",
          title: "RiskQuest -- Jeu de stratégie",
          category: "academic",
          description: "Développement d'un jeu de stratégie multiplateforme avec API REST (PHP/SQL) et client mobile (React Native).",
          longDescription: "Développement du serveur gérant la logique du jeu, la persistance des données et l'authentification sécurisée (JWT). Création du client Android avec gestion fluide des états globaux et requêtes asynchrones. Découplage strict client-serveur permettant aux versions web et mobile de consommer la même API REST.",
          tags: ["PHP", "React Native", "TypeScript", "SQL"],
          metrics: [
            { label: "Établissement", value: "ÉTS" },
            { label: "Plateformes", value: "Web & Mobile" },
            { label: "Sécurité", value: "Auth JWT" },
          ],
          keyFeatures: [
            "API REST pour la logique de jeu et l'authentification.",
            "Gestion des états et requêtes asynchrones sur mobile.",
            "Architecture découplée strictement client-serveur."
          ],
        }
      ],
      personal: [
        {
          id: "truepass",
          title: "TruePass -- Gestionnaire de mots de passe",
          category: "personal",
          description: "Gestionnaire de mots de passe Zero-Knowledge en C++23, utilisant l'authentification OPAQUE et la sécurité matérielle TPM.",
          longDescription: "Architecture Zero-Knowledge avec isolation stricte des données sensibles stockées uniquement dans des répertoires locaux sécurisés. Intégration d'un wrapper du protocole aPAKE avec calculs de hachage lourds (Argon2) côté client. Liaison cryptographique des clés au module TPM via l'API Windows NCrypt. Serveur haute performance en C++23 (Drogon).",
          tags: ["C++23", "Qt", "Drogon", "OpenSSL", "Windows API"],
          metrics: [
            { label: "Architecture", value: "Zero-Knowledge" },
            { label: "Sécurité", value: "TPM & OPAQUE" },
            { label: "Hachage", value: "Argon2" }
          ],
          keyFeatures: [
            "Architecture Zero-Knowledge avec chiffrement local.",
            "Clés cryptographiques liées au matériel via TPM.",
            "Serveur asynchrone C++ haute performance avec Drogon."
          ],
        },
        {
          id: "rev_eng",
          title: "Défis de Rétro-ingénierie (Crackmes.one)",
          category: "personal",
          description: "Résolution continue de défis nécessitant l'analyse statique et dynamique d'exécutables binaires obscurs.",
          longDescription: "Résolution de défis de complexité variable sur Crackmes.one nécessitant une analyse approfondie. Reconstruction de la logique d'affaires, contournement de protections logicielles et développement de générateurs de clés (Keygens) en C++.",
          tags: ["Assembleur", "C++", "IDA Pro", "Reverse-Eng"],
          metrics: [
            { label: "Analyse", value: "Statique & Dynamique" },
            { label: "Cible", value: "Binaires x86" },
          ],
          keyFeatures: [
            "Analyse binaire statique et dynamique.",
            "Contournement de protections logicielles et keygens.",
            "Reconstruction de la logique d'affaires depuis l'assembleur."
          ],
        },
        {
          id: "physics_engine",
          title: "Moteur de Physique 2D",
          category: "personal",
          description: "Développement d'un moteur physique 2D modulaire en C++20 avec détection de collisions et pipeline de rendu graphique.",
          longDescription: "Architecture modulaire basée sur la POO découplant le moteur physique, le système de détection de collisions et le pipeline de rendu graphique (SFML). Développement complet d'une bibliothèque mathématique vectorielle 2D et d'un intégrateur cinématique pour la gravité.",
          tags: ["C++20", "SFML", "Physique", "Math"],
          metrics: [
            { label: "Architecture", value: "POO Modulaire" },
            { label: "Math", value: "Vecteurs 2D sur mesure" },
          ],
          keyFeatures: [
            "Pipelines découplés pour la physique, collisions et rendu.",
            "Bibliothèque mathématique vectorielle 2D personnalisée.",
            "Intégrateur cinématique pour la simulation de la gravité."
          ],
        }
      ]
    }
  }
};
