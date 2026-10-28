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

/* Pause media when the user scrolls away or leaves the browser tab.
   Returning to the video never resumes playback automatically. */
function usePauseOutsideViewport(videoRef, mediaKey = null) {
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.intersectionRatio < 0.3) video.pause()
      },
      { threshold: [0, 0.3] }
    )
    observer.observe(video)

    const pauseWhenHidden = () => {
      if (document.hidden) video.pause()
    }
    document.addEventListener('visibilitychange', pauseWhenHidden)

    return () => {
      observer.disconnect()
      document.removeEventListener('visibilitychange', pauseWhenHidden)
    }
  }, [videoRef, mediaKey])
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

const Btn = ({ href, children, variant = 'solid', className = '', ...p }) => (
  <a className={`btn btn--${variant} ${className}`.trim()} href={href} {...p}>
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
const focusAreas = ['Hipertrofia', 'Emagrecimento', 'Mobilidade', 'Condicionamento']

const problems = [
  { title: 'Articulações pedem cuidado', text: 'Técnica e movimentos ajustados para treinar com segurança.' },
  { title: 'O metabolismo mudou', text: 'Estratégia para ganhar força e evoluir no seu ritmo.' },
  { title: 'Tempo é curto', text: 'Cada treino tem um objetivo. Nada de exercícios aleatórios.' },
  { title: 'Cada corpo é um', text: 'Seu histórico e suas metas orientam cada escolha.' },
]

const method = [
  { title: 'Entender seu objetivo', text: 'Seu histórico, sua rotina e suas metas orientam cada escolha.' },
  { title: 'Treinar com precisão', text: 'Força, hipertrofia e mobilidade com atenção à técnica e à execução.' },
  { title: 'Evoluir com constância', text: 'O acompanhamento se ajusta ao seu progresso, no seu ritmo.' },
]

const gallery = [
  { id: 'g1', alt: 'Rogério Déo ajustando a postura de aluno no equipamento', label: 'Precisão nos movimentos' },
  { id: 'g2', alt: 'Rogério Déo orientando aluno durante o exercício', label: 'Orientação de perto' },
  { id: 'g4', alt: 'Rogério Déo concentrado durante a sessão de treino', label: 'Atenção aos detalhes' },
]

const sports = ['Vôlei', 'Surfe', 'Futebol', 'Tênis', 'Corrida', 'Beach tennis', 'E outras modalidades']

const career = [
  [40, 'Anos de prática'],
  [35, 'Anos de profissão'],
  [25, 'Anos na arbitragem'],
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
            Treinamento individual para ganhar força, melhorar a composição corporal e se movimentar melhor. Técnica, atenção aos detalhes e mais de 35 anos de experiência profissional.
          </p>
          <div className="hero__btns">
            <Btn href={wa()} target="_blank" rel="noopener noreferrer">Quero começar agora</Btn>
            <Btn href="#metodo" variant="ghost">Conhecer o método</Btn>
          </div>
        </div>
      </div>
      <div className="hero__stats">
        <div className="wrap hero__stats-in">
          <Stat n={40} label="anos de musculação" />
          <Stat n={35} label="anos de profissão" />
          <Stat n={25} label="anos de arbitragem" />
        </div>
      </div>
    </section>
  )
}

function FocusAreas() {
  return (
    <section className="focus-strip" aria-label="Áreas de atuação do treinamento">
      <div className="wrap focus-strip__inner">
        <p className="focus-strip__eyebrow">TREINAMENTO COM PROPÓSITO</p>
        <ul className="focus-strip__list">
          {focusAreas.map((area) => <li key={area}>{area}</li>)}
        </ul>
      </div>
    </section>
  )
}

function Problem() {
  return (
    <section className="sec problem" id="porque">
      <div className="wrap">
        <h2 className="h2">Ficha pronta não serve para o seu corpo</h2>
        <p className="problem__sub">Depois dos 40, o treino precisa acompanhar seu corpo, sua rotina e seus objetivos.</p>
        <div className="rows">
          {problems.map((p, i) => (
            <article className="row" key={p.title}>
              <span className="row__number" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
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
          <p>Biomecânica e cinesiologia aplicadas ao seu treino. Sem fórmulas prontas: um caminho pensado para seus objetivos.</p>
        </div>
        <ol className="steps">
          {method.map((m, i) => (
            <li key={m.title}>
              <span className="steps__number" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
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


/* Validate optional clips before showing them. Vercel SPA fallbacks return HTML,
   so a 200 response alone is not sufficient to prove an MP4 exists. */
async function hasVideoFile(src) {
  try {
    const response = await fetch(src, { method: 'HEAD' })
    const type = response.headers.get('content-type') || ''
    return response.ok && (type.startsWith('video/') || type.startsWith('application/octet-stream'))
  } catch {
    return false
  }
}

function pauseOtherVideos(currentVideo) {
  document.querySelectorAll('video').forEach((video) => {
    if (video !== currentVideo && !video.paused) video.pause()
  })
}

const methodVideos = [
  {
    id: 'acompanhamento', title: 'Acompanhamento', label: 'Treino individual',
    src: '/img/rogerio-acompanhamento.mp4', poster: null, liveFrame: true,
    duration: '50s', available: true,
  },
  {
    id: 'postura', title: 'Correção técnica', label: 'Postura e movimento',
    src: '/img/rogerio-correcao-postura.mp4', poster: '/img/rogerio-correcao-postura.webp',
    duration: '58s',
  },
  {
    id: 'execucao', title: 'Execução orientada', label: 'Atenção em cada repetição',
    src: '/img/rogerio-execucao-orientada.mp4', poster: '/img/rogerio-execucao-orientada.webp',
    duration: '52s',
  },
]

function MethodInAction() {
  const videoRef = useRef(null)
  const [activeId, setActiveId] = useState('acompanhamento')
  const [availableIds, setAvailableIds] = useState(['acompanhamento'])
  const [started, setStarted] = useState(false)
  const [videoError, setVideoError] = useState(false)
  usePauseOutsideViewport(videoRef, activeId)

  useEffect(() => {
    let live = true
    Promise.all(methodVideos.filter((v) => !v.available).map(async (v) => ({
      id: v.id,
      available: await hasVideoFile(v.src),
    }))).then((results) => {
      if (live) setAvailableIds(['acompanhamento', ...results.filter((r) => r.available).map((r) => r.id)])
    })
    return () => { live = false }
  }, [])

  const current = methodVideos.find((v) => v.id === activeId) || methodVideos[0]
  const videosAvailable = methodVideos.filter((v) => availableIds.includes(v.id))
  const otherVideos = videosAvailable.filter((v) => v.id !== activeId)

  const selectVideo = (id) => {
    if (id === activeId) return
    videoRef.current?.pause()
    setStarted(false)
    setVideoError(false)
    setActiveId(id)
  }
  const play = () => {
    if (videoRef.current) videoRef.current.play().catch(() => {})
  }

  return (
    <section className="sec method-action" aria-labelledby="method-action-title">
      <div className="wrap method-action__grid">
        <div className="method-action__copy">
          <p className="method-action__label">O MÉTODO NA PRÁTICA</p>
          <h2 className="h2" id="method-action-title">A diferença está em cada movimento.</h2>
          <p>Veja o Rogério acompanhando alunos, corrigindo a execução e aplicando seu conhecimento no treino real.</p>
          <Btn href={wa('Olá, Rogério! Vi seu acompanhamento no site e quero saber como funcionam os treinos.')} target="_blank" rel="noopener noreferrer">Quero treinar com o Rogério</Btn>
        </div>
        <div className="method-action__watch">
          <div className="method-action__watch-heading">
            <span>ASSISTA AGORA</span>
            <strong>{current.title}</strong>
          </div>
          <div className="method-action__media">
            {!videoError ? (
              <>
                <video
                  key={current.id}
                  ref={videoRef}
                  src={current.liveFrame ? `${current.src}#t=0.2` : current.src}
                  poster={current.poster || undefined}
                  playsInline
                  preload={current.liveFrame ? 'metadata' : 'none'}
                  controls={started}
                  onPlay={(e) => { pauseOtherVideos(e.currentTarget); setStarted(true) }}
                  onPause={() => setStarted(false)}
                  onEnded={() => setStarted(false)}
                  onError={() => setVideoError(true)}
                  aria-label={`Vídeo: ${current.title} — Rogério Déo`}
                />
                {!started && (
                  <button className="method-action__play" onClick={play} type="button" aria-label={`Assistir: ${current.title}`}>
                    <span className="method-action__play-icon" aria-hidden="true">▶</span>
                    <span className="method-action__play-caption">{current.title}</span>
                  </button>
                )}
              </>
            ) : (
              <div className="method-action__fallback" role="status">
                <img src="/img/hero-800.webp" alt="Rogério Déo orientando aluno na academia" loading="lazy" />
                <span>Não foi possível carregar este vídeo. Selecione outro abaixo.</span>
              </div>
            )}
          </div>
          {otherVideos.length > 0 && (
            <div className="method-action__playlist">
              <div className="method-action__chooser-heading">
                <span>VEJA TAMBÉM</span>
                <small>{otherVideos.length} {otherVideos.length === 1 ? 'vídeo' : 'vídeos'}</small>
              </div>
              <div className="method-action__chooser" aria-label="Escolher outro vídeo para assistir">
                {otherVideos.map((v) => (
                  <button
                    key={v.id}
                    type="button"
                    className="method-action__choice"
                    onClick={() => selectVideo(v.id)}
                    aria-label={`Assistir ${v.title}`}
                  >
                    <span className="method-action__thumb">
                      {v.liveFrame
                        ? <video src={`${v.src}#t=0.2`} preload="metadata" muted playsInline aria-hidden="true" tabIndex={-1} />
                        : <img src={v.poster} alt="" loading="lazy" />}
                      <span aria-hidden="true">▶</span>
                    </span>
                    <span className="method-action__choice-copy">
                      <strong className="method-action__choice-title">{v.title}</strong>
                      <small>{v.label}</small>
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

function VideoCover({ src = '/img/transformacao.mp4#t=0.1', poster, label = 'Rogério Déo explica como o treino direcionado melhora a prática esportiva' }) {
  const ref = useRef(null)
  usePauseOutsideViewport(ref, src)
  const [started, setStarted] = useState(false)

  const play = () => {
    ref.current?.play().catch(() => {})
  }

  return (
    <div className={`vcover ${started ? 'is-playing' : ''}`}>
      <video
        key={src}
        ref={ref}
        src={src}
        poster={poster || undefined}
        controls={started}
        playsInline
        preload={poster ? 'none' : 'metadata'}
        aria-label={label}
        onPlay={(e) => { pauseOtherVideos(e.currentTarget); setStarted(true) }}
        onPause={() => setStarted(false)}
        onEnded={() => setStarted(false)}
      />
      {!started && (
        <button type="button" className="vcover__play" onClick={play} aria-label="Reproduzir vídeo da transformação">
          <span><svg viewBox="0 0 24 24" width="30" height="30" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z" /></svg></span>
        </button>
      )}
    </div>
  )
}

function Transformation() {
  const [hasInterview, setHasInterview] = useState(false)
  const [selected, setSelected] = useState('entrevista')
  useEffect(() => {
    let live = true
    hasVideoFile('/img/rogerio-entrevista-transformacao.mp4').then((exists) => {
      if (live) setHasInterview(exists)
    })
    return () => { live = false }
  }, [])

  const showingInterview = hasInterview && selected === 'entrevista'
  const currentVideo = showingInterview
    ? {
      src: '/img/rogerio-entrevista-transformacao.mp4',
      poster: '/img/rogerio-entrevista-transformacao.webp',
      label: 'Rogério Déo fala sobre transformação corporal em entrevista',
    }
    : {
      src: '/img/transformacao.mp4#t=0.2',
      poster: null,
      label: 'Rogério Déo comenta o treinamento para esportes',
    }

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
          <div className="transf__video-block">
            <figure className="transf__video">
              <VideoCover key={currentVideo.src} {...currentVideo} />
              <figcaption className="transf__video-caption">{showingInterview ? 'A transformação em entrevista' : 'Treinamento e esporte'}</figcaption>
            </figure>
            {hasInterview && (
              <div className="transf__video-picker">
                <div className="transf__video-picker-head">
                  <strong>2 VÍDEOS DISPONÍVEIS</strong>
                  <span>Escolha qual assistir</span>
                </div>
                <div className="transf__video-tabs" aria-label="Escolha um vídeo">
                  <button type="button" aria-pressed={showingInterview} onClick={() => setSelected('entrevista')} className={showingInterview ? 'is-active' : ''}>
                    <img src="/img/rogerio-entrevista-transformacao.webp" alt="" loading="lazy" />
                    <span className="transf__video-tab-copy">
                      <strong>Entrevista: transformação</strong>
                      <small>Vídeo novo</small>
                    </span>
                    <span className="transf__video-arrow" aria-hidden="true">▶</span>
                  </button>
                  <button type="button" aria-pressed={!showingInterview} onClick={() => setSelected('esporte')} className={!showingInterview ? 'is-active' : ''}>
                    <video src="/img/transformacao.mp4#t=0.2" preload="metadata" muted playsInline aria-hidden="true" tabIndex={-1} />
                    <span className="transf__video-tab-copy">
                      <strong>Treino e esporte</strong>
                      <small>Vídeo anterior</small>
                    </span>
                    <span className="transf__video-arrow" aria-hidden="true">▶</span>
                  </button>
                </div>
              </div>
            )}
          </div>
          <div className="transf__copy">
            <p>{showingInterview ? 'Transformações reais começam com dedicação e orientação.' : 'O conhecimento do corpo também faz diferença na prática esportiva.'}</p>
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
          {gallery.map((g, i) => (
            <figure key={g.id} className="gallery__item">
              <img
                src={`img/${g.id}-800.webp`}
                srcSet={`img/${g.id}-400.webp 400w, img/${g.id}-800.webp 800w`}
                sizes={i === 0 ? '(max-width: 700px) 100vw, 720px' : '(max-width: 700px) 50vw, 460px'}
                alt={g.alt} width="800" height="1066" loading="lazy" decoding="async"
              />
              <figcaption className="gallery__caption">
                <span>{String(i + 1).padStart(2, '0')}</span>
                <span>{g.label}</span>
              </figcaption>
            </figure>
          ))}
        </div>
        <div className="sports">
          <div>
            <h3>Mais força e condicionamento na sua modalidade</h3>
            <p>O treino também pode fortalecer sua performance fora da academia.</p>
          </div>
          <ul>
            {sports.map((s) => (<li key={s}>{s}</li>))}
          </ul>
        </div>
      </div>
    </section>
  )
}

const featured = {
  text: [
    'Personal Déo foi fundamental durante o período de radioterapia para o meu tratamento de câncer de mama. Seus treinos intensos reduziram efeitos colaterais como a fadiga, trazendo mais qualidade de vida e manutenção da massa muscular! Técnica exemplar, seriedade, competência, cuidado e olhar atento aos mínimos detalhes em cada execução dos exercícios, evitando lesões.',
    'Gratidão ao Dr. Barakat pela indicação do Déo, que, com seu olhar técnico, atento aos detalhes e com o planejamento dos treinos, contribuiu para o meu tratamento e cura.',
  ],
  name: 'Dra. Heloisa',
  time: '1 ano de treino',
}

const testimonials = [
  ['Seu trabalho dá um resultado incrível! Claro que cabe ao aluno se dedicar, mas, se bem executado com rotina, o resultado ajuda demais a autoestima.', 'João', '2 anos de treino'],
  ['Bons resultados. Profissional com bastante conhecimento.', 'Sr. Antônio José', '+8 anos de treino'],
  ['Mudança de hábitos, correção de postura, mudou meu modo de pensar sobre musculação.', 'Renato Pitta', '+10 anos de treino'],
]

function Results() {
  const [expanded, setExpanded] = useState(false)
  return (
    <section className="sec results" id="resultados">
      <div className="wrap">
        <h2 className="h2">Quem treina com o Rogério fala</h2>
        <blockquote className="quote quote--feature">
          <div className={`quote__text ${expanded ? '' : 'quote__text--collapsed'}`} id="featured-review">
            {featured.text.map((t) => (<p key={t}>{t}</p>))}
          </div>
          <button className="quote__more" type="button" aria-controls="featured-review" aria-expanded={expanded} onClick={() => setExpanded(!expanded)}>
            {expanded ? 'Mostrar menos' : 'Ler depoimento completo'}
            <span aria-hidden="true">{expanded ? '−' : '+'}</span>
          </button>
          <footer><strong>{featured.name}</strong><span>{featured.time}</span></footer>
        </blockquote>
        <div className="quotes">
          {testimonials.map(([t, name, time]) => (
            <blockquote className="quote" key={name}>
              <p className="quote__text">{t}</p>
              <footer><strong>{name}</strong><span>{time}</span></footer>
            </blockquote>
          ))}
        </div>
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
      <div className="wrap final__grid">
        <div className="final__copy">
          <p className="final__eyebrow">SEU PRÓXIMO PASSO</p>
          <h2 className="final__title">Seu melhor corpo não tem idade</h2>
          <p className="final__text">Converse com o Rogério sobre seus objetivos, disponibilidade e possibilidades de acompanhamento.</p>
          <div className="final__steps" aria-label="Como começar">
            <span>01 / Conte seu objetivo</span>
            <span>02 / Tire suas dúvidas</span>
            <span>03 / Combine os próximos passos</span>
          </div>
          <div className="final__btns">
            <Btn href={wa()} className="btn--lg" target="_blank" rel="noopener noreferrer">Chamar no WhatsApp</Btn>
            <a className="phone" href={`tel:+${PHONE}`}>{PHONE_LABEL}</a>
          </div>
        </div>
        <figure className="final__photo">
          <img src="/img/g3-800.webp" srcSet="/img/g3-400.webp 400w, /img/g3-800.webp 800w" sizes="(max-width: 960px) 90vw, 440px" alt="Rogério Déo acompanhando aluno durante o treino" width="800" height="1066" loading="lazy" decoding="async" />
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
        <FocusAreas />
        <Problem />
        <Method />
        <MethodInAction />
        <About />
        <Transformation />
        <Gallery />
        <Results />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
      <WhatsFloat />
    </>
  )
}