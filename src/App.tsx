import { useState } from 'react';
import {
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  BriefcaseBusiness,
  CheckCircle2,
  ChevronDown,
  CircleDollarSign,
  ClipboardCheck,
  Globe2,
  GraduationCap,
  HeartHandshake,
  Menu,
  MousePointerClick,
  ShieldCheck,
  Sparkles,
  Users,
  Wallet,
  X,
  Zap,
} from 'lucide-react';

const categories = [
  {
    icon: ClipboardCheck,
    title: 'Microtasks',
    description: 'Explore small digital tasks, data labeling, and simple online work.',
    color: 'purple',
    tag: 'Task opportunities',
  },
  {
    icon: Globe2,
    title: 'Online Surveys',
    description: 'Discover research surveys and share your opinions when eligible.',
    color: 'blue',
    tag: 'Research',
  },
  {
    icon: HeartHandshake,
    title: 'Affiliate Marketing',
    description: 'Learn how to promote products through approved referral programs.',
    color: 'gold',
    tag: 'Referral opportunities',
  },
  {
    icon: MousePointerClick,
    title: 'Website Testing',
    description: 'Explore opportunities to test websites and provide useful feedback.',
    color: 'pink',
    tag: 'Digital testing',
  },
  {
    icon: BriefcaseBusiness,
    title: 'Freelance Skills',
    description: 'Find ways to turn writing, design, research, and digital skills into work.',
    color: 'green',
    tag: 'Skill-based work',
  },
  {
    icon: GraduationCap,
    title: 'Learn & Grow',
    description: 'Build practical skills that can help you pursue better opportunities.',
    color: 'orange',
    tag: 'Skill development',
  },
];

const steps = [
  {
    number: '01',
    title: 'Create your account',
    description:
      'Get started with your profile and explore the opportunities available to you.',
    icon: Users,
  },
  {
    number: '02',
    title: 'Explore opportunities',
    description:
      'Review task requirements, eligibility, and reward terms before participating.',
    icon: Sparkles,
  },
  {
    number: '03',
    title: 'Complete eligible work',
    description:
      'Follow the instructions and submit your work for review where required.',
    icon: CheckCircle2,
  },
  {
    number: '04',
    title: 'Track your progress',
    description:
      'Keep track of completed work and verified rewards when earning features become available.',
    icon: Wallet,
  },
];

const faqs = [
  {
    question: 'What is EarnBridge?',
    answer:
      'EarnBridge is being developed as a platform to help people discover digital work, microtasks, research opportunities, and skill-building resources.',
  },
  {
    question: 'Is EarnBridge free to join?',
    answer:
      'The planned model is to let people explore opportunities without paying a registration fee. Never pay anyone who claims they can guarantee you tasks or earnings through EarnBridge.',
  },
  {
    question: 'Can I earn money immediately?',
    answer:
      'Earnings are not guaranteed. Opportunities must be verified and available before you can participate, and payment arrangements must be tested before rewards can be promised.',
  },
  {
    question: 'Can people outside Nigeria use EarnBridge?',
    answer:
      'The platform is being designed with international access in mind. The availability of specific tasks and payment methods may vary by country.',
  },
];

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [notice, setNotice] = useState('');

  const showNotice = (message: string) => {
    setNotice(message);
    setMenuOpen(false);
    window.setTimeout(() => setNotice(''), 4000);
  };

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  };

  return (
    <div className="app-shell">
      <div className="announcement">
        <span className="announcement-dot" />
        Building a better bridge to digital opportunities
        <ArrowRight size={14} />
      </div>

      <header className="site-header">
        <div className="container nav-inner">
          <a className="brand" href="#home" aria-label="EarnBridge home">
            <span className="brand-mark">
              <Globe2 size={25} strokeWidth={2.4} />
              <span className="brand-sparkle">✦</span>
            </span>
            <span className="brand-copy">
              <strong>Earn<span>Bridge</span></strong>
              <small>Earn Small. Grow Together.</small>
            </span>
          </a>

          <nav className={`desktop-nav ${menuOpen ? 'nav-open' : ''}`}>
            <a href="#opportunities" onClick={() => setMenuOpen(false)}>Opportunities</a>
            <a href="#how-it-works" onClick={() => setMenuOpen(false)}>How it works</a>
            <a href="#about" onClick={() => setMenuOpen(false)}>About us</a>
            <a href="#faq" onClick={() => setMenuOpen(false)}>FAQs</a>
            <button
              className="mobile-nav-action"
              onClick={() => showNotice('Account registration is not connected yet.')}
            >
              Get started <ArrowRight size={16} />
            </button>
          </nav>

          <div className="nav-actions">
            <button
              className="login-button"
              onClick={() => showNotice('Account sign-in is coming in a future development phase.')}
            >
              Log in
            </button>
            <button
              className="primary-button nav-cta"
              onClick={() => showNotice('Account registration is not connected yet.')}
            >
              Get started <ArrowUpRight size={16} />
            </button>
          </div>

          <button
            className="menu-toggle"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={23} /> : <Menu size={23} />}
          </button>
        </div>
      </header>

      <main>
        <section className="hero" id="home">
          <div className="hero-decoration hero-decoration-one" />
          <div className="hero-decoration hero-decoration-two" />

          <div className="container hero-grid">
            <div className="hero-copy">
              <div className="hero-badge">
                <Sparkles size={15} />
                YOUR NEXT OPPORTUNITY STARTS HERE
              </div>

              <h1>
                Your bridge to
                <span className="gradient-text"> earning possibilities.</span>
              </h1>

              <p className="hero-description">
                Discover digital work, explore new opportunities, and build
                skills that can take you further. Your journey starts with one step.
              </p>

              <div className="hero-actions">
                <button
                  className="primary-button hero-primary"
                  onClick={() => scrollTo('opportunities')}
                >
                  Explore opportunities <ArrowRight size={18} />
                </button>
                <button
                  className="secondary-button hero-secondary"
                  onClick={() => scrollTo('how-it-works')}
                >
                  See how it works
                </button>
              </div>

              <div className="hero-assurance">
                <span><ShieldCheck size={17} /> Opportunity awareness</span>
                <span><Globe2 size={17} /> Global vision</span>
              </div>
            </div>

            <div className="hero-visual">
              <div className="visual-orbit orbit-one" />
              <div className="visual-orbit orbit-two" />

              <div className="visual-card main-visual-card">
                <div className="visual-card-top">
                  <div>
                    <span className="visual-eyebrow">YOUR NEXT CHAPTER</span>
                    <h3>Make room for growth.</h3>
                  </div>
                  <span className="visual-icon"><Zap size={21} /></span>
                </div>

                <div className="visual-illustration">
                  <div className="illustration-circle circle-one" />
                  <div className="illustration-circle circle-two" />
                  <div className="bridge-platform platform-back" />
                  <div className="bridge-platform platform-front" />
                  <div className="bridge-pillar pillar-one" />
                  <div className="bridge-pillar pillar-two" />
                  <div className="bridge-cable cable-one" />
                  <div className="bridge-cable cable-two" />
                  <div className="bridge-road" />
                  <div className="bridge-person">
                    <div className="person-head" />
                    <div className="person-body" />
                  </div>
                  <div className="floating-star star-one">✦</div>
                  <div className="floating-star star-two">✧</div>
                </div>

                <div className="visual-bottom">
                  <div className="visual-bottom-icon"><CircleDollarSign size={20} /></div>
                  <div>
                    <strong>Possibilities, not promises</strong>
                    <span>Discover. Learn. Progress.</span>
                  </div>
                  <ArrowUpRight size={19} className="visual-arrow" />
                </div>
              </div>

              <div className="floating-chip chip-top">
                <span className="chip-icon chip-purple"><Sparkles size={17} /></span>
                <span><strong>Learn something new</strong><small>Grow your skills</small></span>
              </div>

              <div className="floating-chip chip-bottom">
                <span className="chip-icon chip-blue"><BadgeCheck size={18} /></span>
                <span><strong>Choose wisely</strong><small>Check every opportunity</small></span>
              </div>

              <div className="hero-orb hero-orb-gold" />
              <div className="hero-orb hero-orb-blue" />
            </div>
          </div>

          <div className="container hero-bottom-note">
            <span className="note-line" />
            <p>Small steps can open doors to bigger possibilities.</p>
            <span className="note-line" />
          </div>
        </section>

        <section className="opportunities-section section" id="opportunities">
          <div className="container">
            <div className="section-heading">
              <span className="eyebrow"><Sparkles size={15} /> EXPLORE YOUR OPTIONS</span>
              <h2>Find a path that fits <span className="gradient-text">your goals.</span></h2>
              <p>
                Explore different types of digital opportunities and discover
                where your time, interests, and skills may fit.
              </p>
            </div>

            <div className="category-grid">
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <article className="category-card card" key={category.title}>
                    <div className={`category-icon icon-${category.color}`}>
                      <Icon size={24} />
                    </div>
                    <span className="category-tag">{category.tag}</span>
                    <h3>{category.title}</h3>
                    <p>{category.description}</p>
                    <button
                      className="text-link"
                      onClick={() =>
                        showNotice(
                          `${category.title} opportunities are not connected yet. This category is currently for exploration only.`,
                        )
                      }
                    >
                      Explore category <ArrowRight size={16} />
                    </button>
                  </article>
                );
              })}
            </div>

            <div className="opportunity-disclaimer">
              <ShieldCheck size={19} />
              <p>
                <strong>Know before you start.</strong> These are planned opportunity
                categories, not a list of currently verified paid tasks. Availability,
                eligibility, and rewards must be confirmed before participation.
              </p>
            </div>
          </div>
        </section>

        <section className="how-section section" id="how-it-works">
          <div className="container">
            <div className="section-heading">
              <span className="eyebrow"><Zap size={15} /> SIMPLE BY DESIGN</span>
              <h2>A clearer path from <span className="gradient-text">curiosity to action.</span></h2>
              <p>
                The planned EarnBridge journey is designed to help people make
                informed choices at every stage.
              </p>
            </div>

            <div className="steps-grid">
              {steps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <article className="step-card" key={step.number}>
                    <div className="step-top">
                      <span className="step-number">{step.number}</span>
                      <span className="step-icon"><Icon size={22} /></span>
                    </div>
                    {index < steps.length - 1 && <div className="step-connector" />}
                    <h3>{step.title}</h3>
                    <p>{step.description}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="about-section section" id="about">
          <div className="container about-grid">
            <div className="about-art">
              <div className="about-art-circle">
                <div className="about-art-inner">
                  <Globe2 size={72} strokeWidth={1.4} />
                  <span className="about-art-star">✦</span>
                </div>
              </div>
              <div className="about-label about-label-top">
                <ShieldCheck size={17} /> Built around informed choices
              </div>
              <div className="about-label about-label-bottom">
                <HeartHandshake size={17} /> Progress together
              </div>
            </div>

            <div className="about-copy">
              <span className="eyebrow"><HeartHandshake size={15} /> OUR PURPOSE</span>
              <h2>Opportunity should be easier to <span className="gradient-text">discover.</span></h2>
              <p>
                EarnBridge is an initiative from Ayanfe Innovation Labs Limited
                with a simple vision: make it easier for people to discover
                digital opportunities, understand their options, and develop
                useful skills.
              </p>
              <p>
                We're building with transparency in mind. We won't promise
                guaranteed income, and opportunities should be reviewed carefully
                before anyone commits their time.
              </p>
              <button className="primary-button" onClick={() => scrollTo('faq')}>
                Learn more about EarnBridge <ArrowRight size={17} />
              </button>
            </div>
          </div>
        </section>

        <section className="trust-section">
          <div className="container trust-grid">
            <div className="trust-item">
              <ShieldCheck size={24} />
              <div><strong>Transparency first</strong><span>Clear information matters.</span></div>
            </div>
            <div className="trust-item">
              <Globe2 size={24} />
              <div><strong>Global perspective</strong><span>Designed with wider access in mind.</span></div>
            </div>
            <div className="trust-item">
              <GraduationCap size={24} />
              <div><strong>Growth focused</strong><span>Skills are part of the journey.</span></div>
            </div>
          </div>
        </section>

        <section className="faq-section section" id="faq">
          <div className="container faq-grid">
            <div className="faq-intro">
              <span className="eyebrow"><Sparkles size={15} /> GOOD QUESTIONS</span>
              <h2>Things you might want to <span className="gradient-text">know.</span></h2>
              <p>
                Clear answers help you make better decisions. Here are a few
                things to know about the EarnBridge project.
              </p>
              <div className="faq-help-card">
                <div className="faq-help-icon"><HeartHandshake size={22} /></div>
                <div>
                  <strong>Have another question?</strong>
                  <span>More support options will be added as the platform develops.</span>
                </div>
              </div>
            </div>

            <div className="faq-list">
              {faqs.map((faq, index) => (
                <article className={`faq-item ${openFaq === index ? 'faq-active' : ''}`} key={faq.question}>
                  <button
                    className="faq-question"
                    aria-expanded={openFaq === index}
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  >
                    <span>{faq.question}</span>
                    <ChevronDown size={20} />
                  </button>
                  {openFaq === index && <p className="faq-answer">{faq.answer}</p>}
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="closing-section">
          <div className="container closing-inner">
            <div className="closing-sparkle sparkle-left">✦</div>
            <div className="closing-content">
              <span className="eyebrow closing-eyebrow"><Sparkles size={15} /> YOUR JOURNEY, YOUR PACE</span>
              <h2>Every big journey begins with <span>one small step.</span></h2>
              <p>
                Explore what's possible, learn something useful, and keep moving forward.
              </p>
              <button className="closing-button" onClick={() => scrollTo('opportunities')}>
                Discover opportunities <ArrowRight size={18} />
              </button>
            </div>
            <div className="closing-sparkle sparkle-right">✧</div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="container footer-main">
          <div className="footer-brand">
            <a className="brand" href="#home">
              <span className="brand-mark">
                <Globe2 size={25} strokeWidth={2.4} />
                <span className="brand-sparkle">✦</span>
              </span>
              <span className="brand-copy">
                <strong>Earn<span>Bridge</span></strong>
                <small>Earn Small. Grow Together.</small>
              </span>
            </a>
            <p>
              A bridge to discovering digital opportunities, building skills,
              and growing with purpose.
            </p>
          </div>

          <div className="footer-column">
            <h4>Explore</h4>
            <a href="#opportunities">Opportunities</a>
            <a href="#how-it-works">How it works</a>
            <a href="#about">About us</a>
          </div>

                    <div className="footer-column">
            <h4>Information</h4>
            <a href="#faq">FAQs</a>
            <button
              onClick={() =>
                showNotice(
                  'Terms of use will be published before platform registration launches.',
                )
              }
            >
              Terms of use
            </button>
            <button
              onClick={() =>
                showNotice(
                  'A privacy policy will be published before personal information is collected.',
                )
              }
            >
              Privacy policy
            </button>
          </div>

          <div className="footer-column footer-safety">
            <h4>Stay informed</h4>
            <p>
              Always check opportunity requirements and never pay a fee for a
              guaranteed earning promise.
            </p>
            <span className="footer-safety-badge">
              <ShieldCheck size={15} /> Safety matters
            </span>
          </div>
        </div>

        <div className="container footer-bottom">
          <span>
            © {new Date().getFullYear()} Ayanfe Innovation Labs Limited.
          </span>
          <span>Earn Small. Grow Together.</span>
        </div>
      </footer>

      {notice && (
        <div className="notice-toast" role="status">
          <span className="notice-toast-icon">
            <ShieldCheck size={19} />
          </span>
          <span>{notice}</span>
          <button
            aria-label="Dismiss notification"
            onClick={() => setNotice('')}
          >
            <X size={17} />
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
