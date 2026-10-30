import { useEffect, useRef } from 'react'

/**
 * Modalidades e valores informados diretamente pelo profissional.
 * Todos os botões levam à anamnese digital antes do contato comercial.
 */
export const serviceFormatOptions = [
  'Consultoria 100% online',
  'Acompanhamento híbrido',
  'Personal trainer presencial',
  'Treinamento presencial avulso',
  'Quero orientação para escolher'
]

export const servicePlansByFormat = {
  'Consultoria 100% online': [
    'Mensal — R$ 129,90',
    'Trimestral — R$ 359,90',
    'Semestral — R$ 599,90',
    'Anual — R$ 1.198,90'
  ],
  'Acompanhamento híbrido': [
    'Semanal — R$ 1.200,00/mês',
    'Quinzenal — R$ 700,00/mês'
  ],
  'Personal trainer presencial': [
    'A partir de R$ 2.000,00/mês'
  ],
  'Treinamento presencial avulso': [
    'Sessão individual — R$ 400,00'
  ],
  'Quero orientação para escolher': [
    'Definir com o Rogério'
  ]
}

const plans = [
  {
    number: '01',
    label: '100% online',
    format: 'Consultoria 100% online',
    title: 'Consultoria online',
    description: 'Treinamento individualizado após a anamnese, com programa de exercícios disponível no aplicativo para acompanhar e executar seus treinos.',
    info: 'Treine com orientação, onde estiver.',
    price: 'R$ 129,90',
    suffix: '/ mês',
    items: [
      ['Mensal', 'R$ 129,90'],
      ['Trimestral', 'R$ 359,90'],
      ['Semestral', 'R$ 599,90'],
      ['Anual', 'R$ 1.198,90']
    ],
    includes: ['Anamnese antes do planejamento', 'Programa individualizado de exercícios', 'Treinos disponibilizados por aplicativo'],
    note: 'No plano anual, o investimento médio equivale a aproximadamente R$ 99,90 por mês; o valor total contratado é R$ 1.198,90.'
  },
  {
    number: '02',
    label: 'Presencial + digital',
    format: 'Acompanhamento híbrido',
    title: 'Acompanhamento híbrido',
    description: 'Encontros presenciais combinados com treinos pelo aplicativo e orientação online para os outros dias.',
    info: 'Atenção presencial e autonomia entre as sessões.',
    price: 'R$ 700,00',
    prefix: 'A partir de',
    suffix: '/ mês',
    items: [
      ['Semanal · 1 encontro por semana', 'R$ 1.200,00/mês'],
      ['Quinzenal · 1 encontro a cada 15 dias', 'R$ 700,00/mês']
    ],
    includes: ['Treinamento individualizado no aplicativo', 'Orientação online entre os encontros', 'Acompanhamento nos encontros presenciais']
  },
  {
    number: '03',
    label: 'Treino acompanhado',
    format: 'Personal trainer presencial',
    title: 'Personal trainer presencial',
    description: 'Treinamento com orientação técnica individual, correções na execução e progressão conforme suas necessidades.',
    info: 'Acompanhamento individual durante o treino.',
    price: 'R$ 2.000,00',
    prefix: 'A partir de',
    suffix: '/ mês',
    items: [],
    includes: ['Mínimo de duas sessões presenciais por semana', 'Correção técnica e orientação de exercícios', 'Planejamento e progressão personalizados'],
    note: 'O investimento final varia conforme a frequência semanal e o formato de acompanhamento contratado.'
  },
  {
    number: '04',
    label: 'Atendimento pontual',
    format: 'Treinamento presencial avulso',
    title: 'Treinamento presencial avulso',
    description: 'Uma sessão individual para quem busca orientação profissional pontual, acompanhamento técnico e treinamento personalizado.',
    info: 'Orientação individual quando você precisa.',
    price: 'R$ 400,00',
    suffix: '/ sessão',
    items: [],
    includes: ['Sessão individual presencial', 'Orientação técnica durante os exercícios', 'Treino personalizado para a sessão']
  }
]

function ServiceCard({ plan, onSelect }) {
  return (
    <article className="services__card" aria-labelledby={`service-${plan.number}`}>
      <header className="services__card-top">
        <span className="services__number">{plan.number}</span>
        <span className="services__type">{plan.label}</span>
      </header>
      <div className="services__card-body">
        <div className="services__overview">
          <h3 id={`service-${plan.number}`}>{plan.title}</h3>
          <p className="services__description">{plan.description}</p>
          <p className="services__promise">{plan.info}</p>
          <ul className="services__includes">
            {plan.includes.map(item => <li key={item}>{item}</li>)}
          </ul>
        </div>
        <div className="services__details">
          <div className="services__cost">
            {plan.prefix && <span className="services__price-prefix">{plan.prefix}</span>}
            <div className="services__price"><strong>{plan.price}</strong><span>{plan.suffix}</span></div>
          </div>
          {plan.items.length > 0 && (
            <div className="services__plans" aria-label={'Valores de ' + plan.title}>
              {plan.items.map(([period, price]) => (
                <div key={period}><span>{period}</span><strong>{price}</strong></div>
              ))}
            </div>
          )}
          {plan.note && <p className="services__note">{plan.note}</p>}
          <a className="services__action" href="#anamnese-form" onClick={() => onSelect({format: plan.format, plan: plan.items.length ? '' : servicePlansByFormat[plan.format][0]})} aria-label={'Preencher anamnese para ' + plan.title}>
            <span>Iniciar minha avaliação</span><span className="services__action-arrow" aria-hidden="true">↗</span>
          </a>
        </div>
      </div>
    </article>
  )
}

export default function ServicePlans({ onSelect }) {
  const sectionRef = useRef(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section || typeof IntersectionObserver === 'undefined' ||
        window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const cards = [...section.querySelectorAll('.services__card')]
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        entry.target.classList.add('is-visible')
        observer.unobserve(entry.target)
      }
    }, { threshold: .08, rootMargin: '0px 0px 60px 0px' })

    // Deixa os cards já visíveis totalmente acessíveis, sem animação de atraso.
    for (const card of cards) {
      if (card.getBoundingClientRect().top < window.innerHeight * .95) {
        card.classList.add('is-visible')
      } else {
        observer.observe(card)
      }
    }
    section.classList.add('services--motion')
    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} className="sec services" id="modalidades" aria-labelledby="services-title">
      <div className="wrap">
        <div className="services__intro">
          <div>
            <p className="services__eyebrow">MODALIDADES DE ATENDIMENTO</p>
            <h2 className="h2" id="services-title">Treinamento pensado para sua realidade.</h2>
          </div>
          <p>Treinamento personalizado com foco em hipertrofia, emagrecimento, força, mobilidade, performance e longevidade. Programas desenvolvidos de acordo com seus objetivos, suas necessidades e sua rotina.</p>
        </div>
        <div className="services__grid">
          {plans.map(plan => <ServiceCard key={plan.number} plan={plan} onSelect={onSelect} />)}
        </div>
        <p className="services__footer-note">Para solicitar qualquer plano, é necessário concluir a anamnese antes de seguir para o atendimento. As condições e a disponibilidade serão confirmadas pelo Rogério.</p>
      </div>
    </section>
  )
}
