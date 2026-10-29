import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { serviceFormatOptions, servicePlansByFormat } from './ServicePlans.jsx'
import { questionsByProfile, documentTitles, physicalReview } from './AssessmentSchema.js'

// Os dados ficam apenas na memória da aba. Nenhum campo clínico vai para wa.me,
// analytics, localStorage, banco ou servidor.
const empty = {
  name:'', birthDate:'', age:'', phone:'', email:'', profession:'',
  maritalStatus:'', city:'', format:'', plan:''
}
const escapeHTML = (value) => String(value ?? '').replace(/[&<>"']/g, (m) => ({
  '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'
}[m]))
const nonEmpty = (value) => Array.isArray(value)
  ? (value.length ? value.join(', ') : 'Não informado')
  : (String(value ?? '').trim() || 'Não informado')

function QuestionField({ question, value, onChange, invalid = false }) {
  const data = value || {main:'', detail:'', second:'', third:''}
  const isDeferred = data.deferred === true
  const set = (key,v) => onChange(question.n, {...data,[key]:v,deferred:false})
  const defer = () => onChange(question.n, isDeferred ? {} : {deferred:true})
  const isMulti = question.type === 'multi'
  const selected = isMulti && Array.isArray(data.main) ? data.main : []
  const toggle = (option) => {
    const next = option === 'Não'
      ? (selected.includes('Não') ? [] : ['Não'])
      : (selected.includes(option) ? selected.filter(v=>v!==option) : [...selected.filter(v=>v!=='Não'),option])
    onChange(question.n, {...data,main:next,deferred:false})
  }
  return (
    <fieldset id={"assessment-question-" + question.n} className={"assessment__question " + (invalid ? "assessment__question--invalid" : "")}>
      <legend><span className="assessment__qnum">{String(question.n).padStart(2,'0')}</span>{question.title}</legend>
      {question.type === 'text' && (
        <textarea aria-label={'Resposta da pergunta ' + question.n} rows={3} maxLength={1500}
          value={data.main || ''} onChange={e=>set('main',e.target.value)}
          placeholder="Escreva sua resposta (opcional)" />
      )}
      {(question.type==='single' || question.type==='boolean') && (
        <div className="assessment__options">
          {question.options.map(opt=>(
            <label className={'assessment__option ' + (data.main===opt ? 'is-selected':'')} key={opt}>
              <input type="radio" name={'assessment-q'+question.n} value={opt} checked={data.main===opt}
                onChange={()=>set('main',opt)} />
              <span>{opt}</span>
            </label>
          ))}
        </div>
      )}
      {isMulti && (
        <div className="assessment__options">
          {question.options.map(opt=>(
            <label className={'assessment__option ' + (selected.includes(opt)?'is-selected':'')} key={opt}>
              <input type="checkbox" checked={selected.includes(opt)} onChange={()=>toggle(opt)} />
              <span>{opt}</span>
            </label>
          ))}
        </div>
      )}
      {question.type==='pain' && (
        <>
          <label className="assessment__subfield">Local do desconforto e explicação
            <textarea rows={3} maxLength={1000} placeholder="Descreva se desejar" value={data.main||''}
              onChange={e=>set('main',e.target.value)} />
          </label>
          <label className="assessment__subfield">Intensidade de 0 a 10
            <select value={data.second||''} onChange={e=>set('second',e.target.value)}>
              <option value="">Não informada</option>
              {Array.from({length:11},(_,i)=><option key={i} value={String(i)}>{i}</option>)}
            </select>
          </label>
        </>
      )}
      {question.type==='nutritionAndMeals' && (
        <>
          <label className="assessment__subfield">Classificação da alimentação
            <select value={data.main||''} onChange={e=>set('main',e.target.value)}>
              <option value="">Selecione, se desejar</option>
              {question.options.map(x=><option key={x}>{x}</option>)}
            </select>
          </label>
          <label className="assessment__subfield">Quantidade de refeições por dia
            <select value={data.second||''} onChange={e=>set('second',e.target.value)}>
              <option value="">Selecione, se desejar</option>
              {['1–2','3','4','5','6+'].map(x=><option key={x}>{x}</option>)}
            </select>
          </label>
        </>
      )}
      {question.type==='consumption' && (
        <>
          <label className="assessment__subfield">Consumo aproximado de água por dia
            <select value={data.main||''} onChange={e=>set('main',e.target.value)}>
              <option value="">Selecione, se desejar</option>
              {question.options.map(x=><option key={x}>{x}</option>)}
            </select>
          </label>
          <label className="assessment__subfield">Frequência de consumo de álcool
            <select value={data.second||''} onChange={e=>set('second',e.target.value)}>
              <option value="">Selecione, se desejar</option>
              {['Não consumo','Raramente','1x/sem','2–3x/sem','4+x/sem'].map(x=><option key={x}>{x}</option>)}
            </select>
          </label>
          <label className="assessment__subfield">Suplementos, frequência e quantidades
            <textarea rows={2} maxLength={1000} value={data.third||''}
              onChange={e=>set('third',e.target.value)} placeholder="Descreva se desejar" />
          </label>
        </>
      )}
      {question.extra && (
        <label className="assessment__subfield">{question.extra}
          <textarea rows={2} maxLength={1000} value={data.detail||''}
            onChange={e=>set('detail',e.target.value)} placeholder="Complemento (opcional)" />
        </label>
      )}
      <label className="assessment__defer">
        <input type="checkbox" checked={isDeferred} onChange={defer} />
        <span>Prefiro responder esta pergunta em conversa reservada com o Rogério.</span>
      </label>
      {invalid && <p className="assessment__validation" role="alert">Responda ou selecione a opção de conversa reservada.</p>}
      {isDeferred && <p className="assessment__qprivacy">Resposta reservada registrada; esta pergunta não incluirá outros dados no PDF.</p>}
    </fieldset>
  )
}
function QuestionAnswer({question,value}) {
  const data=value || {}
  if (data.deferred) return <div className="assessment__answer"><dt><b>{String(question.n).padStart(2,'0')}.</b> {question.title}</dt><dd>Será respondida em conversa reservada</dd></div>
  const responses=[
    nonEmpty(data.main),
    ...(data.second ? [String(data.second)] : []),
    ...(data.third ? [String(data.third)] : []),
    ...(data.detail?.trim() ? [String(data.detail).trim()] : [])
  ]
  return (
    <div className="assessment__answer">
      <dt><b>{String(question.n).padStart(2,'0')}.</b> {question.title}</dt>
      <dd>{responses.join(' | ')}</dd>
    </div>
  )
}
const escapeWithBreaks = v => escapeHTML(v).replace(/\n/g,'<br>')
function formatAnswer(question,value) {
  const data=value||{}
  if (data.deferred) return '<div class="question"><h3>'+question.n+'. '+escapeHTML(question.title)+'</h3><p>Será respondida em conversa reservada com o profissional.</p></div>'
  const parts=[
    nonEmpty(data.main),
    ...(data.second ? [String(data.second)] : []),
    ...(data.third ? [String(data.third)] : []),
    ...(data.detail?.trim() ? [String(data.detail).trim()] : [])
  ]
  return '<div class="question"><h3>'+question.n+'. '+escapeHTML(question.title)+'</h3><p>'+escapeWithBreaks(parts.join(' | '))+'</p></div>'
}
function newPrintWindow(title,body) {
  const w=window.open('','_blank')
  if(!w) { window.alert('O navegador bloqueou a nova aba. Permita pop-ups para gerar o documento de impressão.');return false }
  const html='<!doctype html><html lang="pt-BR"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">'+
    '<title>'+escapeHTML(title)+'</title><style>'+
    'body{font:14px/1.6 Arial,sans-serif;color:#161616;margin:36px auto;max-width:850px;padding:0 20px}'+
    'header{border-bottom:3px solid #c9a54d;margin-bottom:22px;padding-bottom:13px}h1{font-size:23px;margin:0}'+
    'h2{font-size:16px;background:#f2f2f2;padding:7px 10px;margin:20px 0 12px;break-after:avoid}'+
    'h3{font-size:13px;margin:0 0 6px;break-after:avoid}p{margin:0 0 8px;overflow-wrap:anywhere}'+
    '.question{margin:0 0 13px;break-inside:avoid;padding-bottom:8px;border-bottom:1px solid #e5e5e5}'+
    '.meta{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:18px}'+
    '.meta p{padding:6px 0;border-bottom:1px solid #ddd}.notice{color:#565656;font-size:12px}'+
    '.toolbar{background:#171717;color:white;padding:16px;margin-bottom:22px;border-radius:6px}'+
    '.toolbar button{background:#dfbd6e;border:0;border-radius:4px;padding:10px 20px;font-weight:bold;cursor:pointer}'+
    'table{width:100%;border-collapse:collapse;page-break-inside:auto;margin-bottom:18px}'+
    'th,td{border:1px solid #999;text-align:left;padding:9px}th{background:#eee}tr{break-inside:avoid}'+
    '@media print{body{margin:0;max-width:none;padding:0;font-size:11pt}.toolbar{display:none}h2{break-after:avoid}'+
    '@page{size:A4;margin:17mm}}</style></head><body>'+
    '<div class="toolbar"><button onclick="window.print()">Imprimir / salvar como PDF</button>'+
    '<p>Escolha “Salvar como PDF” na janela de impressão. Depois anexe o arquivo no WhatsApp do Rogério.</p></div>'+
    body+'</body></html>'
  w.document.open();w.document.write(html);w.document.close()
  w.focus()
  return true
}
const table = (label,rows,columns=['Avaliação 1','Avaliação 2','Avaliação 3'])=>
 '<h2>'+escapeHTML(label)+'</h2><table><thead><tr><th>Parâmetro</th>'+
 columns.map(x=>'<th>'+escapeHTML(x)+'</th>').join('')+'</tr></thead><tbody>'+
 rows.map(x=>'<tr><td>'+escapeHTML(x)+'</td>'+columns.map(()=>'<td>&nbsp;</td>').join('')+'</tr>').join('')+
 '</tbody></table>'
function printPhysical() {
  const body='<header><h1>ROGÉRIO DÉO · FICHA DE AVALIAÇÃO FÍSICA</h1><p>Instrumento de registro profissional, separado da anamnese.</p></header>'+
    '<p>Aluno: _______________________________________ Data: ____ / ____ / ______</p>'+
    '<p>Avaliação: □ Inicial &nbsp; □ 2ª &nbsp; □ 3ª &nbsp; □ 4ª &nbsp; □ Outra</p>'+
    table('Parâmetros',physicalReview.metrics)+table('Circunferências (cm)',physicalReview.circumferences)+
    table('Dobras cutâneas / composição corporal (mm)',physicalReview.skinfolds,['A1','A2','A3'])+
    '<h2>Testes / desempenho funcional</h2>'+
    physicalReview.performance.map(x=>'<p>'+escapeHTML(x)+': ____________________________________________________</p>').join('')+
    '<h2>Plano de acompanhamento</h2>'+
    physicalReview.followup.map(x=>'<p>'+escapeHTML(x)+': ____________________________________________________</p>').join('')+
    '<p class="notice">Alterações clínicas, sintomas relevantes ou condições que exijam diagnóstico devem ser encaminhados ao profissional de saúde competente.</p>'+
    '<p>Assinatura do Personal Trainer: _______________________________________</p>'
  newPrintWindow('Ficha de avaliação física - Rogério Déo',body)
}
function printAssessment(profile,identity,answers,sections) {
  const full=sections.map(section=>
    '<section><h2>'+escapeHTML(section.name)+'</h2>'+
    section.questions.map(question=>formatAnswer(question,answers[question.n])).join('')+
    '</section>').join('')
  const fields = [
    ['Nome completo',identity.name],['Data de nascimento',identity.birthDate],
    ['Idade',identity.age],['Telefone',identity.phone],
    ['E-mail',identity.email],['Profissão',identity.profession],
    ['Estado civil',identity.maritalStatus],['Cidade/UF',identity.city],
    ['Modalidade',identity.format],['Plano pretendido',identity.plan]
  ]
  const body='<header><h1>ROGÉRIO DÉO · '+escapeHTML(documentTitles[profile])+'</h1>'+
    '<p>Força · Mobilidade · Longevidade</p></header>'+
    '<h2>Dados de identificação</h2><div class="meta">'+
    fields.map(([k,v])=>'<p><b>'+escapeHTML(k)+':</b> '+escapeHTML(nonEmpty(v))+'</p>').join('')+
    '</div>'+full+
    '<p class="notice">Documento preenchido voluntariamente pelo aluno. As respostas não foram armazenadas pelo site. O envio deve ocorrer por anexo, após conferência do destinatário e consentimento do aluno.</p>'
  return newPrintWindow('Anamnese - Rogério Déo - '+identity.name,body)
}
function Identification({data,onChange,onNext,onBack,phoneValid}) {
  const formFields=[
    ['name','Nome completo','text','name',true],
    ['birthDate','Data de nascimento','date','bday',false],
    ['age','Idade','number','off',false],
    ['phone','Telefone com DDD','tel','tel',true],
    ['email','E-mail','email','email',false],
    ['profession','Profissão','text','organization-title',false],
    ['maritalStatus','Estado civil','text','off',false],
    ['city','Cidade/UF','text','address-level2',false]
  ]
  return (
    <form className="assessment__form" onSubmit={e=>{e.preventDefault();onNext()}}>
      <h3>Dados de identificação</h3>
      <p className="intake__help">Dados do cabeçalho da anamnese original. Nome e WhatsApp são obrigatórios; informações de saúde podem ficar sem resposta.</p>
      <div className="assessment__columns">
        {formFields.map(([key,label,type,auto,required])=>(
          <label className={'assessment__field '+(key==='name'||key==='email'?'assessment__span2':'')} key={key}>
            <span className="assessment__label-title">{label}{required&&' *'}</span>
            <input type={type} autoComplete={auto} required={required} value={data[key]} onChange={e=>onChange(key,e.target.value)}
              min={key==='age'?'18':undefined} max={key==='age'?'110':undefined}
              maxLength={type==='text'?100:type==='tel'?22:undefined}
              placeholder={key==='phone'?'(11) 99999-9999':undefined}/>
          </label>
        ))}
      </div>
      {data.phone && !phoneValid && <p className="assessment__validation">Digite um WhatsApp com DDD válido.</p>}
      <h3>Modalidade de atendimento</h3>
      <label className="assessment__field"><span className="assessment__label-title">Modalidade desejada</span>
        <select value={data.format} onChange={e=>onChange('format',e.target.value)}>
          <option value="">Escolher depois</option>
          {serviceFormatOptions.map(v=><option key={v}>{v}</option>)}
        </select>
      </label>
      {data.format && <label className="assessment__field"><span className="assessment__label-title">Plano desejado</span>
        <select value={data.plan} onChange={e=>onChange('plan',e.target.value)}>
          <option value="">Decidir com o Rogério</option>
          {(servicePlansByFormat[data.format]||[]).map(v=><option key={v}>{v}</option>)}
        </select>
      </label>}
      <div className="intake__actions"><button className="intake__back" type="button" onClick={onBack}>Voltar</button>
        <button className="btn btn--solid" type="submit" disabled={data.name.trim().length<3||!phoneValid}>Avançar</button></div>
    </form>
  )
}
function questionAnswered(value) {
  if (!value) return false
  if (value.deferred === true) return true
  if (Array.isArray(value.main)) return value.main.length > 0
  return [value.main,value.second,value.third,value.detail].some(v => typeof v === 'string' && v.trim().length > 0)
}

export default function InitialAssessment({phone, selectedOffer}) {
  const [profile,setProfile]=useState('')
  const [step,setStep]=useState(0)
  const [identity,setIdentity]=useState(empty)
  const [answers,setAnswers]=useState({})
  const [consent,setConsent]=useState(false)
  const [documentOpened,setDocumentOpened]=useState(false)
  const [confirmedSaved,setConfirmedSaved]=useState(false)
  const [missingQuestions,setMissingQuestions]=useState([])
  const sections=useMemo(()=>questionsByProfile[profile]||[],[profile])
  const total=sections.length+3 // escolha + identificação + cinco seções + conclusão
  const complete=step===total-1
  const phoneValid=identity.phone.replace(/\D/g,'').length>=10&&identity.phone.replace(/\D/g,'').length<=13
  const pickedOffer = selectedOffer?.format || ''
  useEffect(() => {
    if (!selectedOffer) return
    setProfile('')
    setStep(0)
    setIdentity({...empty,format:selectedOffer.format || '',plan:selectedOffer.plan || ''})
    setAnswers({})
    setConsent(false)
    setDocumentOpened(false)
    setConfirmedSaved(false)
    setMissingQuestions([])
  }, [selectedOffer])
  const panelRef = useRef(null)
  const hasChangedStep = useRef(false)

  // Navega diretamente para o cartão do formulário após a nova etapa ser
  // renderizada. Antes o scroll era feito para #anamnese, cujo título e
  // explicações longas ficam acima do formulário (especialmente no celular).
  useLayoutEffect(() => {
    if (!hasChangedStep.current) {
      hasChangedStep.current = true
      return
    }
    const panel = panelRef.current
    if (!panel) return
    const nav = document.querySelector('.nav')
    const navigationHeight = nav?.getBoundingClientRect().height ?? 64
    const desiredTop = panel.getBoundingClientRect().top + window.scrollY - navigationHeight - 16
    window.scrollTo({ top: Math.max(0, desiredTop), behavior: 'auto' })
  }, [step])

  const move=(number)=>{
    setMissingQuestions([])
    setStep(number)
  }
  const changeIdentity=(key,value)=>setIdentity(prev=>({...prev,[key]:value,...(key==='format'?{plan:''}:{})}))
  const changeQuestion=(number,value)=>{
    setAnswers(prev=>({...prev,[number]:value}))
    if (questionAnswered(value)) setMissingQuestions(prev=>prev.filter(n=>n!==number))
    setDocumentOpened(false)
    setConfirmedSaved(false)
  }
  const advanceQuestions = () => {
    const questions = sections[step-2]?.questions || []
    const incomplete = questions.filter(q=>!questionAnswered(answers[q.n])).map(q=>q.n)
    if (incomplete.length) {
      setMissingQuestions(incomplete)
      document.getElementById('assessment-question-'+incomplete[0])?.scrollIntoView({behavior:'smooth',block:'center'})
      return
    }
    move(step+1)
  }
  const prepareDocument = () => {
    if (!consent) return
    const opened = printAssessment(profile,identity,answers,sections)
    if (opened) setDocumentOpened(true)
  }
  const begin=(id)=>{setProfile(id);setIdentity({...empty,format:pickedOffer,plan:selectedOffer?.plan || ''});setAnswers({});setConsent(false);setDocumentOpened(false);setConfirmedSaved(false);move(1)}
  const reset=()=>{setProfile('');setIdentity(empty);setAnswers({});setConsent(false);setDocumentOpened(false);setConfirmedSaved(false);move(0)}
  const phoneLink='https://wa.me/'+phone+'?text='+encodeURIComponent('Olá, Rogério! Concluí a anamnese profissional no seu site e salvei o arquivo PDF. Quero enviar o documento para avaliação antes do treinamento.'+(identity.format?' Minha modalidade de interesse: '+identity.format+'.':''))
  return (
    <section className="sec intake assessment assessment--full" id="anamnese" aria-labelledby="intake-title">
      <div className="wrap intake__layout">
        <div className="intake__intro">
          <p className="intake__kicker">ANAMNESE PROFISSIONAL</p>
          <h2 className="h2" id="intake-title">Seu treinamento começa conhecendo você.</h2>
          <p>Preencha a anamnese original do Rogério, dividida em etapas para facilitar a leitura. No final, gere o documento para salvar como PDF e envie como anexo pelo WhatsApp.</p>
          <div className="intake__info"><span>01 / Escolha masculina ou feminina</span><span>02 / Identificação e modalidade</span><span>03 / Responda às 30 perguntas</span><span>04 / Gere o documento e anexe no WhatsApp</span></div>
          <p className="intake__disclaimer">As questões de saúde são pessoais e podem ser deixadas em branco para conversar com o profissional. O site não armazena respostas nem transmite dados médicos por URL. O envio do PDF é manual, sob seu controle.</p>
          <button type="button" className="assessment__physical" onClick={printPhysical}>Imprimir ficha de avaliação física em branco ↗</button>
          <p className="intake__disclaimer">A ficha de medidas, circunferências, dobras cutâneas e testes é de uso profissional e fica separada da anamnese preenchida pelo aluno.</p>
        </div>
        <div ref={panelRef} className="intake__panel assessment__panel">
          <div className="intake__progress"><span>{step===0?'ESCOLHA O FORMULÁRIO':complete?'REVISÃO E ENVIO':'ETAPA '+step+' DE '+(total-2)}</span>
            <div aria-hidden="true"><i style={{width:(step+1)/total*100+'%'}} /></div>
          </div>
          {step===0 && <div><h3>Escolha sua anamnese</h3>
            <p className="intake__help">Os dois modelos seguem as perguntas e a numeração do documento enviado pelo Rogério.</p>
            <div className="intake__choices">
              <button type="button" className="intake__choice" onClick={()=>begin('masculina')}><span><strong>Anamnese masculina</strong><small>30 perguntas · objetivos, treinamento, saúde e hábitos</small></span><span aria-hidden="true">↗</span></button>
              <button type="button" className="intake__choice" onClick={()=>begin('feminina')}><span><strong>Anamnese feminina</strong><small>30 perguntas · inclui saúde feminina e ciclo menstrual</small></span><span aria-hidden="true">↗</span></button>
            </div>
          </div>}
          {step===1 && <Identification data={identity} onChange={changeIdentity} onBack={()=>move(0)} onNext={()=>move(2)} phoneValid={phoneValid}/>}
          {step>=2 && !complete && sections[step-2] && (
            <form className="assessment__form assessment__questions" onSubmit={e=>{e.preventDefault();move(step+1)}}>
              <span className="assessment__eyebrow">{documentTitles[profile]}</span>
              <h3>{sections[step-2].name}</h3>
              <p className="intake__help">Perguntas {sections[step-2].questions[0].n}–{sections[step-2].questions.at(-1).n} de 30.
                {sections[step-2].sensitive&&' Esta seção inclui dados sensíveis de saúde. Responda somente o que desejar compartilhar.'}
              </p>
              {sections[step-2].questions.map(q=><QuestionField key={q.n} question={q} value={answers[q.n]} onChange={changeQuestion}/>)}
              <div className="intake__actions"><button className="intake__back" type="button" onClick={()=>move(step-1)}>Anterior</button>
                <button className="btn btn--solid" type="submit">{step===total-2?'Revisar':'Continuar'}</button></div>
            </form>
          )}
          {complete && <div className="assessment__final">
            <span className="assessment__eyebrow">{documentTitles[profile]}</span>
            <h3>Confira e gere seu documento</h3>
            <p className="intake__help">Suas 30 perguntas foram reunidas abaixo. É possível voltar e editar antes de gerar o PDF.</p>
            <dl className="assessment__review">
              {Object.entries(identity).map(([key,value])=><div key={key}><dt>{({name:'Nome',birthDate:'Nascimento',age:'Idade',phone:'Telefone',email:'E-mail',profession:'Profissão',maritalStatus:'Estado civil',city:'Cidade',format:'Modalidade',plan:'Plano'})[key]||key}</dt><dd>{nonEmpty(value)}</dd></div>)}
            </dl>
            <div className="assessment__answers">
              {sections.map(section=><section key={section.name}>
                <h4>{section.name}</h4>
                <dl>{section.questions.map(q=><QuestionAnswer question={q} value={answers[q.n]} key={q.n}/>)}</dl>
              </section>)}
            </div>
            <label className="assessment__consent">
              <input type="checkbox" checked={consent} onChange={e=>setConsent(e.target.checked)}/>
              <span>Confirmo que revisei minhas respostas e autorizo a criação local do documento. Entendo que contém informações pessoais e de saúde, que devo conferir o destinatário e que o site não envia nem salva automaticamente os dados.</span>
            </label>
            <button className="btn btn--solid assessment__send" type="button" disabled={!consent}
              onClick={()=>printAssessment(profile,identity,answers,sections)}>Gerar documento e salvar como PDF</button>
            <a className="btn btn--ghost assessment__send" target="_blank" rel="noopener noreferrer" href={phoneLink}>
              Abrir WhatsApp para anexar o PDF ↗
            </a>
            <p className="assessment__footnote">Abra o documento e escolha “Imprimir / salvar como PDF”. No WhatsApp, use o botão de anexar arquivo. O site não consegue anexar nem enviar documentos automaticamente.</p>
            <div className="assessment__footer-actions"><button type="button" className="intake__back" onClick={()=>{setConsent(false);move(total-2)}}>Editar respostas</button>
              <button type="button" className="intake__reset" onClick={reset}>Nova anamnese</button></div>
          </div>}
        </div>
      </div>
    </section>
  )
}
