import { useEffect, useState } from 'react'

const FORM_URL = 'https://forms.gle/tnLQcSz3Y5g224Zh6'

export default function InitialAssessment({ phone, selectedOffer }) {
  const [formOpened, setFormOpened] = useState(false)
  const [confirmed, setConfirmed] = useState(false)

  useEffect(() => {
    // Se o visitante escolher outra modalidade, inicia a etapa novamente.
    setFormOpened(false)
    setConfirmed(false)
  }, [selectedOffer])

  const selectedFormat = selectedOffer?.format || ''
  const selectedPlan = selectedOffer?.plan || ''

  // O Google Forms é externo: não temos acesso ao estado do envio.
  // O próprio visitante confirma que concluiu e enviou o formulário.
  const message = [
    'Olá, Rogério! Preenchi e enviei minha anamnese pelo Google Forms.',
    'Gostaria de conversar sobre o acompanhamento.',
    selectedFormat ? 'Modalidade de interesse: ' + selectedFormat + '.' : '',
    selectedPlan ? 'Plano de interesse: ' + selectedPlan + '.' : ''
  ].filter(Boolean).join('\n')

  const whatsappUrl = 'https://wa.me/' + phone + '?text=' + encodeURIComponent(message)

  return (
    <section className="sec intake intake--simple" id="anamnese" aria-labelledby="intake-title">
      <div className="wrap intake-simple__layout">
        <div className="intake-simple__intro">
          <p className="intake__kicker">SEU PRIMEIRO PASSO</p>
          <h2 className="h2" id="intake-title">Comece pela sua anamnese.</h2>
          <p>Para iniciar o atendimento com o Rogério, preencha e envie o formulário de avaliação. Depois, confirme o envio pelo WhatsApp para conversar sobre o próximo passo.</p>
          <p className="intake-simple__privacy">As respostas são preenchidas no Google Forms. Este site não recebe nem armazena os dados de saúde do formulário.</p>
        </div>

        <div id="anamnese-form" className="intake-simple__card">
          {selectedFormat && (
            <div className="intake-simple__choice">
              <span>Seu interesse</span>
              <strong>{selectedFormat}</strong>
              {selectedPlan && <small>{selectedPlan}</small>}
            </div>
          )}

          <div className="intake-simple__step">
            <span className="intake-simple__number" aria-hidden="true">01</span>
            <div>
              <h3>Preencha o formulário</h3>
              <p>Abra a anamnese no Google Forms e envie suas respostas por lá.</p>
            </div>
          </div>

          <a
            className="btn btn--solid intake-simple__button"
            href={FORM_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => { setFormOpened(true); setConfirmed(false) }}
          >
            Preencher minha anamnese <span aria-hidden="true">↗</span>
          </a>

          <div className="intake-simple__divider" />

          <div className="intake-simple__step">
            <span className="intake-simple__number" aria-hidden="true">02</span>
            <div>
              <h3>Confirme pelo WhatsApp</h3>
              <p>Depois de enviar o formulário, volte a esta página e confirme para liberar a mensagem ao Rogério.</p>
            </div>
          </div>

          <label className="intake-simple__confirm">
            <input
              type="checkbox"
              checked={confirmed}
              disabled={!formOpened}
              onChange={(event) => setConfirmed(event.target.checked)}
            />
            <span>Já preenchi e enviei minha anamnese no Google Forms.</span>
          </label>

          {confirmed && formOpened ? (
            <a
              className="btn btn--solid intake-simple__button"
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Confirmar envio no WhatsApp <span aria-hidden="true">↗</span>
            </a>
          ) : (
            <div className="intake-simple__locked" aria-live="polite">
              <span aria-hidden="true">✓</span>
              {formOpened
                ? 'Marque a confirmação acima após enviar a anamnese.'
                : 'Abra e envie o formulário para continuar.'}
            </div>
          )}

          <p className="intake-simple__note">A mensagem fica pronta no WhatsApp, mas você precisa tocar em Enviar. A confirmação é declarada por você: o site não consegue verificar automaticamente o envio ao Google Forms.</p>
          {confirmed && formOpened && (
            <a className="intake-simple__instagram" href="https://instagram.com/rogeriodeo.personal" target="_blank" rel="noopener noreferrer">
              Conhecer o Instagram do Rogério ↗
            </a>
          )}
        </div>
      </div>
    </section>
  )
}
