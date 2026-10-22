import { useEffect, useState, type FormEvent } from 'react';
import {
  ArrowRight,
  BadgeCheck,
  BriefcaseBusiness,
  CheckCircle2,
  ClipboardCheck,
  Eye,
  EyeOff,
  Globe2,
  GraduationCap,
  HeartHandshake,
  LoaderCircle,
  LockKeyhole,
  LogOut,
  Mail,
  Menu,
  MousePointerClick,
  ShieldCheck,
  Sparkles,
  Users,
  Wallet,
  X,
  Zap,
} from 'lucide-react';
import type { User } from '@supabase/supabase-js';
import { supabase } from './lib/supabase';

const categories = [
  {
    icon: ClipboardCheck,
    title: 'Microtasks',
    description: 'Explore small digital tasks and simple online work.',
  },
  {
    icon: Globe2,
    title: 'Online Surveys',
    description: 'Discover surveys and check their eligibility requirements.',
  },
  {
    icon: HeartHandshake,
    title: 'Affiliate Marketing',
    description: 'Learn about referral programmes and their requirements.',
  },
  {
    icon: MousePointerClick,
    title: 'Website Testing',
    description: 'Explore website testing and feedback opportunities.',
  },
  {
    icon: BriefcaseBusiness,
    title: 'Freelance Skills',
    description: 'Explore writing, design, research, and digital skills.',
  },
  {
    icon: GraduationCap,
    title: 'Learn & Grow',
    description: 'Build useful skills for future opportunities.',
  },
];

type AuthMode = 'login' | 'signup';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>('signup');
  const [menuOpen, setMenuOpen] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    let mounted = true;

    const checkSession = async () => {
      const params = new URLSearchParams(window.location.search);
      const emailConfirmed = params.get('auth') === 'confirmed';

      if (emailConfirmed) {
        // Remove the confirmation marker from the visible URL.
        window.history.replaceState(
          {},
          document.title,
          window.location.pathname,
        );

        // Open login after confirmation, even if Supabase created a session.
        await supabase.auth.signOut();

        if (mounted) {
          setUser(null);
          setAuthMode('login');
          setAuthOpen(true);
          setSuccess('');
          setError('');
          setAuthReady(true);
        }

        return;
      }

      const { data, error: sessionError } =
        await supabase.auth.getSession();

      if (!mounted) return;

      if (sessionError) {
        setError('We could not check your session. Please refresh the page.');
      }

      setUser(data.session?.user ?? null);
      setAuthReady(true);
    };

    void checkSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted) {
        setUser(session?.user ?? null);
        setAuthReady(true);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const openAuth = (mode: AuthMode) => {
    setAuthMode(mode);
    setEmail('');
    setPassword('');
    setError('');
    setSuccess('');
    setShowPassword(false);
    setAuthOpen(true);
    setMenuOpen(false);
  };

  const closeAuth = () => {
    if (busy) return;
    setAuthOpen(false);
    setError('');
    setSuccess('');
  };

  const handleAuth = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail) {
      setError('Please enter your email address.');
      return;
    }

    if (password.length < 8) {
      setError('Your password must contain at least 8 characters.');
      return;
    }

    setBusy(true);

    try {
      if (authMode === 'signup') {
        const { data, error: signupError } =
          await supabase.auth.signUp({
            email: cleanEmail,
            password,
            options: {
              emailRedirectTo: `${window.location.origin}/?auth=confirmed`,
            },
          });

        if (signupError) throw signupError;

        if (data.session) {
          setUser(data.session.user);
          setAuthOpen(false);
          setPassword('');
        } else {
          setSuccess(
            'Account registration started! Check your inbox and confirm your email. After confirmation, you can log in here.',
          );
          setPassword('');
        }
      } else {
        const { data, error: loginError } =
          await supabase.auth.signInWithPassword({
            email: cleanEmail,
            password,
          });

        if (loginError) throw loginError;

        setUser(data.user);
        setAuthOpen(false);
        setPassword('');
        setSuccess('');
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : 'Something went wrong. Please try again.';

      const lowerMessage = message.toLowerCase();

      if (lowerMessage.includes('email not confirmed')) {
        setError(
          'Your email is not confirmed yet. Open the confirmation link in your inbox first.',
        );
      } else if (lowerMessage.includes('invalid login credentials')) {
        setError('Incorrect email or password. Please check and try again.');
      } else if (lowerMessage.includes('user already registered')) {
        setError(
          'An account may already exist with this email. Try logging in.',
        );
      } else if (
        lowerMessage.includes('redirect') ||
        lowerMessage.includes('not allowed')
      ) {
        setError(
          'The confirmation redirect may not be allowed in Supabase. Check Authentication URL Configuration.',
        );
      } else {
        setError(message);
      }
    } finally {
      setBusy(false);
    }
  };

  const handleLogout = async () => {
    setError('');

    const { error: logoutError } = await supabase.auth.signOut();

    if (logoutError) {
      setError('We could not sign you out. Please try again.');
      return;
    }

    setUser(null);
    setAuthOpen(false);
    setSuccess('');
  };

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  };

  const primaryButton: React.CSSProperties = {
    width: '100%',
    minHeight: 48,
    padding: '12px 16px',
    border: 0,
    borderRadius: 12,
    color: '#fff',
    background: 'linear-gradient(120deg, #6d28d9, #8051d9)',
    fontWeight: 700,
    fontSize: 14,
    cursor: busy ? 'wait' : 'pointer',
    opacity: busy ? 0.7 : 1,
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    minHeight: 48,
    boxSizing: 'border-box',
    padding: '12px 14px',
    border: '1px solid #e5def2',
    borderRadius: 11,
    background: '#fff',
    color: '#24163d',
    fontSize: 14,
  };

  // Signed-in members see their dashboard instead of the public landing page.
  if (user) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: '#f8f6fc',
          color: '#24163d',
          fontFamily: 'inherit',
        }}
      >
        <header
          style={{
            background: '#fff',
            borderBottom: '1px solid #ece6f5',
          }}
        >
          <div
            style={{
              maxWidth: 1180,
              margin: '0 auto',
              padding: '14px 20px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 12,
              flexWrap: 'wrap',
            }}
          >
            <a
              href="/"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                color: '#24163d',
                textDecoration: 'none',
              }}
            >
              <span
                style={{
                  display: 'grid',
                  placeItems: 'center',
                  width: 42,
                  height: 42,
                  borderRadius: 13,
                  background: '#f1eafe',
                  color: '#6d28d9',
                }}
              >
                <Globe2 size={24} />
              </span>
              <span>
                <strong style={{ display: 'block', fontSize: 20 }}>
                  Earn<span style={{ color: '#6d28d9' }}>Bridge</span>
                </strong>
                <small style={{ color: '#756b88' }}>
                  Earn Small. Grow Together.
                </small>
              </span>
            </a>

            <button
              onClick={handleLogout}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                border: 0,
                borderRadius: 11,
                padding: '12px 16px',
                background: '#6d28d9',
                color: '#fff',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              <LogOut size={16} /> Sign out
            </button>
          </div>
        </header>

        <main
          style={{
            maxWidth: 1180,
            margin: '0 auto',
            padding: '28px 20px 50px',
          }}
        >
          <section
            style={{
              padding: '28px 24px',
              borderRadius: 22,
              background: 'linear-gradient(120deg, #5b21b6, #8051d9)',
              color: '#fff',
              marginBottom: 24,
            }}
          >
            <span
              style={{
                fontSize: 12,
                fontWeight: 800,
                letterSpacing: 1,
              }}
            >
              YOUR EARNBRIDGE SPACE
            </span>
            <h1
              style={{
                fontSize: 'clamp(26px, 5vw, 38px)',
                margin: '10px 0',
              }}
            >
              Welcome to your dashboard!
            </h1>
            <p style={{ margin: 0, lineHeight: 1.8, overflowWrap: 'anywhere' }}>
              You're signed in as {user.email ?? 'an EarnBridge member'}.
              Explore opportunities and build your next steps at your own pace.
            </p>
          </section>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))',
              gap: 16,
              marginBottom: 32,
            }}
          >
            {[
              {
                label: 'Opportunity categories',
                value: '6',
                note: 'Explore areas of interest',
                icon: Sparkles,
              },
              {
                label: 'Saved opportunities',
                value: '0',
                note: 'Saving tools coming soon',
                icon: BadgeCheck,
              },
              {
                label: 'Completed activities',
                value: '0',
                note: 'Activity tracking coming soon',
                icon: ClipboardCheck,
              },
              {
                label: 'Verified earnings',
                value: '₦0',
                note: 'No earnings recorded yet',
                icon: Wallet,
              },
            ].map((item) => {
              const Icon = item.icon;

              return (
                <article
                  key={item.label}
                  style={{
                    padding: 20,
                    borderRadius: 18,
                    background: '#fff',
                    border: '1px solid #ece6f5',
                    boxShadow: '0 8px 24px #25104408',
                  }}
                >
                  <span
                    style={{
                      display: 'grid',
                      placeItems: 'center',
                      width: 42,
                      height: 42,
                      borderRadius: 12,
                      background: '#f1eafe',
                      color: '#6d28d9',
                      marginBottom: 15,
                    }}
                  >
                    <Icon size={21} />
                  </span>
                  <p
                    style={{
                      margin: '0 0 6px',
                      color: '#756b88',
                      fontSize: 13,
                    }}
                  >
                    {item.label}
                  </p>
                  <strong
                    style={{
                      display: 'block',
                      fontSize: 27,
                      marginBottom: 7,
                    }}
                  >
                    {item.value}
                  </strong>
                  <small style={{ color: '#9186a1', lineHeight: 1.5 }}>
                    {item.note}
                  </small>
                </article>
              );
            })}
          </div>

          <section style={{ marginBottom: 32 }}>
            <span
              style={{
                color: '#6d28d9',
                fontSize: 12,
                fontWeight: 800,
                letterSpacing: 1,
              }}
            >
              DISCOVER
            </span>
            <h2 style={{ margin: '8px 0', fontSize: 26 }}>
              Explore opportunity categories
            </h2>
            <p style={{ color: '#756b88', lineHeight: 1.8 }}>
              Explore the areas below. These are introductory categories, not
              verified live job listings. Earnings are not guaranteed.
            </p>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 290px), 1fr))',
                gap: 16,
              }}
            >
              {categories.map((category) => {
                const Icon = category.icon;

                return (
                  <article
                    key={category.title}
                    style={{
                      padding: 20,
                      borderRadius: 18,
                      background: '#fff',
                      border: '1px solid #ece6f5',
                    }}
                  >
                    <span
                      style={{
                        display: 'grid',
                        placeItems: 'center',
                        width: 44,
                        height: 44,
                        borderRadius: 13,
                        background: '#f1eafe',
                        color: '#6d28d9',
                        marginBottom: 14,
                      }}
                    >
                      <Icon size={22} />
                    </span>
                    <h3 style={{ margin: '0 0 8px', fontSize: 18 }}>
                      {category.title}
                    </h3>
                    <p
                      style={{
                        margin: '0 0 15px',
                        color: '#756b88',
                        lineHeight: 1.7,
                        fontSize: 14,
                      }}
                    >
                      {category.description}
                    </p>
                    <span
                      style={{
                        display: 'inline-block',
                        padding: '6px 10px',
                        borderRadius: 8,
                        background: '#fff7ed',
                        color: '#9a3412',
                        fontSize: 11,
                        fontWeight: 800,
                      }}
                    >
                      COMING SOON
                    </span>
                  </article>
                );
              })}
            </div>
          </section>

          <section
            style={{
              padding: 22,
              borderRadius: 18,
              background: '#fff',
              border: '1px solid #ece6f5',
            }}
          >
            <h2 style={{ margin: '0 0 8px', fontSize: 21 }}>
              Account information
            </h2>
            <p
              style={{
                color: '#756b88',
                lineHeight: 1.8,
                overflowWrap: 'anywhere',
              }}
            >
              Signed-in email:{' '}
              <strong style={{ color: '#24163d' }}>
                {user.email ?? 'Not available'}
              </strong>
            </p>
            <p
              style={{
                color: '#756b88',
                fontSize: 13,
                lineHeight: 1.8,
                marginBottom: 0,
              }}
            >
              Profile editing, saved opportunities, and activity history will
              be added in future updates.
            </p>
          </section>

          <footer
            style={{
              textAlign: 'center',
              marginTop: 30,
              color: '#9186a1',
              fontSize: 12,
              lineHeight: 1.8,
            }}
          >
            © {new Date().getFullYear()} EarnBridge
            <br />
            Created by Ayanfe Innovation Labs Limited
            <br />
            Earn Small. Grow Together.
          </footer>
        </main>
      </div>
    );
  }

  // Public landing page for visitors who are not signed in.
  return (
    <div className="app-shell">
      <div className="announcement">
        <span className="announcement-dot" />
        Building a better bridge to digital opportunities
        <ArrowRight size={14} />
      </div>

      <header className="site-header">
        <div className="container nav-inner">
          <a className="brand" href="#home">
            <span className="brand-mark">
              <Globe2 size={25} />
              <span className="brand-sparkle">✦</span>
            </span>
            <span className="brand-copy">
              <strong>Earn<span>Bridge</span></strong>
              <small>Earn Small. Grow Together.</small>
            </span>
          </a>

          <nav className={`desktop-nav ${menuOpen ? 'nav-open' : ''}`}>
            <a href="#opportunities" onClick={() => setMenuOpen(false)}>
              Opportunities
            </a>
            <a href="#how-it-works" onClick={() => setMenuOpen(false)}>
              How it works
            </a>
            <a href="#about" onClick={() => setMenuOpen(false)}>
              About us
            </a>
            <button
              className="mobile-nav-action"
              onClick={() => openAuth('signup')}
            >
              Get started <ArrowRight size={16} />
            </button>
          </nav>

          <div className="nav-actions">
            <button
              className="login-button"
              onClick={() => openAuth('login')}
            >
              Log in
            </button>
            <button
              className="primary-button nav-cta"
              onClick={() => openAuth('signup')}
            >
              Get started <ArrowRight size={16} />
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
                skills that can take you further. Your journey starts with one
                step.
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
                  <div className="visual-bottom-icon">
                    <CircleDollarSign size={20} />
                  </div>
                  <div>
                    <strong>Possibilities, not promises</strong>
                    <span>Discover. Learn. Progress.</span>
                  </div>
                  <ArrowUpRight size={19} className="visual-arrow" />
                </div>
              </div>

              <div className="floating-chip chip-top">
                <span className="chip-icon chip-purple">
                  <Sparkles size={17} />
                </span>
                <span>
                  <strong>Learn something new</strong>
                  <small>Grow your skills</small>
                </span>
              </div>

              <div className="floating-chip chip-bottom">
                <span className="chip-icon chip-blue">
                  <BadgeCheck size={18} />
                </span>
                <span>
                  <strong>Choose wisely</strong>
                  <small>Check every opportunity</small>
                </span>
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
              <span className="eyebrow">
                <Sparkles size={15} /> EXPLORE YOUR OPTIONS
              </span>
              <h2>
                Find a path that fits{' '}
                <span className="gradient-text">your goals.</span>
              </h2>
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
                    <span className="category-tag">
                      Opportunity category
                    </span>
                    <h3>{category.title}</h3>
                    <p>{category.description}</p>
                    <button
                      className="text-link"
                      onClick={() =>
                        setSuccess(
                          `${category.title} is planned. Verified opportunities are not available in this section yet.`,
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
                <strong>Know before you start.</strong> These are planned
                opportunity categories, not a list of verified paid tasks.
                Earnings and rewards are not guaranteed.
              </p>
            </div>
          </div>
        </section>

        <section className="how-section section" id="how-it-works">
          <div className="container">
            <div className="section-heading">
              <span className="eyebrow"><Zap size={15} /> SIMPLE BY DESIGN</span>
              <h2>
                A clearer path from{' '}
                <span className="gradient-text">curiosity to action.</span>
              </h2>
              <p>
                EarnBridge aims to help people make informed choices at every
                stage.
              </p>
            </div>

            <div className="steps-grid">
              {[
                {
                  number: '01',
                  title: 'Create your account',
                  description: 'Register using your email address.',
                  icon: Users,
                },
                {
                  number: '02',
                  title: 'Explore opportunities',
                  description: 'Review requirements and eligibility.',
                  icon: Sparkles,
                },
                {
                  number: '03',
                  title: 'Complete eligible work',
                  description: 'Follow instructions from verified providers.',
                  icon: CheckCircle2,
                },
                {
                  number: '04',
                  title: 'Track your progress',
                  description: 'Use verified records when these features launch.',
                  icon: Wallet,
                },
              ].map((step, index, allSteps) => {
                const Icon = step.icon;

                return (
                  <article className="step-card" key={step.number}>
                    <div className="step-top">
                      <span className="step-number">{step.number}</span>
                      <span className="step-icon"><Icon size={22} /></span>
                    </div>
                    {index < allSteps.length - 1 && (
                      <div className="step-connector" />
                    )}
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
              <span className="eyebrow">
                <HeartHandshake size={15} /> OUR PURPOSE
              </span>
              <h2>
                Opportunity should be easier to{' '}
                <span className="gradient-text">discover.</span>
              </h2>
              <p>
                EarnBridge is an initiative from Ayanfe Innovation Labs Limited
                with a simple vision: help people discover digital
                opportunities, understand their options, and develop useful
                skills.
              </p>
              <p>
                We won't promise guaranteed income. Opportunities should be
                reviewed carefully before anyone commits their time.
              </p>
              <button
                className="primary-button"
                onClick={() => scrollTo('faq')}
              >
                Learn more about EarnBridge <ArrowRight size={17} />
              </button>
            </div>
          </div>
        </section>

        <section className="trust-section">
          <div className="container trust-grid">
            <div className="trust-item">
              <ShieldCheck size={24} />
              <div>
                <strong>Transparency first</strong>
                <span>Clear information matters.</span>
              </div>
            </div>
            <div className="trust-item">
              <Globe2 size={24} />
              <div>
                <strong>Global perspective</strong>
                <span>Designed with wider access in mind.</span>
              </div>
            </div>
            <div className="trust-item">
              <GraduationCap size={24} />
              <div>
                <strong>Growth focused</strong>
                <span>Skills are part of the journey.</span>
              </div>
            </div>
          </div>
        </section>

        <section className="faq-section section" id="faq">
          <div className="container faq-grid">
            <div className="faq-intro">
              <span className="eyebrow">
                <Sparkles size={15} /> GOOD QUESTIONS
              </span>
              <h2>
                Things you might want to{' '}
                <span className="gradient-text">know.</span>
              </h2>
              <p>
                Clear answers help you make better decisions about EarnBridge.
              </p>
              <div className="faq-help-card">
                <div className="faq-help-icon">
                  <HeartHandshake size={22} />
                </div>
                <div>
                  <strong>Have another question?</strong>
                  <span>
                    More support options will be added as the platform develops.
                  </span>
                </div>
              </div>
            </div>

            <div className="faq-list">
              {faqs.map((faq, index) => (
                <article
                  className={`faq-item ${openFaq === index ? 'faq-active' : ''}`}
                  key={faq.question}
                >
                  <button
                    className="faq-question"
                    aria-expanded={openFaq === index}
                    onClick={() =>
                      setOpenFaq(openFaq === index ? null : index)
                    }
                  >
                    <span>{faq.question}</span>
                    <ChevronDown size={20} />
                  </button>
                  {openFaq === index && (
                    <p className="faq-answer">{faq.answer}</p>
                  )}
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="closing-section">
          <div className="container closing-inner">
            <div className="closing-sparkle sparkle-left">✦</div>
            <div className="closing-content">
              <span className="eyebrow closing-eyebrow">
                <Sparkles size={15} /> YOUR JOURNEY, YOUR PACE
              </span>
              <h2>
                Every big journey begins with <span>one small step.</span>
              </h2>
              <p>
                Explore what's possible, learn something useful, and keep
                moving forward.
              </p>
              <button
                className="closing-button"
                onClick={() => openAuth('signup')}
              >
                Create your account <ArrowRight size={18} />
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
              Helping people discover digital opportunities and develop useful
              skills.
            </p>
          </div>

          <div className="footer-column">
            <h4>Explore</h4>
            <a href="#opportunities">Opportunities</a>
            <a href="#how-it-works">How it works</a>
            <a href="#about">About us</a>
          </div>

          <div className="footer-column">
            <h4>Your account</h4>
            <button onClick={() => openAuth('signup')}>Create account</button>
            <button onClick={() => openAuth('login')}>Log in</button>
            {user && <button onClick={handleLogout}>Sign out</button>}
            <a href="#faq">FAQs</a>
          </div>

          <div className="footer-column footer-safety">
            <h4>Our commitment</h4>
            <span className="footer-safety-badge">
              <ShieldCheck size={14} /> Transparency first
            </span>
            <p>
              Never pay a stranger for guaranteed access to jobs or earnings.
              Verify every opportunity independently.
            </p>
          </div>
        </div>

        <div className="container footer-bottom">
          <span>
            © {new Date().getFullYear()} EarnBridge. All rights reserved.
          </span>
          <span>Created by Ayanfe Innovation Labs Limited</span>
          <span>Earn Small. Grow Together.</span>
        </div>
      </footer>

      {success && !authOpen && (
        <div
          role="status"
          style={{
            position: 'fixed',
            right: 16,
            bottom: 16,
            zIndex: 90,
            maxWidth: 'calc(100% - 32px)',
            padding: 16,
            border: '1px solid #c7ead7',
            borderRadius: 12,
            background: '#effcf4',
            color: '#166534',
            boxShadow: '0 10px 35px #00000012',
            fontSize: 13,
          }}
        >
          {success}
          <button
            onClick={() => setSuccess('')}
            aria-label="Dismiss message"
            style={{
              marginLeft: 12,
              border: 0,
              background: 'transparent',
              color: 'inherit',
              cursor: 'pointer',
            }}
          >
            <X size={15} />
          </button>
        </div>
      )}

      {authOpen && (
        <div
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeAuth();
          }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 200,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 16,
            overflowY: 'auto',
            background: '#1c1039b8',
            backdropFilter: 'blur(5px)',
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="auth-title"
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: 430,
              maxHeight: 'calc(100dvh - 32px)',
              overflowY: 'auto',
              boxSizing: 'border-box',
              padding: '30px 24px',
              border: '1px solid #eee6fa',
              borderRadius: 22,
              background: '#ffffff',
              boxShadow: '0 25px 90px #160a3040',
            }}
          >
            <button
              onClick={closeAuth}
              aria-label="Close authentication form"
              disabled={busy}
              style={{
                position: 'absolute',
                top: 14,
                right: 14,
                display: 'grid',
                width: 36,
                height: 36,
                placeItems: 'center',
                border: '1px solid #eee6fa',
                borderRadius: 10,
                background: '#ffffff',
                color: '#6d28d9',
                cursor: 'pointer',
              }}
            >
              <X size={19} />
            </button>

            <div style={{ textAlign: 'center', padding: '6px 4px 22px' }}>
              <div
                style={{
                  display: 'inline-grid',
                  width: 55,
                  height: 55,
                  placeItems: 'center',
                  marginBottom: 15,
                  borderRadius: 17,
                  background: '#f1eafe',
                  color: '#6d28d9',
                }}
              >
                {authMode === 'signup' ? (
                  <Globe2 size={29} />
                ) : (
                  <LockKeyhole size={28} />
                )}
              </div>

              <h2
                              id="auth-title"
                style={{
                  margin: '0 0 9px',
                  color: '#24163d',
                  fontSize: 26,
                  letterSpacing: '-0.7px',
                }}
              >
                {authMode === 'signup'
                  ? 'Join EarnBridge'
                  : 'Welcome back'}
              </h2>

              <p
                style={{
                  margin: 0,
                  color: '#756b88',
                  fontSize: 13,
                  lineHeight: 1.7,
                }}
              >
                {authMode === 'signup'
                  ? 'Create your free account and take the first step.'
                  : 'Sign in to your EarnBridge account.'}
              </p>
            </div>

            {error && (
              <div
                role="alert"
                style={{
                  marginBottom: 16,
                  padding: 12,
                  border: '1px solid #fecaca',
                  borderRadius: 10,
                  background: '#fef2f2',
                  color: '#991b1b',
                  fontSize: 12,
                  lineHeight: 1.7,
                }}
              >
                {error}
              </div>
            )}

            {success && (
              <div
                role="status"
                style={{
                  marginBottom: 16,
                  padding: 13,
                  border: '1px solid #bbf7d0',
                  borderRadius: 10,
                  background: '#f0fdf4',
                  color: '#166534',
                  fontSize: 12,
                  lineHeight: 1.8,
                }}
              >
                <CheckCircle2
                  size={18}
                  style={{
                    display: 'inline',
                    verticalAlign: 'middle',
                    marginRight: 7,
                  }}
                />
                {success}
              </div>
            )}

            {!success && (
              <form onSubmit={handleAuth}>
                <label
                  htmlFor="earnbridge-email"
                  style={{
                    display: 'block',
                    marginBottom: 7,
                    color: '#33234b',
                    fontSize: 12,
                    fontWeight: 700,
                  }}
                >
                  Email address
                </label>

                <div style={{ position: 'relative', marginBottom: 17 }}>
                  <Mail
                    size={18}
                    style={{
                      position: 'absolute',
                      top: 15,
                      left: 13,
                      color: '#8b7aa5',
                    }}
                  />
                  <input
                    id="earnbridge-email"
                    type="email"
                    autoComplete="email"
                    required
                    maxLength={254}
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="you@example.com"
                    style={{ ...inputStyle, paddingLeft: 41 }}
                  />
                </div>

                <label
                  htmlFor="earnbridge-password"
                  style={{
                    display: 'block',
                    marginBottom: 7,
                    color: '#33234b',
                    fontSize: 12,
                    fontWeight: 700,
                  }}
                >
                  Password
                </label>

                <div style={{ position: 'relative', marginBottom: 10 }}>
                  <LockKeyhole
                    size={18}
                    style={{
                      position: 'absolute',
                      top: 15,
                      left: 13,
                      color: '#8b7aa5',
                    }}
                  />
                  <input
                    id="earnbridge-password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete={
                      authMode === 'signup'
                        ? 'new-password'
                        : 'current-password'
                    }
                    required
                    minLength={8}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="At least 8 characters"
                    style={{
                      ...inputStyle,
                      paddingLeft: 41,
                      paddingRight: 45,
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={
                      showPassword ? 'Hide password' : 'Show password'
                    }
                    style={{
                      position: 'absolute',
                      top: 7,
                      right: 7,
                      display: 'grid',
                      width: 34,
                      height: 34,
                      placeItems: 'center',
                      border: 0,
                      borderRadius: 8,
                      background: 'transparent',
                      color: '#78688e',
                      cursor: 'pointer',
                    }}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                <p
                  style={{
                    margin: '0 0 20px',
                    color: '#82778f',
                    fontSize: 11,
                    lineHeight: 1.7,
                  }}
                >
                  Use at least 8 characters. Never share your password with
                  anyone.
                </p>

                <button type="submit" disabled={busy} style={buttonStyle}>
                  {busy ? (
                    <>
                      <LoaderCircle
                        size={17}
                        style={{
                          display: 'inline',
                          verticalAlign: 'middle',
                          marginRight: 8,
                          animation: 'spin 1s linear infinite',
                        }}
                      />
                      Please wait...
                    </>
                  ) : authMode === 'signup' ? (
                    'Create my account'
                  ) : (
                    'Sign in securely'
                  )}
                </button>
              </form>
            )}

            {success && authMode === 'signup' && (
              <button
                type="button"
                onClick={() => {
                  setAuthMode('login');
                  setError('');
                  setSuccess('');
                  setPassword('');
                }}
                style={buttonStyle}
              >
                Continue to sign in
              </button>
            )}

            <div
              style={{
                marginTop: 22,
                paddingTop: 19,
                borderTop: '1px solid #f0eaf7',
                textAlign: 'center',
                color: '#756b88',
                fontSize: 12,
              }}
            >
              {authMode === 'signup'
                ? 'Already have an account? '
                : "Don't have an account? "}

              <button
                type="button"
                disabled={busy}
                onClick={() => {
                  setAuthMode(authMode === 'signup' ? 'login' : 'signup');
                  setError('');
                  setSuccess('');
                  setPassword('');
                }}
                style={{
                  padding: 0,
                  border: 0,
                  background: 'transparent',
                  color: '#6d28d9',
                  fontSize: 12,
                  fontWeight: 800,
                  cursor: 'pointer',
                }}
              >
                {authMode === 'signup' ? 'Log in' : 'Create account'}
              </button>
            </div>

            <p
              style={{
                margin: '18px 0 0',
                color: '#9186a1',
                fontSize: 10,
                lineHeight: 1.7,
                textAlign: 'center',
              }}
            >
              By creating an account, you understand that earnings are not
              guaranteed and opportunities must be independently verified.
            </p>
          </section>
        </div>
      )}

      {!authReady && (
        <div
          style={{
            position: 'fixed',
            left: 12,
            bottom: 12,
            zIndex: 80,
            padding: '8px 12px',
            border: '1px solid #e9e0f8',
            borderRadius: 10,
            background: '#ffffff',
            color: '#6d28d9',
            fontSize: 11,
          }}
        >
          Checking account session...
        </div>
      )}
    </div>
  );
}

export default App;
