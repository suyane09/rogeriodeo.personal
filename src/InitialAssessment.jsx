import { useState } from 'react'
import { serviceFormatOptions, servicePlansByFormat } from './ServicePlans.jsx'

const empty = {
  name: '', age: '', phone: '', city: '', goal: '', goalDetail: '',
  experience: '', days: '', format: '', schedule: '', timeframe: '',
  routine: '', focus: '', note: '', individual: '', plan: ''
}

const goals = [
  'Força e saúde',
  'Hipertrofia e definição',
  'Mobilidade e autonomia',
  'Emagrecimento e composição corporal',
  'Performance esportiva',
  'Qualidade de vida e longevidade'
]

const profiles = {
  masculina: {
    title: 'Anamnese masculina',
    description: 'Seu planejamento começa com sua rotina, seus objetivos e a forma como você se movimenta.',
    focusLabel: 'Qual aspecto você quer priorizar?',
    focusOptions: ['Ganho de força e massa muscular', 'Condicionamento e desempenho', 'Mobilidade e recuperação', 'Saúde e qualidade de vida', 'Ainda não sei']
  },
  feminina: {
    title: 'Anamnese feminina',
    description: 'Um acompanhamento que respeita sua rotina, seu momento de vida e seus objetivos.',
    focusLabel: 'Qual aspecto você quer priorizar?',
    focusOptions: ['Força e condicionamento', 'Composição corporal e definição', 'Mobilidade e bem-estar', 'Saúde, autonomia e longevidade', 'Ainda não sei']
  }
}

const options = (list) => list.map((value) => <option value={value} key={value}>{value}</option>)

function Label({ children, hint, required = false }) {
  return <span className="assessment__label-title">{children}{required && <span aria-hidden="true"> *</span>}{hint && <small>{hint}</small>}</span>
}

function SelectField({ id, label, value, onChange, values, required = true }) {
  return (
    <label className="assessment__field" htmlFor={'assessment-' + id}>
      <Label required={required}>{label}</Label>
      <select id={'assessment-' + id} value={value} required={required} onChange={(e) => onChange(id, e.target.value)}>
        <option value="">Selecione uma opção</option>
        {options(values)}
      </select>
    </label>
  )
}

export default function InitialAssessment({ phone }) {
  const [profile, setProfile] = useState('')
  const [step, setStep] = useState(1)
  const [data, setData] = useState(empty)
  const [accepted, setAccepted] = useState(false)
  const config = profiles[profile]
  const setField = (key, value) => setData((current) => ({ ...current, [key]: value, ...(key === 'format' ? { plan: '' } : {}) }))
  const scrollTop = () => {
    const section = document.getElementById('anamnese')
    if (section) section.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
  const next = (stepNumber) => {
    setStep(stepNumber)
    scrollTop()
  }
  const start = (type) => {
    setProfile(type)
    setData(empty)
    setAccepted(false)
    next(2)
  }
  const reset = () => {
    setData(empty)
    setProfile('')
    setAccepted(false)
    next(1)
  }
  const name = data.name.trim().replace(/\s+/g, ' ')
  const telDigits = data.phone.replace(/\D/g, '')
  const normalized = data.phone.replace(/[^\d()+\- ]/g, '').trim()
  const canContact = telDigits.length >= 10 && telDigits.length <= 13
  const canProceed = name.length >= 3 && canContact
  const individual = data.individual === 'Prefiro conversar reservadamente'
    ? 'Prefere conversar reservadamente'
    : 'Sem observações registradas'

  // Só os dados de contato, preferências e planejamento são incluídos no link.
  // Não recolher nem pré-preencher dados clínicos sensíveis em uma URL.
  const message = [
    '*ANAMNESE INICIAL - ROGÉRIO DÉO*',
    'Formulário: ' + (config?.title || ''),
    'Nome: ' + name,
    'Idade: ' + data.age + ' anos',
    'WhatsApp: ' + normalized,
    'Cidade: ' + data.city.trim(),
    '*OBJETIVOS*',
    'Objetivo principal: ' + data.goal,
    'Foco: ' + data.focus,
    ...(data.goalDetail.trim() ? ['Observação sobre objetivo: ' + data.goalDetail.trim()] : []),
    '*ROTINA E TREINAMENTO*',
    'Experiência: ' + data.experience,
    'Disponibilidade semanal: ' + data.days,
    'Modalidade escolhida: ' + data.format,
    'Plano e valor informado: ' + data.plan,
    'Horário preferido: ' + data.schedule,
    'Pretende começar: ' + data.timeframe,
    'Rotina: ' + data.routine,
    'Adaptações individuais: ' + individual,
    ...(data.note.trim() ? ['Observações gerais: ' + data.note.trim()] : []),
    'Gostaria de receber o próximo passo do acompanhamento.'
  ].join('\n')
  const link = 'https://wa.me/' + phone + '?text=' + encodeURIComponent(message)
  const reviewItems = [
    ['Formulário', config?.title],
    ['Nome', name], ['Idade', data.age + ' anos'],
    ['WhatsApp', normalized], ['Cidade', data.city],
    ['Objetivo', data.goal], ['Prioridade', data.focus],
    ['Experiência', data.experience],
    ['Frequência', data.days],
    ['Modalidade', data.format],
    ['Plano e valor', data.plan],
    ['Horário', data.schedule],
    ['Prazo', data.timeframe],
    ['Rotina', data.routine],
    ['Ajustes específicos', individual]
  ]

  return (
    <section className="sec intake assessment" id="anamnese" aria-labelledby="intake-title">
      <div className="wrap intake__layout">
        <div className="intake__intro">
          <p className="intake__kicker">AVALIAÇÃO INICIAL PERSONALIZADA</p>
          <h2 className="h2" id="intake-title">Seu treinamento começa conhecendo você.</h2>
          <p>Responda à anamnese inicial para apresentar seus objetivos e sua rotina. Ao terminar, você poderá revisar as informações e enviá-las ao Rogério pelo WhatsApp.</p>
          <div className="intake__info">
            <span>01 / Escolha a anamnese</span>
            <span>02 / Informe seus dados e objetivos</span>
            <span>03 / Conte sua experiência e rotina</span>
            <span>04 / Revise e envie pelo WhatsApp</span>
          </div>
          <p className="intake__disclaimer">Por privacidade, este formulário não solicita diagnósticos, medicamentos, cirurgias ou histórico clínico detalhado. Questões de saúde que possam afetar seu treino devem ser avaliadas em conversa reservada com o profissional.</p>
        </div>
        <div className="intake__panel assessment__panel">
          <div className="intake__progress">
            <span>ETAPA {step} DE 4</span>
            <div aria-hidden="true"><i style={{ width: step * 25 + '%' }} /></div>
          </div>

          {step === 1 && (
            <div>
              <h3>Qual anamnese deseja preencher?</h3>
              <p className="intake__help">Escolha uma opção. As duas seguem para o mesmo WhatsApp, com identificação do formulário escolhido.</p>
              <div className="intake__choices">
                {Object.entries(profiles).map(([key, item]) => (
                  <button type="button" className="intake__choice" onClick={() => start(key)} key={key}>
                    <span><strong>{item.title}</strong><small>{item.description}</small></span>
                    <span aria-hidden="true">↗</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <span className="assessment__eyebrow">{config.title} · Dados e objetivos</span>
              <h3>Conte um pouco sobre você</h3>
              <p className="intake__help">Campos com * são obrigatórios.</p>
              <form className="assessment__form" onSubmit={(e) => { e.preventDefault(); if (canProceed) next(3) }}>
                <label className="assessment__field" htmlFor="assessment-name">
                  <Label required>Nome completo</Label>
                  <input id="assessment-name" required autoComplete="name" minLength={3} maxLength={80} placeholder="Seu nome completo" value={data.name} onChange={(e) => setField('name', e.target.value)} />
                </label>
                <div className="assessment__columns">
                  <label className="assessment__field" htmlFor="assessment-age">
                    <Label required>Idade</Label>
                    <input id="assessment-age" type="number" inputMode="numeric" min="18" max="100" required placeholder="Ex.: 42" value={data.age} onChange={(e) => setField('age', e.target.value)} />
                  </label>
                  <label className="assessment__field" htmlFor="assessment-phone">
                    <Label required>WhatsApp com DDD</Label>
                    <input id="assessment-phone" type="tel" inputMode="tel" required autoComplete="tel" maxLength={21} placeholder="(11) 99999-9999" value={data.phone} onChange={(e) => setField('phone', e.target.value)} />
                  </label>
                </div>
                {data.phone && !canContact && <p className="assessment__validation" role="status">Informe um número com DDD válido para continuar.</p>}
                <label className="assessment__field" htmlFor="assessment-city">
                  <Label required>Cidade e estado</Label>
                  <input id="assessment-city" required maxLength={65} autoComplete="address-level2" placeholder="Ex.: São Paulo, SP" value={data.city} onChange={(e) => setField('city', e.target.value)} />
                </label>
                <SelectField id="goal" label="Seu principal objetivo" value={data.goal} onChange={setField} values={goals} />
                <SelectField id="focus" label={config.focusLabel} value={data.focus} onChange={setField} values={config.focusOptions} />
                <label className="assessment__field" htmlFor="assessment-goalDetail">
                  <Label>Algo mais sobre seus objetivos? <small>(Opcional)</small></Label>
                  <textarea id="assessment-goalDetail" rows={2} maxLength={160} placeholder="Ex.: quero voltar a treinar com regularidade. Não inclua informações médicas." value={data.goalDetail} onChange={(e) => setField('goalDetail', e.target.value)} />
                </label>
                <div className="intake__actions">
                  <button type="button" className="intake__back" onClick={() => next(1)}>Voltar</button>
                  <button type="submit" className="btn btn--solid" disabled={!canProceed}>Próxima etapa</button>
                </div>
              </form>
            </div>
          )}

          {step === 3 && (
            <div>
              <span className="assessment__eyebrow">{config.title} · Rotina e planejamento</span>
              <h3>Como é seu dia a dia?</h3>
              <p className="intake__help">Essas respostas ajudam o Rogério a entender suas possibilidades de acompanhamento.</p>
              <form className="assessment__form" onSubmit={(e) => { e.preventDefault(); next(4) }}>
                <SelectField id="experience" label="Experiência com musculação ou exercícios" value={data.experience} onChange={setField} values={['Nunca treinei', 'Estou começando ou voltando', 'Até 1 ano', 'Entre 1 e 3 anos', 'Mais de 3 anos']} />
                <SelectField id="days" label="Quantos dias por semana pode treinar?" value={data.days} onChange={setField} values={['1 a 2 dias', '3 dias', '4 dias', '5 ou mais dias', 'Ainda não sei']} />
                <SelectField id="format" label="Qual modalidade de atendimento deseja?" value={data.format} onChange={setField} values={serviceFormatOptions} />
                {data.format && <SelectField id="plan" label="Qual plano gostaria de consultar?" value={data.plan} onChange={setField} values={servicePlansByFormat[data.format] || []} />}
                {data.format === 'Personal trainer presencial' && <p className="assessment__footnote">O valor final depende da frequência semanal e do formato contratado.</p>}
                <SelectField id="schedule" label="Horário de preferência" value={data.schedule} onChange={setField} values={['Manhã', 'Tarde', 'Noite', 'Horários flexíveis']} />
                <SelectField id="timeframe" label="Quando pretende começar?" value={data.timeframe} onChange={setField} values={['O quanto antes', 'Nas próximas semanas', 'No próximo mês', 'Ainda estou me organizando']} />
                <SelectField id="routine" label="Sua rotina de trabalho e movimento" value={data.routine} onChange={setField} values={['Passo grande parte do dia sentado(a)', 'Alterno períodos sentado(a) e em movimento', 'Tenho uma rotina fisicamente ativa', 'Minha rotina varia bastante']} />
                <SelectField id="individual" label="Gostaria de conversar em particular sobre necessidades de adaptação?" value={data.individual} onChange={setField} values={['Não tenho observações a registrar', 'Prefiro conversar reservadamente']} />
                <label className="assessment__field" htmlFor="assessment-note">
                  <Label>Informações sobre sua agenda ou preferências <small>(Opcional)</small></Label>
                  <textarea id="assessment-note" rows={2} maxLength={160} placeholder="Ex.: prefiro treinar antes do trabalho. Não inclua histórico médico." value={data.note} onChange={(e) => setField('note', e.target.value)} />
                </label>
                <div className="intake__actions">
                  <button type="button" className="intake__back" onClick={() => next(2)}>Voltar</button>
                  <button type="submit" className="btn btn--solid">Revisar respostas</button>
                </div>
              </form>
            </div>
          )}

          {step === 4 && (
            <div>
              <span className="assessment__eyebrow">{config.title} · Revisão</span>
              <h3>Confira suas informações</h3>
              <p className="intake__help">A mensagem será preparada para o WhatsApp do Rogério. Você decide se deseja enviá-la ao abrir o aplicativo.</p>
              <dl className="assessment__review">
                {reviewItems.map(([label, value]) => (
                  <div key={label}><dt>{label}</dt><dd>{value}</dd></div>
                ))}
                {data.goalDetail.trim() && <div><dt>Observação de objetivo</dt><dd>{data.goalDetail.trim()}</dd></div>}
                {data.note.trim() && <div><dt>Observações gerais</dt><dd>{data.note.trim()}</dd></div>}
              </dl>
              <label className="assessment__consent">
                <input type="checkbox" checked={accepted} onChange={(e) => setAccepted(e.target.checked)} />
                <span>Concordo em compartilhar os dados acima com Rogério Déo pelo WhatsApp para contato e orientação sobre treinamento. Estou ciente de que o envio depende da minha confirmação no WhatsApp e de que o site não salva estas respostas.</span>
              </label>
              {accepted
                ? <a className="btn btn--solid assessment__send" href={link} target="_blank" rel="noopener noreferrer" aria-label="Abrir WhatsApp com as respostas da anamnese inicial">Abrir WhatsApp com minhas respostas ↗</a>
                : <button className="btn btn--solid assessment__send" type="button" disabled>Confirme para continuar</button>
              }
              <p className="assessment__footnote">Esta é uma anamnese inicial de objetivos e rotina, não uma avaliação médica. Nenhuma mensagem é enviada automaticamente; confirme o destinatário antes de enviar.</p>
              <div className="assessment__footer-actions">
                <button type="button" className="intake__back" onClick={() => { setAccepted(false); next(3) }}>Editar respostas</button>
                <button type="button" className="intake__reset" onClick={reset}>Iniciar outra anamnese</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
