import { useEffect, useRef, useState } from 'react'

const PHONE = '5511993269771'
const PHONE_LABEL = '(11) 99326-9771'
const wa = (msg = 'Olá, Rogério! Quero começar a treinar com você.') =>
  `https://wa.me/${PHONE}?text=${encodeURIComponent(msg)}`

/* ---------- hooks ---------- */

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
function Stat({ n, label }) {
  const ref = useRef(null)
  const [seen, setSeen] = useState(false)
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => e.isIntersecting && (setSeen(true), io.disconnect()), { threshold: 0.4 })
    ref.current && io.observe(ref.current)
    return () => io.disconnect()
  }, [])
  const v = useCount(n, seen)
  return (
    <div className="stat" ref={ref}>
      <strong>+{v}</strong>
      <span>{label}</span>
    </div>
  )
}

const Btn = ({ href, children, variant = 'solid', ...p }) => (
  <a className={`btn btn--${variant}`} href={href} {...p}>
    {children}
  </a>
)

/* one masked line of the hero headline */
const Ln = ({ i, className = '', children }) => (
  <span className={`ln ${className}`}>
    <span style={{ '--i': i }}>{children}</span>
  </span>
)

/* ---------- data ---------- */
const marquee = ['Biomecânica', 'Cinesiologia', 'Definição corporal', 'Treino funcional', 'Mobilidade', 'Performance', 'Hipertrofia', 'Emagrecimento']

const problems = [
  { title: 'Articulações pedem cuidado', text: 'Execução errada cobra caro em ombro, joelho e coluna. Cada exercício precisa ser ajustado à sua estrutura.' },
  { title: 'O metabolismo mudou', text: 'Emagrecer e ganhar massa muscular exige treino e rotina planejados para a sua fase, não para a de um atleta de 20 anos.' },
  { title: 'Tempo é curto', text: 'Sua agenda é cheia. Por isso cada sessão tem objetivo claro: nada de treino aleatório ou volume sem propósito.' },
  { title: 'Cada corpo é um', text: 'Ficha de internet ignora seu histórico, suas limitações e seus objetivos. O treino precisa ser desenhado para você.' },
]

const method = [
  { title: 'Conversa e objetivo', text: 'Você conta sua rotina, seu histórico e o que quer alcançar. O plano nasce daí.' },
  { title: 'Treino de hipertrofia', text: 'Estímulo certo para ganhar massa muscular e definição, respeitando seu momento.' },
  { title: 'Foco em emagrecimento', text: 'Condicionamento e gasto energético organizados para você perder gordura mantendo músculo.' },
  { title: 'Correção na hora', text: 'Rogério acompanha de perto, ajusta postura e execução durante o treino. Você aprende o movimento certo.' },
  { title: 'Funcional e mobilidade', text: 'Força, equilíbrio e amplitude de movimento para o dia a dia e para o esporte que você pratica.' },
  { title: 'Evolução contínua', text: 'O treino é ajustado conforme você progride. Constância com direção, sem platô eterno.' },
]

const gallery = [
  { id: 'g1', alt: 'Rogério Déo ajustando a postura de aluno no equipamento' },
  { id: 'g2', alt: 'Rogério Déo orientando aluno durante o exercício' },
  { id: 'g3', alt: 'Rogério Déo acompanhando de perto o treino do aluno' },
  { id: 'g4', alt: 'Rogério Déo concentrado durante a sessão de treino' },
]

const sports = ['Vôlei', 'Surfe', 'Futebol', 'Tênis', 'Corrida', 'Beach tennis', 'E outras modalidades']

const career = [
  [40, 'Anos de prática'],
  [35, 'Anos de profissão'],
  [25, 'Anos na arbitragem'],
]

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
  ['Transformação', '#transformacao'],
  ['Galeria', '#galeria'],
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
        <a href="#inicio" className="nav__logo" onClick={() => setOpen(false)}>Rogério Déo</a>
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
      <figure className="hero__photo">
        <img
          src="img/hero-1333.webp"
          srcSet="img/hero-480.webp 480w, img/hero-800.webp 800w, img/hero-1333.webp 1333w"
          sizes="(max-width: 900px) 100vw, 68vw"
          alt="Rogério Déo, personal trainer, orientando aluno na academia" width="1333" height="1777" fetchpriority="high" decoding="async"
        />
      </figure>
      <div className="wrap hero__body">
        <p className="hero__id">Rogério Déo, personal trainer · CREF 005387/SP</p>
        <h1 className="hero__title">
          <Ln i={0}>Hipertrofia e</Ln>
          <Ln i={1}>emagrecimento</Ln>
          <Ln i={2} className="ln--gold">depois dos 40</Ln>
          <Ln i={3} className="ln--sub">com quem entende do corpo</Ln>
        </h1>
        <div className="hero__row">
          <p className="hero__lead">
            Treino individual baseado em biomecânica e cinesiologia, com mais de 35 anos de profissão. Para homens e mulheres que querem ganhar músculo, definir e se mover melhor, sem lesão e sem treino genérico.
          </p>
          <div className="hero__btns">
            <Btn href={wa()} target="_blank" rel="noopener noreferrer">Quero começar agora</Btn>
            <Btn href="#metodo" variant="ghost">Conhecer o método</Btn>
          </div>
        </div>
      </div>
      <div className="hero__stats">
        <div className="wrap hero__stats-in">
          <Stat n={40} label="Anos de musculação" />
          <Stat n={35} label="Anos como profissional" />
          <Stat n={25} label="Anos árbitro internacional" />
        </div>
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
              <span key={i}>{t}<b /></span>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

function Problem() {
  return (
    <section className="sec problem" id="porque">
      <div className="wrap">
        <h2 className="h2">Ficha pronta não serve para o seu corpo</h2>
        <p className="problem__sub">Aos 40+, o corpo pede estratégia. Não é treinar mais pesado, é treinar certo. O que funcionava aos 25 pode travar seu resultado e ainda machucar.</p>
        <div className="rows">
          {problems.map((p) => (
            <article className="row" key={p.title}>
              <h3>{p.title}</h3>
              <p>{p.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function Method() {
  return (
    <section className="sec method" id="metodo">
      <div className="wrap">
        <div className="method__head">
          <h2 className="h2">Ciência do movimento aplicada ao seu treino</h2>
          <p>Rogério é especialista em biomecânica e cinesiologia. Isso significa entender como cada articulação e cada músculo trabalham, e usar esse conhecimento a seu favor.</p>
        </div>
        <ol className="steps">
          {method.map((m) => (
            <li key={m.title}>
              <h3>{m.title}</h3>
              <p>{m.text}</p>
            </li>
          ))}
        </ol>
        <div className="method__cta">
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
        <figure className="about__photo">
          <div className="clip"><img src="img/arbitro.webp" alt="Rogério Déo, árbitro internacional de fisiculturismo" width="515" height="784" loading="lazy" decoding="async" /></div>
          <figcaption>Árbitro internacional de fisiculturismo</figcaption>
        </figure>
        <div className="about__copy">
          <h2 className="h2">Quem julga físicos pelo mundo olha para o seu</h2>
          <p className="about__text">Rogério Déo vive de musculação desde sempre. Mais de 25 anos como árbitro internacional de fisiculturismo deram a ele um olhar raro para simetria, proporção e qualidade muscular, algo que ele leva para cada aluno.</p>
          <div className="career" role="list" aria-label="Trajetória em anos">
            {career.map(([n, l]) => (
              <div className="career__row" role="listitem" key={l} style={{ '--w': n / 40 }}>
                <div className="career__bar"><b>+{n}</b><span>{l}</span></div>
              </div>
            ))}
          </div>
          <ul className="creds">
            <li><strong>Biomecânica e Cinesiologia · UNIGUAÇU</strong><p>Foco em hipertrofia, emagrecimento, definição e condicionamento para quem tem 40+.</p></li>
            <li><strong>Treinamento Funcional · IHP</strong><p>Desenvolvimento das capacidades físicas e da performance esportiva.</p></li>
          </ul>
        </div>
      </div>
    </section>
  )
}

function VideoCover() {
  const ref = useRef(null)
  const [started, setStarted] = useState(false)
  const play = () => {
    setStarted(true)
    const v = ref.current
    if (v) v.play().catch(() => {})
  }
  return (
    <div className={`vcover ${started ? 'is-playing' : ''}`}>
      <video
        ref={ref}
        controls={started}
        playsInline
        preload="metadata"
        src="img/transformacao.mp4#t=0.1"
        aria-label="Rogério Déo fala sobre treino focado para melhorar seu esporte favorito"
        onPlay={() => setStarted(true)}
      />
      {!started && (
        <button type="button" className="vcover__play" onClick={play} aria-label="Assistir ao vídeo">
          <span><svg viewBox="0 0 24 24" width="30" height="30" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z" /></svg></span>
        </button>
      )}
    </div>
  )
}

function Transformation() {
  const shots = [
    { id: 'transformacao-frente', cap: 'De frente', alt: 'Transformação de Rogério Déo, de frente: antes, durante e depois' },
    { id: 'transformacao-costas', cap: 'De costas', alt: 'Transformação de Rogério Déo, de costas: antes, durante e depois' },
  ]
  return (
    <section className="sec transf" id="transformacao">
      <div className="wrap">
        <h2 className="h2">Antes, durante e depois</h2>
        <p className="transf__sub">A evolução do próprio Rogério, fruto de constância, treino bem executado e disciplina. Veja de frente e de costas.</p>
        <div className="transf__photos">
          {shots.map((g) => (
            <figure key={g.id}>
              <img src={`img/${g.id}.webp`} alt={g.alt} width="1200" height="1200" loading="lazy" decoding="async" />
              <figcaption>{g.cap}</figcaption>
            </figure>
          ))}
        </div>
        <div className="transf__row">
          <figure className="transf__video">
            <VideoCover />
          </figure>
          <div className="transf__copy">
            <p>Rogério explica como o treino focado melhora o seu esporte.</p>
            <Btn href={wa('Olá, Rogério! Vi as transformações no site e quero começar a treinar.')} target="_blank" rel="noopener noreferrer">Quero a minha transformação</Btn>
          </div>
        </div>
      </div>
    </section>
  )
}

function Gallery() {
  return (
    <section className="sec gallery-sec" id="galeria">
      <div className="wrap">
        <h2 className="h2">Do ajuste fino ao último movimento</h2>
        <div className="gallery">
          {gallery.map((g) => (
            <figure key={g.id} className="gallery__item">
              <img
                src={`img/${g.id}-800.webp`}
                srcSet={`img/${g.id}-400.webp 400w, img/${g.id}-800.webp 800w`}
                sizes="(max-width: 700px) 50vw, 560px"
                alt={g.alt} width="800" height="1066" loading="lazy" decoding="async"
              />
            </figure>
          ))}
        </div>
        <div className="sports">
          <div>
            <h3>Mais força e condicionamento na sua modalidade</h3>
            <p>Com treinamento funcional, o treino é direcionado ao que o seu esporte pede.</p>
          </div>
          <ul>
            {sports.map((s) => (<li key={s}>{s}</li>))}
          </ul>
        </div>
      </div>
    </section>
  )
}

function ForYou() {
  return (
    <section className="sec foryou">
      <div className="wrap">
        <h2 className="h2">Esse treino é para você se…</h2>
        <ul className="foryou__list">
          {forYou.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      </div>
    </section>
  )
}

function Faq() {
  const [open, setOpen] = useState(-1)
  return (
    <section className="sec faq-sec" id="faq">
      <div className="wrap faq-sec__grid">
        <div className="faq-sec__head">
          <h2 className="h2">Dúvidas frequentes</h2>
          <p>Não achou o que procurava? Pergunte direto ao Rogério.</p>
          <Btn href={wa('Olá, Rogério! Tenho uma dúvida sobre o treino.')} variant="ghost" target="_blank" rel="noopener noreferrer">Tirar dúvida no WhatsApp</Btn>
        </div>
        <div className="faq">
          {faq.map(([q, a], i) => (
            <div className={`faq__item ${open === i ? 'is-open' : ''}`} key={q}>
              <button id={`faq-b-${i}`} aria-expanded={open === i} aria-controls={`faq-p-${i}`} onClick={() => setOpen(open === i ? -1 : i)}>
                <span>{q}</span><b aria-hidden="true" />
              </button>
              <div className="faq__panel" id={`faq-p-${i}`} role="region" aria-labelledby={`faq-b-${i}`}>
                <div><p>{a}</p></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function FinalCta() {
  return (
    <section className="final" id="contato">
      <div className="wrap">
        <h2 className="final__title">Seu melhor corpo não tem idade</h2>
        <div className="final__row">
          <p>Chame o Rogério no WhatsApp, conte seu objetivo e comece com quem tem mais de 35 anos de estrada.</p>
          <div className="final__btns">
            <Btn href={wa()} variant="dark" target="_blank" rel="noopener noreferrer">Chamar no WhatsApp</Btn>
            <a className="phone" href={`tel:+${PHONE}`}>{PHONE_LABEL}</a>
          </div>
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="footer">
      <div className="wrap footer__in">
        <div>
          <strong>Prof. Rogério Déo</strong>
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
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Marquee />
        <Problem />
        <Method />
        <About />
        <Transformation />
        <Gallery />
        <ForYou />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
      <WhatsFloat />
    </>
  )
}