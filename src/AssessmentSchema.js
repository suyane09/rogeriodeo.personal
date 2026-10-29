// Perguntas transcritas do documento "Anamnese Profissional e Avaliação Física"
// do Prof. Rogério Déo. Cada versão conserva a numeração original (1-30).
const objectives = ['Emagrecimento','Ganho de massa','Força','Condicionamento','Mobilidade','Saúde','Estética','Longevidade','Performance']
const difficulties = ['Tempo','Desmotivação','Dor','Falta de resultados','Trabalho','Viagens','Falta de orientação','Disciplina','Outro']
const yesNo = ['Não','Sim']
const nutrition = ['Muito boa','Boa','Regular','Ruim','Muito ruim']
const water = ['Menos de 1 L','1–1,5 L','1,5–2 L','2–3 L','Mais de 3 L','Não sei']
const drinks = ['Não consumo','Raramente','1x/sem','2–3x/sem','4+x/sem']
const quality = ['Muito bom','Bom','Regular','Ruim','Muito ruim']

const q = (n,title,type='text',options=[],extra='') => ({n,title,type,options,extra})
export const commonObjectives = [
 q(1,'Qual é seu principal objetivo com o acompanhamento?','multi',objectives,'Outros objetivos ou detalhes'),
 q(2,'O que você gostaria de mudar ou melhorar no seu corpo atualmente?'),
 q(3,'Existe alguma região que gostaria especialmente de desenvolver, fortalecer ou modificar?'),
 q(4,'Por que decidiu começar ou retomar o treinamento neste momento?'),
 q(5,'O que mais incomoda hoje em relação à sua condição física?')
]
export const commonTraining = [
 q(6,'Pratica atualmente algum exercício físico? Qual e com que frequência?','boolean',yesNo,'Qual e com que frequência?'),
 q(7,'Já praticou musculação/treinamento resistido? Por quanto tempo?'),
 q(8,'Já treinou com Personal Trainer? Como foi a experiência?','boolean',yesNo,'Como foi a experiência?'),
 q(9,'Quais foram as principais dificuldades para manter uma rotina?','multi',difficulties,'Descreva outras dificuldades, se desejar'),
 q(10,'Quantos dias por semana consegue REALMENTE dedicar ao treinamento?','single',['1','2','3','4','5 ou mais'])
]
export const commonHealth = [
 q(11,'Possui ou já possuiu alguma doença ou condição de saúde relevante?','boolean',yesNo,'Especificações, se desejar'),
 q(12,'Histórico de hipertensão, diabetes, colesterol elevado, problemas cardíacos ou alterações metabólicas?','boolean',yesNo,'Especificações, se desejar'),
 q(13,'Durante esforço já apresentou dor no peito, falta de ar incomum, tontura, desmaio ou palpitações?','boolean',yesNo,'Especificações, se desejar'),
 q(14,'Possui atualmente alguma dor ou desconforto? Local e intensidade de 0 a 10.','pain',[],'Local e observações'),
 q(15,'Possui lesão antiga que ainda interfere em movimentos ou treinamento?','boolean',yesNo,'Especificações, se desejar'),
 q(16,'Já passou por cirurgia? Qual e quando?','boolean',yesNo,'Qual e quando, se desejar'),
 q(17,'Existe algum movimento/exercício que provoque dor ou desconforto?'),
 q(18,'Faz acompanhamento com médico ou outro profissional da saúde?','boolean',yesNo,'Especificações, se desejar'),
 q(19,'Utiliza medicamentos de forma contínua ou frequente? Quais?','boolean',yesNo,'Especificações, se desejar')
]
const maleHabits = [
 q(20,'Utiliza ou já utilizou testosterona, hormônios, anabolizantes ou outros recursos ergogênicos?','boolean',yesNo,'Especificações, se desejar'),
 q(21,'Como classificaria sua alimentação atualmente?','single',nutrition,'Observações opcionais'),
 q(22,'Quantas refeições costuma fazer por dia?','single',['1–2','3','4','5','6+'],'Observações opcionais'),
 q(23,'Como é sua alimentação durante a semana?','single',['Organizada','Relativamente organizada','Irregular','Muito desorganizada'],'Observações opcionais'),
 q(24,'Com que frequência consome ultraprocessados, doces, frituras ou fast-food?','single',['Raramente','1–2x/sem','3–4x/sem','Quase todos os dias','Diariamente'],'Observações opcionais'),
 q(25,'Aproximadamente quanto de água consome por dia?','single',water,'Observações opcionais'),
 q(26,'Utiliza suplementos alimentares? Quais?','boolean',yesNo,'Quais, se desejar'),
 q(27,'Qual é seu consumo de bebidas alcoólicas? Informe frequência e quantidade aproximada.','single',drinks,'Quantidade aproximada, se desejar'),
 q(28,'Como avalia seu sono? Quantas horas dorme por noite?','single',quality,'Horas de sono por noite'),
 q(29,'Como avalia seu nível de estresse e quais fatores da rotina podem dificultar sua evolução?','single',['Muito baixo','Baixo','Moderado','Alto','Muito alto'],'Fatores da rotina, se desejar'),
 q(30,'O que espera alcançar em 6–12 meses e o que está disposto a fazer para alcançar esse resultado?')
]
const femaleHealth = [
 q(20,'Como está seu ciclo menstrual atualmente?','single',['Regular','Irregular','Não menstruo'],'Observações opcionais'),
 q(21,'Se menstrua, qual a duração aproximada do ciclo?'),
 q(22,'Apresenta sintomas no período menstrual/pré-menstrual que interferem no treino?','multi',['Não','Cólicas','Fadiga','Dor lombar','Dor de cabeça','Inchaço','Humor','Outro'],'Especificações opcionais'),
 q(23,'Utiliza anticoncepcional ou outro método contraceptivo?','boolean',yesNo,'Especificações, se desejar'),
 q(24,'Utiliza ou já utilizou terapia hormonal? Qual/finalidade?','boolean',yesNo,'Qual e finalidade, se desejar'),
 q(25,'Está grávida, esteve grávida recentemente ou está tentando engravidar?','boolean',yesNo,'Especificações, se desejar'),
 q(26,'Está no climatério/perimenopausa, menopausa ou pós-menopausa?','single',['Não','Climatério','Perimenopausa','Menopausa','Pós-menopausa','Não sei'],'Observações opcionais'),
 q(27,'Apresenta sintomas relacionados a essa fase que interferem no treinamento?','multi',['Não','Ondas de calor','Sono','Fadiga','Humor','Energia','Composição corporal','Outro'],'Especificações opcionais')
]
const femaleHabits = [
 q(28,'Como classificaria sua alimentação e quantas refeições costuma fazer por dia?','nutritionAndMeals',nutrition,'Observações opcionais'),
 q(29,'Qual seu consumo de água, álcool e suplementos? Informe frequência/quantidade.','consumption',water,'Quantidade de álcool e suplementos, se desejar'),
 q(30,'Como estão seu sono, estresse e disponibilidade para treinar? O que espera alcançar em 6–12 meses?','text')
]

export const questionsByProfile = {
 masculina: [
  {name:'Objetivos e expectativas',questions:commonObjectives},
  {name:'Histórico de treinamento',questions:commonTraining},
  {name:'Saúde, dores e histórico clínico',sensitive:true,questions:commonHealth},
  {name:'Saúde, alimentação e hidratação',sensitive:true,questions:maleHabits.slice(0,7)},
  {name:'Hábitos, rotina e aderência',questions:maleHabits.slice(7)}
 ],
 feminina: [
  {name:'Objetivos e expectativas',questions:commonObjectives},
  {name:'Histórico de treinamento',questions:commonTraining},
  {name:'Saúde, dores e histórico clínico',sensitive:true,questions:commonHealth},
  {name:'Saúde feminina',sensitive:true,questions:femaleHealth},
  {name:'Alimentação, hidratação e hábitos',sensitive:true,questions:femaleHabits}
 ]
}
export const documentTitles = {masculina:'ANAMNESE PROFISSIONAL — HOMEM',feminina:'ANAMNESE PROFISSIONAL — MULHER'}
export const physicalReview = {
 metrics:['Peso (kg)','Estatura (cm)','IMC','% gordura corporal','Massa gorda (kg)','Massa magra (kg)','Pressão arterial','FC repouso (bpm)'],
 circumferences:['Pescoço','Ombros','Tórax','Cintura','Abdômen','Quadril','Braço direito/esquerdo','Coxa direita/esquerda','Panturrilha direita/esquerda'],
 skinfolds:['Tríceps','Bíceps','Subescapular','Supra-ilíaca','Abdominal','Coxa','Peitoral (quando aplicável)','Soma das dobras'],
 performance:['Mobilidade','Força/resistência muscular','Equilíbrio/estabilidade','Condicionamento cardiorrespiratório','Teste específico / esporte','Observações'],
 followup:['Principais prioridades','Limitações/cuidados identificados','Metas para o próximo ciclo','Data prevista para reavaliação']
}
