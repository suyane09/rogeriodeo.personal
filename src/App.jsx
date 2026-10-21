import { useEffect, useRef, useState } from 'react'

const PHONE = '5511993269771'
const PHONE_LABEL = '(11) 99326-9771'
const wa = (msg = 'Olá, Rogério! Quero começar a treinar com você.') =>
  `https://wa.me/${PHONE}?text=${encodeURIComponent(msg)}`

/* ---------- hooks ---------- */
function useReveal() {
  useEffect(() => {
    let pending = Array.from(document.querySelectorAll('[data-reveal]:not(.is-in)'))
    let raf = 0
    // Reveal everything that is on screen, above it, or within one viewport height below it.
    // Driven by scroll/touch/resize events AND IntersectionObserver: iOS Safari delays or skips
    // observer callbacks during momentum scrolling, which left content invisible (black gaps).
    const check = () => {
      raf = 0
      const limit = window.innerHeight * 2
      pending = pending.filter((el) => {
        if (el.getBoundingClientRect().top < limit) {
          el.classList.add('is-in')
          return false
        }
        return true
      })
      if (!pending.length) stop()
    }
    const queue = () => { if (!raf) raf = requestAnimationFrame(check) }
    const events = ['scroll', 'touchmove', 'touchend', 'resize', 'orientationchange', 'pageshow', 'load']
    const stop = () => {
      events.forEach((n) => window.removeEventListener(n, queue))
      io.disconnect()
    }
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => (e.isIntersecting || e.boundingClientRect.bottom <= 0) && queue()),
      { threshold: 0, rootMargin: '100% 0px 100% 0px' }
    )
    pending.forEach((el) => io.observe(el))
    events.forEach((n) => window.addEventListener(n, queue, { passive: true }))
    check()
    return () => { stop(); cancelAnimationFrame(raf) }
  }, [])
}

/* hides the floating WhatsApp button while it would sit on top of interactive content (mobile only, see CSS) */
function useFloatHide() {
  const [hide, setHide] = useState(false)
  useEffect(() => {
    const targets = document.querySelectorAll('.faq, #contato, .footer')
    const seen = new Set()
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => (e.isIntersecting ? seen.add(e.target) : seen.delete(e.target)))
        setHide(seen.size > 0)
      },
      { rootMargin: '0px 0px -10% 0px' }
    )
    targets.forEach((t) => io.observe(t))
    return () => io.disconnect()
  }, [])
  return hide
}

function useSpotlight() {
  useEffect(() => {
    if (!window.matchMedia('(hover: hover)').matches) return
    let raf
    const move = (e) => {
      const c = e.target.closest && e.target.closest('.card')
      if (!c) return
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const r = c.getBoundingClientRect()
        c.style.setProperty('--mx', `${e.clientX - r.left}px`)
        c.style.setProperty('--my', `${e.clientY - r.top}px`)
      })
    }
    document.addEventListener('pointermove', move, { passive: true })
    return () => { document.removeEventListener('pointermove', move); cancelAnimationFrame(raf) }
  }, [])
}

/* splits text into masked words for the hero entrance */
function Words({ parts, start = 0, step = 70 }) {
  let i = 0
  return parts.map(([raw, em], k) => {
    // leading punctuation of this part is rendered glued to the previous word
    const text = k && /^[,.;:!?]/.test(raw) ? raw.replace(/^[,.;:!?]+\s*/, '') : raw
    const next = parts[k + 1] && parts[k + 1][0].match(/^[,.;:!?]+/)
    const tail = next ? next[0] : null
    const list = text.trim().split(/\s+/)
    const words = list.map((w, n) => (
      <span className="w" key={`${k}-${i}`}>
        <span style={{ '--i': start + step * i++ }}>
          {w}{tail && n === list.length - 1 ? <span className="pn">{tail}</span> : null}
        </span>
      </span>
    ))
    return (
      <span key={k} className={em ? 'em' : undefined}>
        {words.flatMap((w, n) => (n ? [' ', w] : [w]))}{' '}
      </span>
    )
  })
}

function useCount(target, start) {
  const [v, setV] = useState(0)
  useEffect(() => {
    if (!start) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) return setV(target)
    let raf
    const t0 = performance.now()
    const dur = 1400
    const tick = (t) => {
      const p = Math.min((t - t0) / dur, 1)
      setV(Math.round(target * (1 - Math.pow(1 - p, 3))))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target, start])
  return v
}

/* ---------- small components ---------- */
function Stat({ n, label, big, plusFirst }) {
  const ref = useRef(null)
  const [seen, setSeen] = useState(false)
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => e.isIntersecting && (setSeen(true), io.disconnect()), { threshold: 0.4 })
    ref.current && io.observe(ref.current)
    return () => io.disconnect()
  }, [])
  const v = useCount(n, seen)
  return (
    <div className={`stat ${big ? 'stat--big' : ''}`} ref={ref}>
      <strong>{plusFirst ? `+${v}` : `${v}+`}</strong>
      <span>{label}</span>
    </div>
  )
}

const Btn = ({ href, children, variant = 'solid', ...p }) => (
  <a className={`btn btn--${variant}`} href={href} {...p}>
    <span>{children}</span>
  </a>
)

const Eyebrow = ({ children }) => <p className="eyebrow">{children}</p>

const icons = {
  joint: <><circle cx="12" cy="5" r="1.2" /><path d="M12 2.5v5M9.5 5h5" /><path d="M7 21l3-9h4l3 9M9 15h6" /></>,
  pulse: <path d="M2 12h4l2.5-6 4 12 2.5-6H22" />,
  clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
  lines: <path d="M4 7h16M4 12h10M4 17h6" />,
  check: <><rect x="3.5" y="3.5" width="17" height="17" rx="3" /><path d="M8 12l3 3 5-6" /></>,
  link: <><path d="M5 9l4-4 3 3-4 4z" /><path d="M12 15l4-4 3 3-4 4z" /><path d="M8.5 8.5l7 7" /></>,
  drop: <path d="M12 3s6 6.5 6 11a6 6 0 01-12 0c0-4.5 6-11 6-11z" />,
  user: <><circle cx="12" cy="8" r="3.5" /><path d="M5 21c0-4 3-6.5 7-6.5s7 2.5 7 6.5" /></>,
  trend: <><path d="M3 17l6-6 4 4 8-8" /><path d="M15 7h6v6" /></>,
}
const Icon = ({ name }) => (
  <svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {icons[name]}
  </svg>
)

const Card = ({ icon, title, children, wide, delay = 0 }) => (
  <article className={`card ${wide ? 'card--wide' : ''}`} data-reveal style={{ '--d': `${delay}ms` }}>
    <span className="card__icon"><Icon name={icon} /></span>
    <h3>{title}</h3>
    <p>{children}</p>
  </article>
)

/* ---------- data ---------- */
const marquee = ['Biomecânica', 'Cinesiologia', 'Definição corporal', 'Treino funcional', 'Mobilidade', 'Performance', 'Hipertrofia', 'Emagrecimento']

const problems = [
  { icon: 'joint', title: <>Articulações<br />pedem cuidado</>, text: 'Execução errada cobra caro em ombro, joelho e coluna. Cada exercício precisa ser ajustado à sua estrutura.' },
  { icon: 'pulse', title: 'O metabolismo mudou', text: 'Emagrecer e ganhar massa muscular exige treino e rotina planejados para a sua fase, não para a de um atleta de 20 anos.' },
  { icon: 'clock', title: 'Tempo é curto', text: 'Sua agenda é cheia. Por isso cada sessão tem objetivo claro: nada de treino aleatório ou volume sem propósito.' },
]

const method = [
  { icon: 'check', title: 'Conversa e objetivo', text: 'Você conta sua rotina, seu histórico e o que quer alcançar. O plano nasce daí.' },
  { icon: 'link', title: 'Treino de hipertrofia', text: 'Estímulo certo para ganhar massa muscular e definição, respeitando seu momento.' },
  { icon: 'drop', title: 'Foco em emagrecimento', text: 'Condicionamento e gasto energético organizados para você perder gordura mantendo músculo.' },
  { icon: 'user', title: 'Correção na hora', text: 'Rogério acompanha de perto, ajusta postura e execução durante o treino. Você aprende o movimento certo.' },
  { icon: 'pulse', title: 'Funcional e mobilidade', text: 'Força, equilíbrio e amplitude de movimento para o dia a dia e para o esporte que você pratica.' },
  { icon: 'trend', title: 'Evolução contínua', text: 'O treino é ajustado conforme você progride. Constância com direção, sem platô eterno.' },
]

const gallery = [
  { src: 'img/g1.jpg', alt: 'Rogério Déo ajustando a postura de aluno no equipamento' },
  { src: 'img/g2.jpg', alt: 'Rogério Déo orientando aluno durante o exercício' },
  { src: 'img/g3.jpg', alt: 'Rogério Déo acompanhando de perto o treino do aluno' },
  { src: 'img/g4.jpg', alt: 'Rogério Déo concentrado durante a sessão de treino' },
]

const sports = ['Vôlei', 'Surfe', 'Futebol', 'Tênis', 'Corrida', 'Beach tennis', 'E outras modalidades']

const forYou = [
  'Tem 40 anos ou mais e quer ganhar massa muscular de verdade.',
  'Quer emagrecer e definir sem perder músculo nem se machucar.',
  'Cansou de ficha genérica e quer alguém ao seu lado corrigindo cada movimento.',
  'Pratica um esporte e quer render mais com um corpo forte e móvel.',
  'É homem ou mulher e quer um profissional com experiência de verdade.',
]

const faq = [
  ['Nunca treinei. Posso começar depois dos 40?', 'Pode. O treino é montado para o seu ponto de partida, com progressão gradual e acompanhamento próximo na execução.'],
  ['Tenho dor ou limitação. Consigo treinar?', 'O conhecimento em biomecânica e cinesiologia ajuda a adaptar os exercícios ao seu corpo. Conte sua situação no primeiro contato.'],
  ['Funciona para mulheres também?', 'Sim. O foco em hipertrofia, emagrecimento e definição atende homens e mulheres a partir dos 40.'],
  ['Como funcionam valores e horários?', 'Mande uma mensagem no WhatsApp. O Rogério responde com as opções e encontra o melhor horário para a sua rotina.'],
]

const links = [
  ['Início', '#inicio'],
  ['Método', '#metodo'],
  ['Rogério', '#rogerio'],
  ['Resultados', '#resultados'],
  ['Dúvidas', '#faq'],
]

/* ---------- sections ---------- */
function Nav() {
  const [solid, setSolid] = useState(false)
  const [open, setOpen] = useState(false)
  useEffect(() => {
    const f = () => setSolid(window.scrollY > 40)
    f()
    window.addEventListener('scroll', f, { passive: true })
    return () => window.removeEventListener('scroll', f)
  }, [])
  return (
    <header className={`nav ${solid ? 'nav--solid' : ''} ${open ? 'nav--open' : ''}`}>
      <div className="wrap nav__in">
        <a href="#inicio" className="nav__logo" onClick={() => setOpen(false)}>ROGÉRIO DÉO</a>
        <nav className="nav__links" aria-label="Principal">
          {links.map(([l, h]) => (
            <a key={h} href={h} onClick={() => setOpen(false)}>{l}</a>
          ))}
          <a className="nav__cta" href={wa()} target="_blank" rel="noopener noreferrer">WhatsApp</a>
        </nav>
        <button className="nav__burger" aria-label="Abrir menu" aria-expanded={open} onClick={() => setOpen(!open)}>
          <i /><i /><i />
        </button>
      </div>
    </header>
  )
}

function Hero() {
  return (
    <section className="hero" id="inicio">
      <div className="hero__glow" />
      <div className="wrap hero__grid">
        <div className="hero__copy">
          <p className="eyebrow eyebrow--line anim-up" style={{ '--d': '80ms' }}>Rogério Déo · Personal Trainer · CREF 005387/SP</p>
          <h1 className="display" aria-label="Hipertrofia e emagrecimento depois dos 40, com quem entende do corpo">
            <span aria-hidden="true">
              <Words start={150} parts={[['Hipertrofia e emagrecimento'], ['depois dos 40', true], [', com quem entende do corpo']]} />
            </span>
          </h1>
          <p className="lead anim-up" style={{ '--d': '800ms' }}>
            Treino individual baseado em biomecânica e cinesiologia, com mais de 35 anos de profissão. Para homens e mulheres que querem ganhar músculo, definir e se mover melhor, sem lesão e sem treino genérico.
          </p>
          <div className="hero__btns anim-up" style={{ '--d': '950ms' }}>
            <Btn href={wa()} target="_blank" rel="noopener noreferrer">Quero começar agora</Btn>
            <Btn href="#metodo" variant="ghost">Conhecer o método</Btn>
          </div>
          <div className="hero__stats anim-up" style={{ '--d': '1100ms' }}>
            <Stat n={40} plusFirst label="Anos de musculação" />
            <Stat n={35} plusFirst label="Anos como profissional" />
            <Stat n={25} plusFirst label="Anos árbitro internacional" />
          </div>
        </div>
        <figure className="hero__photo" style={{ '--d': '250ms' }}>
          <div className="frame"><img src="img/hero.jpg" alt="Rogério Déo, personal trainer, na academia" width="1333" height="1777" fetchpriority="high" decoding="async" /></div>
        </figure>
      </div>
    </section>
  )
}

function Marquee() {
  const row = [...marquee, ...marquee]
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee__track">
        {[0, 1].map((k) => (
          <div className="marquee__row" key={k}>
            {row.map((t, i) => (
              <span key={i}>{t}<b>●</b></span>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

function Problem() {
  return (
    <section className="sec" id="porque">
      <div className="wrap">
        <Eyebrow>Por que depois dos 40 é diferente</Eyebrow>
        <h2 className="h2" data-reveal>Treino de ficha pronta <em>não serve</em> para o seu corpo</h2>
        <p className="sub" data-reveal>Aos 40+, o corpo pede estratégia. Não é treinar mais pesado, é treinar certo. O que funcionava aos 25 pode travar seu resultado e ainda machucar.</p>
        <div className="grid3">
          {problems.map((p, i) => (
            <Card key={i} icon={p.icon} title={p.title} delay={i * 120}>{p.text}</Card>
          ))}
        </div>
        <div className="grid1">
          <Card wide icon="lines" title="Cada corpo é um" delay={150}>
            Ficha de internet ignora seu histórico, suas limitações e seus objetivos. O treino precisa ser desenhado para você.
          </Card>
        </div>
      </div>
    </section>
  )
}

function Method() {
  return (
    <section className="sec sec--glow" id="metodo">
      <div className="wrap">
        <Eyebrow>O acompanhamento</Eyebrow>
        <h2 className="h2" data-reveal>Ciência do movimento <em>aplicada ao seu treino</em></h2>
        <p className="sub" data-reveal>Rogério é especialista em biomecânica e cinesiologia. Isso significa entender como cada articulação e cada músculo trabalham, e usar esse conhecimento a seu favor.</p>
        <div className="grid3">
          {method.map((m, i) => (
            <Card key={m.title} icon={m.icon} title={m.title} delay={(i % 3) * 120}>{m.text}</Card>
          ))}
        </div>
        <div className="center" data-reveal>
          <Btn href={wa('Olá, Rogério! Quero saber mais sobre o acompanhamento.')} target="_blank" rel="noopener noreferrer">Falar com o Rogério</Btn>
        </div>
      </div>
    </section>
  )
}

function About() {
  return (
    <section className="sec about" id="rogerio">
      <div className="wrap about__grid">
        <figure className="about__photo" data-reveal>
          <div className="clip"><img src="img/arbitro.jpg" alt="Rogério Déo, árbitro internacional de fisiculturismo" decoding="async" /></div>
          <figcaption>Árbitro internacional de fisiculturismo</figcaption>
        </figure>
        <div className="about__copy">
          <Eyebrow>Quem vai treinar você</Eyebrow>
          <h2 className="h2" data-reveal>Quem julga físicos pelo mundo <em>olha para o seu</em></h2>
          <p className="sub" data-reveal>Rogério Déo vive de musculação desde sempre. Mais de 25 anos como árbitro internacional de fisiculturismo deram a ele um olhar raro para simetria, proporção e qualidade muscular, algo que ele leva para cada aluno.</p>
          <div className="bigstats" data-reveal>
            <Stat big n={40} label="Anos de prática" />
            <Stat big n={35} label="Anos de profissão" />
            <Stat big n={25} label="Anos na arbitragem" />
          </div>
          <ul className="creds" data-reveal>
            <li><strong>Biomecânica e Cinesiologia</strong> · UNIGUAÇU<p>Foco em hipertrofia, emagrecimento, definição e condicionamento para quem tem 40+.</p></li>
            <li><strong>Treinamento Funcional</strong> · IHP<p>Desenvolvimento das capacidades físicas e da performance esportiva.</p></li>
          </ul>
        </div>
      </div>
    </section>
  )
}

function Gallery() {
  return (
    <section className="sec sec--tight" id="treino">
      <div className="wrap">
        <Eyebrow>Treino de perto</Eyebrow>
        <h2 className="h2" data-reveal>Do ajuste fino ao <em>último movimento</em></h2>
        <div className="gallery">
          {gallery.map((g, i) => (
            <figure key={g.src} className="gallery__item" data-reveal style={{ '--d': `${(i % 2) * 140}ms` }}>
              <img src={g.src} alt={g.alt} width="1333" height="1777" decoding="async" />
            </figure>
          ))}
        </div>
        <div className="sports" data-reveal>
          <Eyebrow>Para quem pratica esporte</Eyebrow>
          <h2 className="h2 h2--sm">Mais força e condicionamento <em>na sua modalidade</em></h2>
          <p className="sub">Com treinamento funcional, o treino é direcionado ao que o seu esporte pede.</p>
          <ul className="chips">
            {sports.map((s) => (<li key={s}><span>{s}</span></li>))}
          </ul>
        </div>
      </div>
    </section>
  )
}

function Results() {
  const slots = [
    ['[Depoimento do aluno 1: o que mudou no corpo e na rotina]'],
    ['[Depoimento do aluno 2: antes e depois ou resultado em números]'],
    ['[Depoimento do aluno 3: como se sente treinando com o Rogério]'],
  ]
  return (
    <section className="sec" id="resultados">
      <div className="wrap">
        <Eyebrow>Resultados reais</Eyebrow>
        <h2 className="h2" data-reveal>Alunos que <em>treinam com o Rogério</em></h2>
        <div className="grid3">
          {slots.map(([t], i) => (
            <blockquote className="card card--quote" key={i} data-reveal style={{ '--d': `${i * 120}ms` }}>
              <p>{t}</p>
              <footer>[NOME, IDADE]</footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  )
}

function ForYouFaq() {
  const [open, setOpen] = useState(-1)
  return (
    <section className="sec sec--dark" id="faq">
      <div className="wrap split">
        <div>
          <Eyebrow>Para quem é</Eyebrow>
          <h2 className="h2" data-reveal>Esse treino é <em>para você</em> se…</h2>
          <ul className="checks">
            {forYou.map((t, i) => (
              <li key={i} data-reveal style={{ '--d': `${i * 80}ms` }}><i>✓</i>{t}</li>
            ))}
          </ul>
          <div data-reveal>
            <Btn href={wa()} target="_blank" rel="noopener noreferrer">Quero começar</Btn>
          </div>
        </div>
        <div>
          <Eyebrow>Dúvidas frequentes</Eyebrow>
          <div className="faq">
            {faq.map(([q, a], i) => (
              <div className={`faq__item ${open === i ? 'is-open' : ''}`} key={q} data-reveal style={{ '--d': `${i * 80}ms` }}>
                <button id={`faq-b-${i}`} aria-expanded={open === i} aria-controls={`faq-p-${i}`} onClick={() => setOpen(open === i ? -1 : i)}>
                  <span>{q}</span><b aria-hidden="true">+</b>
                </button>
                <div className="faq__panel" id={`faq-p-${i}`} role="region" aria-labelledby={`faq-b-${i}`}>
                  <div><p>{a}</p></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function FinalCta() {
  return (
    <section className="final" id="contato">
      <div className="final__glow" />
      <div className="wrap final__grid">
        <div>
          <h2 className="display display--md" data-reveal>Seu melhor corpo <em>não tem idade</em></h2>
          <p className="lead" data-reveal>Chame o Rogério no WhatsApp, conte seu objetivo e comece com quem tem mais de 35 anos de estrada.</p>
          <div className="final__btns" data-reveal>
            <Btn href={wa()} target="_blank" rel="noopener noreferrer">Chamar no WhatsApp</Btn>
            <a className="phone" href={`tel:+${PHONE}`}>{PHONE_LABEL}</a>
          </div>
        </div>
        <figure className="final__photo" data-reveal>
          <div className="clip"><img src="img/arbitro.jpg" alt="Rogério Déo de terno, árbitro internacional" decoding="async" /></div>
        </figure>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="footer">
      <div className="wrap footer__in">
        <div>
          <strong>PROF. ROGÉRIO DÉO</strong>
          <p>Personal Trainer · Força, mobilidade e performance humana</p>
        </div>
        <div className="footer__r">
          <p>CREF 005387/SP</p>
          <a href="https://instagram.com/rogeriodeo.personal" target="_blank" rel="noopener noreferrer">@rogeriodeo.personal</a>
        </div>
      </div>
    </footer>
  )
}

function WhatsFloat() {
  const hide = useFloatHide()
  return (
    <a className={`wafloat ${hide ? 'wafloat--hide' : ''}`} tabIndex={hide ? -1 : undefined} href={wa()} target="_blank" rel="noopener noreferrer" aria-label="Chamar no WhatsApp">
      <svg viewBox="0 0 32 32" width="26" height="26" fill="currentColor" aria-hidden="true">
        <path d="M16 3C9 3 3.4 8.6 3.4 15.5c0 2.3.6 4.4 1.7 6.3L3 29l7.4-1.9a12.6 12.6 0 005.6 1.3C23 28.4 28.6 22.8 28.6 15.8 28.6 8.6 23 3 16 3zm0 23.200c-1.800 0-3.600-.5-5.100-1.400l-.4-.2-4.400 1.100 1.200-4.300-.3-.4a10.300 10.300 0 01-1.600-5.500C5.400 9.800 10.100 5.200 16 5.200S26.500 9.800 26.500 15.500 21.800 26.200 16 26.200zm5.700-7.700c-.3-.2-1.900-.9-2.200-1s-.5-.2-.7.200-.8 1-1 1.200-.4.200-.7 0a8.500 8.500 0 01-4.200-3.700c-.3-.6.300-.6.900-1.800.1-.2 0-.4 0-.5l-1-2.300c-.2-.6-.5-.5-.7-.5h-.6a1.200 1.200 0 00-.9.400 3.600 3.600 0 00-1.100 2.700 6.300 6.300 0 001.300 3.300 14.300 14.300 0 005.500 4.900c2 .8 2.800.9 3.800.7a3.200 3.200 0 002.100-1.500 2.600 2.600 0 00.2-1.500c-.1-.1-.3-.2-.6-.4z" />
      </svg>
    </a>
  )
}

export default function App() {
  useReveal()
  useSpotlight()
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Marquee />
        <Problem />
        <Method />
        <About />
        <Gallery />
        <Results />
        <ForYouFaq />
        <FinalCta />
      </main>
      <Footer />
      <WhatsFloat />
    </>
  )
}