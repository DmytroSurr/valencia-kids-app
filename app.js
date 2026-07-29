// Простий курс на 20 тем рівня 1 (словникові уроки)
const course = [
  { id: 'casa1',   order: 1,  level: 1, type: 'vocabulary', title_uk: 'Дім 1 – кімнати' },
  { id: 'casa2',   order: 2,  level: 1, type: 'vocabulary', title_uk: 'Дім 2 – меблі' },
  { id: 'escola1', order: 3,  level: 1, type: 'vocabulary', title_uk: 'Школа 1 – клас' },
  { id: 'escola2', order: 4,  level: 1, type: 'vocabulary', title_uk: 'Школа 2 – приладдя' },
  { id: 'jocs1',   order: 5,  level: 1, type: 'vocabulary', title_uk: 'Іграшки вдома' },
  { id: 'jocs2',   order: 6,  level: 1, type: 'vocabulary', title_uk: 'Ігри на подвірʼї' },
  { id: 'animals1',order: 7,  level: 1, type: 'vocabulary', title_uk: 'Домашні тварини' },
  { id: 'animals2',order: 8,  level: 1, type: 'vocabulary', title_uk: 'Ферма' },
  { id: 'animals3',order: 9,  level: 1, type: 'vocabulary', title_uk: 'Дикі тварини' },
  { id: 'menjar1', order: 10, level: 1, type: 'vocabulary', title_uk: 'Їжа – фрукти' },
  { id: 'menjar2', order: 11, level: 1, type: 'vocabulary', title_uk: 'Їжа – овочі' },
  { id: 'menjar3', order: 12, level: 1, type: 'vocabulary', title_uk: 'Їжа – напої та десерти' },
  { id: 'roba1',   order: 13, level: 1, type: 'vocabulary', title_uk: 'Одяг – щоденний' },
  { id: 'roba2',   order: 14, level: 1, type: 'vocabulary', title_uk: 'Одяг – спорт і погода' },
  { id: 'cos1',    order: 15, level: 1, type: 'vocabulary', title_uk: 'Тіло – основні частини' },
  { id: 'colors1', order: 16, level: 1, type: 'vocabulary', title_uk: 'Кольори' },
  { id: 'formes1', order: 17, level: 1, type: 'vocabulary', title_uk: 'Форми' },
  { id: 'familia1',order: 18, level: 1, type: 'vocabulary', title_uk: 'Родина' },
  { id: 'temps1',  order: 19, level: 1, type: 'vocabulary', title_uk: 'Дні тижня' },
  { id: 'temps2',  order: 20, level: 1, type: 'vocabulary', title_uk: 'Місяці' }
];

// Словники (по 8–10 слів на тему). Для економії місця – базові приклади.
// Ти можеш доповнювати їх далі.
const wordsByTopic = {
  casa1: [
    { va: 'casa', uk: 'дім', phonetic: '[ка́са]', image: null },
    { va: 'porta', uk: 'двері', phonetic: '[по́рта]', image: null },
    { va: 'finestra', uk: 'вікно', phonetic: '[фінéстра]', image: null },
    { va: 'cuina', uk: 'кухня', phonetic: '[ку́йна]', image: null },
    { va: 'menjador', uk: 'їдальня', phonetic: '[менжадóр]', image: null },
    { va: 'bany', uk: 'ванна кімната', phonetic: '[ба́нь]', image: null },
    { va: 'dormitori', uk: 'спальня', phonetic: '[дормітóрі]', image: null },
    { va: 'passadís', uk: 'коридор', phonetic: '[пасаді́с]', image: null }
  ],
  casa2: [
    { va: 'taula', uk: 'стіл', phonetic: '[та́ула]', image: null },
    { va: 'cadira', uk: 'стільчик', phonetic: '[каді́ра]', image: null },
    { va: 'sofà', uk: 'диван', phonetic: '[софá]', image: null },
    { va: 'armari', uk: 'шафа', phonetic: '[армáрі]', image: null },
    { va: 'llit', uk: 'ліжко', phonetic: '[йіт]', image: null },
    { va: 'tauleta', uk: 'тумбочка', phonetic: '[таулéта]', image: null },
    { va: 'estora', uk: 'килим', phonetic: '[естóра]', image: null },
    { va: 'lampada', uk: 'лампа', phonetic: '[ля́мпада]', image: null }
  ],
  escola1: [
    { va: 'aula', uk: 'клас (кімната)', phonetic: '[а́ула]', image: null },
    { va: 'pissarra', uk: 'дошка', phonetic: '[пісáрра]', image: null },
    { va: 'taula', uk: 'парта', phonetic: '[та́ула]', image: null },
    { va: 'cadira', uk: 'стілець', phonetic: '[каді́ра]', image: null },
    { va: 'porta', uk: 'двері', phonetic: '[по́рта]', image: null },
    { va: 'finestra', uk: 'вікно', phonetic: '[фінéстра]', image: null },
    { va: 'professor', uk: 'учитель', phonetic: '[професóр]', image: null },
    { va: 'alumne', uk: 'учень', phonetic: '[алúмне]', image: null }
  ],
  escola2: [
    { va: 'llibre', uk: 'книга', phonetic: '[йібре]', image: null },
    { va: 'llapis', uk: 'олівець', phonetic: '[йáпіс]', image: null },
    { va: 'bolígraf', uk: 'ручка', phonetic: '[болíграф]', image: null },
    { va: 'motxilla', uk: 'рюкзак', phonetic: '[мотчíлла]', image: null },
    { va: 'goma', uk: 'гумка', phonetic: '[гóма]', image: null },
    { va: 'regle', uk: 'лінійка', phonetic: '[рéгле]', image: null },
    { va: 'quadern', uk: 'зошит', phonetic: '[квадéрн]', image: null },
    { va: 'colors', uk: 'фломастери/кольорові', phonetic: '[колóрс]', image: null }
  ],
  jocs1: [
    { va: 'pilota', uk: 'мʼяч', phonetic: '[пілóта]', image: null },
    { va: 'cotxe de joguina', uk: 'іграшкова машинка', phonetic: '[кóче де жогу́йна]', image: null },
    { va: 'nina', uk: 'лялька', phonetic: '[нíна]', image: null },
    { va: 'trencaclosques', uk: 'пазл', phonetic: '[тренкакло́скес]', image: null },
    { va: 'bloc de construcció', uk: 'конструктор', phonetic: null, image: null },
    { va: 'osset de peluix', uk: 'плюшевий ведмедик', phonetic: null, image: null },
    { va: 'joc de taula', uk: 'настільна гра', phonetic: null, image: null },
    { va: 'cartes', uk: 'карти (гра)', phonetic: null, image: null }
  ],
  jocs2: [
    { va: 'amagar-se', uk: 'грати в схованки', phonetic: null, image: null },
    { va: 'pilla-pilla', uk: 'доганялки', phonetic: null, image: null },
    { va: 'saltar', uk: 'стрибати', phonetic: null, image: null },
    { va: 'córrer', uk: 'бігати', phonetic: null, image: null },
    { va: 'llançar la pilota', uk: 'кидати мʼяч', phonetic: null, image: null },
    { va: 'jugar al parc', uk: 'грати в парку', phonetic: null, image: null },
    { va: 'pujar al tobogan', uk: 'лазити на гірку', phonetic: null, image: null },
    { va: 'balancí', uk: 'гойдатися', phonetic: null, image: null }
  ],
  animals1: [
    { va: 'gos', uk: 'собака', phonetic: '[гос]', image: null },
    { va: 'gat', uk: 'кіт', phonetic: '[гат]', image: null },
    { va: 'peix', uk: 'рибка', phonetic: null, image: null },
    { va: 'ocell', uk: 'пташка', phonetic: null, image: null },
    { va: 'hamster', uk: 'хомʼяк', phonetic: null, image: null },
    { va: 'tortuga', uk: 'черепаха', phonetic: null, image: null },
    { va: 'conill', uk: 'кролик', phonetic: null, image: null },
    { va: 'lloro', uk: 'папуга', phonetic: null, image: null }
  ],
  animals2: [
    { va: 'vaca', uk: 'корова', phonetic: null, image: null },
    { va: 'porc', uk: 'свиня', phonetic: null, image: null },
    { va: 'ovella', uk: 'вівця', phonetic: null, image: null },
    { va: 'cavall', uk: 'кінь', phonetic: null, image: null },
    { va: 'gallina', uk: 'курка', phonetic: null, image: null },
    { va: 'ànec', uk: 'качка', phonetic: null, image: null },
    { va: 'gos pastor', uk: 'пастуший пес', phonetic: null, image: null },
    { va: 'conill de granja', uk: 'кролик на фермі', phonetic: null, image: null }
  ],
  animals3: [
    { va: 'lleó', uk: 'лев', phonetic: null, image: null },
    { va: 'tigre', uk: 'тигр', phonetic: null, image: null },
    { va: 'elefant', uk: 'слон', phonetic: null, image: null },
    { va: 'girafa', uk: 'жирафа', phonetic: null, image: null },
    { va: 'ós', uk: 'ведмідь', phonetic: null, image: null },
    { va: 'mona', uk: 'мавпа', phonetic: null, image: null },
    { va: 'zebra', uk: 'зебра', phonetic: null, image: null },
    { va: 'cangur', uk: 'кенгуру', phonetic: null, image: null }
  ],
  menjar1: [
    { va: 'poma', uk: 'яблуко', phonetic: null, image: null },
    { va: 'pera', uk: 'груша', phonetic: null, image: null },
    { va: 'plàtan', uk: 'банан', phonetic: null, image: null },
    { va: 'taronja', uk: 'апельсин', phonetic: null, image: null },
    { va: 'llimona', uk: 'лимон', phonetic: null, image: null },
    { va: 'síndria', uk: 'кавун', phonetic: null, image: null },
    { va: 'meló', uk: 'диня', phonetic: null, image: null },
    { va: 'raïm', uk: 'виноград', phonetic: null, image: null }
  ],
  menjar2: [
    { va: 'tomaca', uk: 'помідор', phonetic: null, image: null },
    { va: 'carbassó', uk: 'кабачок', phonetic: null, image: null },
    { va: 'carxofa', uk: 'артишок', phonetic: null, image: null },
    { va: 'pastanaga', uk: 'морква', phonetic: null, image: null },
    { va: 'enciam', uk: 'салат', phonetic: null, image: null },
    { va: 'patata', uk: 'картопля', phonetic: null, image: null },
    { va: 'ceba', uk: 'цибуля', phonetic: null, image: null },
    { va: 'alls', uk: 'часник', phonetic: null, image: null }
  ],
  menjar3: [
    { va: 'aigua', uk: 'вода', phonetic: null, image: null },
    { va: 'suc', uk: 'сік', phonetic: null, image: null },
    { va: 'llet', uk: 'молоко', phonetic: null, image: null },
    { va: 'xocolata', uk: 'шоколад', phonetic: null, image: null },
    { va: 'gelat', uk: 'морозиво', phonetic: null, image: null },
    { va: 'galeta', uk: 'печиво', phonetic: null, image: null },
    { va: 'pastís', uk: 'торт', phonetic: null, image: null },
    { va: 'iogurt', uk: 'йогурт', phonetic: null, image: null }
  ],
  roba1: [
    { va: 'samarreta', uk: 'футболка', phonetic: null, image: null },
    { va: 'pantalons', uk: 'штани', phonetic: null, image: null },
    { va: 'vestit', uk: 'сукня', phonetic: null, image: null },
    { va: 'calçat', uk: 'взуття', phonetic: null, image: null },
    { va: 'mitjons', uk: 'шкарпетки', phonetic: null, image: null },
    { va: 'jaqueta', uk: 'куртка', phonetic: null, image: null },
    { va: 'abrigo', uk: 'пальто', phonetic: null, image: null },
    { va: 'gorra', uk: 'кепка', phonetic: null, image: null }
  ],
  roba2: [
    { va: 'xandall', uk: 'спортивний костюм', phonetic: null, image: null },
    { va: 'botes', uk: 'чоботи', phonetic: null, image: null },
    { va: 'sandàlies', uk: 'сандалі', phonetic: null, image: null },
    { va: 'bufanda', uk: 'шарф', phonetic: null, image: null },
    { va: 'guants', uk: 'рукавички', phonetic: null, image: null },
    { va: 'barret', uk: 'капелюх', phonetic: null, image: null },
    { va: 'paraigua', uk: 'парасолька', phonetic: null, image: null },
    { va: 'ulleres de sol', uk: 'сонцезахисні окуляри', phonetic: null, image: null }
  ],
  cos1: [
    { va: 'cap', uk: 'голова', phonetic: null, image: null },
    { va: 'cara', uk: 'обличчя', phonetic: null, image: null },
    { va: 'ulls', uk: 'очі', phonetic: null, image: null },
    { va: 'orelles', uk: 'вуха', phonetic: null, image: null },
    { va: 'boca', uk: 'рот', phonetic: null, image: null },
    { va: 'mans', uk: 'руки', phonetic: null, image: null },
    { va: 'peus', uk: 'ноги (ступні)', phonetic: null, image: null },
    { va: 'panxa', uk: 'живіт', phonetic: null, image: null }
  ],
  colors1: [
    { va: 'roig', uk: 'червоний', phonetic: null, image: null },
    { va: 'blau', uk: 'синій', phonetic: null, image: null },
    { va: 'verd', uk: 'зелений', phonetic: null, image: null },
    { va: 'groc', uk: 'жовтий', phonetic: null, image: null },
    { va: 'taronja', uk: 'оранжевий', phonetic: null, image: null },
    { va: 'marró', uk: 'коричневий', phonetic: null, image: null },
    { va: 'negre', uk: 'чорний', phonetic: null, image: null },
    { va: 'blanc', uk: 'білий', phonetic: null, image: null }
  ],
  formes1: [
    { va: 'cercle', uk: 'коло', phonetic: null, image: null },
    { va: 'quadrat', uk: 'квадрат', phonetic: null, image: null },
    { va: 'rectangle', uk: 'прямокутник', phonetic: null, image: null },
    { va: 'triangle', uk: 'трикутник', phonetic: null, image: null },
    { va: 'estrella', uk: 'зірка', phonetic: null, image: null },
    { va: 'cor', uk: 'серце', phonetic: null, image: null },
    { va: 'oval', uk: 'овал', phonetic: null, image: null },
    { va: 'rombe', uk: 'ромб', phonetic: null, image: null }
  ],
  familia1: [
    { va: 'mare', uk: 'мама', phonetic: null, image: null },
    { va: 'pare', uk: 'тато', phonetic: null, image: null },
    { va: 'germà', uk: 'брат', phonetic: null, image: null },
    { va: 'germana', uk: 'сестра', phonetic: null, image: null },
    { va: 'avi', uk: 'дідусь', phonetic: null, image: null },
    { va: 'àvia', uk: 'бабуся', phonetic: null, image: null },
    { va: 'cosí', uk: 'кузен', phonetic: null, image: null },
    { va: 'cosina', uk: 'кузина', phonetic: null, image: null }
  ],
  temps1: [
    { va: 'dilluns', uk: 'понеділок', phonetic: null, image: null },
    { va: 'dimarts', uk: 'вівторок', phonetic: null, image: null },
    { va: 'dimecres', uk: 'середа', phonetic: null, image: null },
    { va: 'dijous', uk: 'четвер', phonetic: null, image: null },
    { va: 'divendres', uk: 'пʼятниця', phonetic: null, image: null },
    { va: 'dissabte', uk: 'субота', phonetic: null, image: null },
    { va: 'diumenge', uk: 'неділя', phonetic: null, image: null }
  ],
  temps2: [
    { va: 'gener', uk: 'січень', phonetic: null, image: null },
    { va: 'febrer', uk: 'лютий', phonetic: null, image: null },
    { va: 'març', uk: 'березень', phonetic: null, image: null },
    { va: 'abril', uk: 'квітень', phonetic: null, image: null },
    { va: 'maig', uk: 'травень', phonetic: null, image: null },
    { va: 'juny', uk: 'червень', phonetic: null, image: null },
    { va: 'juliol', uk: 'липень', phonetic: null, image: null },
    { va: 'agost', uk: 'серпень', phonetic: null, image: null },
    { va: 'setembre', uk: 'вересень', phonetic: null, image: null },
    { va: 'octubre', uk: 'жовтень', phonetic: null, image: null },
    { va: 'novembre', uk: 'листопад', phonetic: null, image: null },
    { va: 'desembre', uk: 'грудень', phonetic: null, image: null }
  ]
};

// --- Стан користувача (localStorage) ---
const STORAGE_KEY = 'valenciaTrainerState';

function loadUserState() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return {
      userId: 'son1',
      totalXp: 0,
      streakDays: 0,
      lastActiveDate: null,
      progress: {},
      weakItems: {},
      lastTopicId: 'casa1'
    };
  }
  try {
    return JSON.parse(raw);
  } catch {
    return {
      userId: 'son1',
      totalXp: 0,
      streakDays: 0,
      lastActiveDate: null,
      progress: {},
      weakItems: {},
      lastTopicId: 'casa1'
    };
  }
}

function saveUserState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

// --- Глобальні змінні урока ---
let userState = loadUserState();
let currentTopicId = userState.lastTopicId || 'casa1';
let currentWords = wordsByTopic[currentTopicId] || [];
let currentIndex = 0;
let mode = 'va-uk'; // 'va-uk' або 'uk-va'
let score = 0;
let attempts = 0;
let streak = 0;
let currentQuestionNumber = 1;
const MAX_QUESTIONS = 10;
let questionAnswered = false;
let isWeakSession = false; // режим повторення складних слів

// --- DOM елементи ---
const topicsListEl = document.getElementById('topics-list');
const questionLabelEl = document.getElementById('question-label');
const questionTextEl = document.getElementById('question-text');
const phoneticEl = document.getElementById('phonetic');
const optionsEl = document.getElementById('options');
const feedbackEl = document.getElementById('feedback');
const imageBoxEl = document.getElementById('image-box');
const scoreEl = document.getElementById('score');
const streakEl = document.getElementById('streak');
const topicPillEl = document.getElementById('topic-pill');
const xpValueEl = document.getElementById('xp-value');
const streakDaysEl = document.getElementById('streak-days');

const speakBtn = document.getElementById('speak-btn');
const nextBtn = document.getElementById('next-btn');
const weakBtn = document.getElementById('weak-btn');
const modeVaUkBtn = document.getElementById('mode-va-uk');
const modeUkVaBtn = document.getElementById('mode-uk-va');

const lessonAreaEl = document.getElementById('lesson-area');
const lessonEndEl = document.getElementById('lesson-end');
const endSummaryEl = document.getElementById('end-summary');
const endExtraEl = document.getElementById('end-extra');
const restartBtn = document.getElementById('restart-btn');
const nextTopicBtn = document.getElementById('next-topic-btn');

// --- Допоміжні функції ---
function shuffle(array) {
  return array
    .map(v => ({ v, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ v }) => v);
}

function pickNewIndex() {
  const idx = Math.floor(Math.random() * currentWords.length);
  currentIndex = idx;
}

function renderTopicsList() {
  topicsListEl.innerHTML = '';
  course.forEach(topic => {
    const div = document.createElement('div');
    div.className = 'topic-item';
    if (topic.id === currentTopicId) {
      div.classList.add('active');
    }
    div.dataset.topicId = topic.id;

    const titleSpan = document.createElement('span');
    titleSpan.className = 'topic-title';
    titleSpan.textContent = `${topic.order}. ${topic.title_uk}`;

    const statusSpan = document.createElement('span');
    statusSpan.className = 'topic-status';
    const prog = userState.progress[topic.id];
    if (!prog) statusSpan.textContent = 'не пройдена';
    else if (prog.bestScore >= 9) statusSpan.textContent = '✅ добре засвоєна';
    else statusSpan.textContent = `пройдена (${prog.bestScore}/10)`;

    div.appendChild(titleSpan);
    div.appendChild(statusSpan);

    div.addEventListener('click', () => {
      changeTopic(topic.id);
    });

    topicsListEl.appendChild(div);
  });
}

function renderQuestion() {
  feedbackEl.textContent = '';
  feedbackEl.className = 'feedback';
  questionAnswered = false;

  const entry = currentWords[currentIndex];
  const topicMeta = course.find(t => t.id === currentTopicId);
  if (topicMeta) {
    topicPillEl.textContent = `Тема: ${topicMeta.title_uk}`;
  }

  if (mode === 'va-uk') {
    questionLabelEl.textContent = 'Вибери переклад українською';
    questionTextEl.textContent = entry.va;
    phoneticEl.textContent = entry.phonetic || '';
    const options = shuffle(currentWords)
      .slice(0, 3)
      .concat(entry)
      .slice(0, 4);
    renderOptions(options, entry.uk, 'uk', entry);
  } else {
    questionLabelEl.textContent = 'Вибери переклад валенсійською';
    questionTextEl.textContent = entry.uk;
    phoneticEl.textContent = '';
    const options = shuffle(currentWords)
      .slice(0, 3)
      .concat(entry)
      .slice(0, 4);
    renderOptions(options, entry.va, 'va', entry);
  }

  renderImage(entry);
  updateProgress();
}

function renderOptions(options, correctValue, field, entry) {
  optionsEl.innerHTML = '';
  const shuffled = shuffle(options);
  shuffled.forEach(opt => {
    const btn = document.createElement('button');
    btn.className = 'option';
    btn.textContent = opt[field];
    btn.dataset.value = opt[field];

    btn.addEventListener('click', () => {
      if (questionAnswered) return;
      questionAnswered = true;
      attempts += 1;

      const allButtons = Array.from(optionsEl.children);

      if (btn.dataset.value === correctValue) {
        score += 1;
        streak += 1;
        btn.classList.add('correct');
        feedbackEl.textContent = 'Супер! Правильно 👍';
        feedbackEl.classList.add('good');
      } else {
        streak = 0;
        btn.classList.add('wrong');

        const correctBtn = allButtons.find(
          b => b.dataset.value === correctValue
        );
        if (correctBtn) {
          correctBtn.classList.add('correct');
        }

        const pairText =
          mode === 'va-uk'
            ? `${entry.va} → ${entry.uk}`
            : `${entry.uk} → ${entry.va}`;
        feedbackEl.textContent = `Нічого, спробуємо ще! Правильно: ${pairText}`;
        feedbackEl.classList.add('bad');

        // Логування помилки для weakItems
        logMistake(entry);
      }

      updateProgress();
      allButtons.forEach(child => {
        child.disabled = true;
      });
    });

    optionsEl.appendChild(btn);
  });
}

function renderImage(entry) {
  imageBoxEl.innerHTML = '';
  if (entry.image) {
    const img = document.createElement('img');
    img.src = entry.image;
    img.alt = entry.va;
    imageBoxEl.appendChild(img);
  } else {
    imageBoxEl.textContent = 'Для цього слова картинка не використовується.';
  }
}

function updateProgress() {
  scoreEl.textContent = `Результат: ${score} / ${attempts}`;
  streakEl.textContent = `Серія: ${streak} • Питання ${currentQuestionNumber} / ${MAX_QUESTIONS}`;
  xpValueEl.textContent = userState.totalXp;
  streakDaysEl.textContent = userState.streakDays;
}

function speakCurrent() {
  if (!('speechSynthesis' in window)) {
    alert('Браузер не підтримує озвучку (SpeechSynthesis).');
    return;
  }
  const entry = currentWords[currentIndex];
  const textToSpeak = mode === 'va-uk' ? entry.va : entry.uk;
  const utterance = new SpeechSynthesisUtterance(textToSpeak);

  const synth = window.speechSynthesis;
  const voices = synth.getVoices();
  let langCode = mode === 'va-uk' ? 'ca-ES' : 'uk-UA';
  const match = voices.find(v => v.lang === langCode) || voices[0];
  if (match) utterance.voice = match;
  utterance.lang = match ? match.lang : langCode;

  synth.cancel();
  synth.speak(utterance);
}

function goToNextQuestion() {
  if (currentQuestionNumber >= MAX_QUESTIONS) {
    showLessonEnd();
    return;
  }
  currentQuestionNumber += 1;
  pickNewIndex();
  renderQuestion();
}

function showLessonEnd() {
  lessonAreaEl.style.display = 'none';
  lessonEndEl.style.display = 'block';

  const ratio = attempts === 0 ? 0 : (score / attempts);
  let extraText = '';

  if (ratio === 1) {
    extraText = 'Вау! Усі відповіді правильні! 🥳';
  } else if (ratio >= 0.7) {
    extraText = 'Дуже добре! Ти вже добре знаєш цю тему 💪';
  } else {
    extraText = 'Ми потренуємося ще трошки й буде супер 🌱';
  }

  const topicMeta = course.find(t => t.id === currentTopicId);
  const topicName = topicMeta ? topicMeta.title_uk : 'ця тема';

  endSummaryEl.textContent = `Ти дав(ла) ${score} правильних відповідей із ${attempts} у темі «${topicName}».`;
  endExtraEl.textContent = extraText;

  // Оновити прогрес і XP
  handleLessonComplete();
  renderTopicsList();

  // Кнопка наступної теми
  const nextTopic = getNextTopic(currentTopicId);
  if (nextTopic) {
    nextTopicBtn.style.display = 'inline-block';
    nextTopicBtn.textContent = `➡️ Наступна тема: ${nextTopic.title_uk}`;
  } else {
    nextTopicBtn.style.display = 'none';
  }
}

function restartLesson() {
  score = 0;
  attempts = 0;
  streak = 0;
  currentQuestionNumber = 1;
  questionAnswered = false;
  isWeakSession = false;
  lessonEndEl.style.display = 'none';
  lessonAreaEl.style.display = 'block';
  currentWords = wordsByTopic[currentTopicId] || [];
  pickNewIndex();
  renderQuestion();
}

function changeTopic(newTopicId) {
  currentTopicId = newTopicId;
  userState.lastTopicId = newTopicId;
  saveUserState(userState);
  currentWords = wordsByTopic[currentTopicId] || [];
  restartLesson();
  renderTopicsList();
}

function getNextTopic(currentId) {
  const current = course.find(t => t.id === currentId);
  if (!current) return null;
  const next = course
    .filter(t => t.order > current.order)
    .sort((a, b) => a.order - b.order)[0];
  return next || null;
}

function handleLessonComplete() {
  const topicProg = userState.progress[currentTopicId] || {
    completedLessons: 0,
    bestScore: 0,
    lastCompleted: null
  };
  topicProg.completedLessons += 1;
  if (score > topicProg.bestScore) {
    topicProg.bestScore = score;
  }
  topicProg.lastCompleted = new Date().toISOString();
  userState.progress[currentTopicId] = topicProg;

  // XP: правильні відповіді + бонус за урок
  const xpEarned = score + 10;
  userState.totalXp += xpEarned;

  // Оновити streakDays (серія днів)
  updateStreakDays();

  saveUserState(userState);
  updateProgress();
}

function updateStreakDays() {
  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  if (!userState.lastActiveDate) {
    userState.lastActiveDate = today;
    userState.streakDays = 1;
    return;
  }
  if (userState.lastActiveDate === today) {
    return;
  }
  const last = new Date(userState.lastActiveDate);
  const curr = new Date(today);
  const diffDays = Math.round((curr - last) / (1000 * 60 * 60 * 24));
  if (diffDays === 1) {
    userState.streakDays += 1;
  } else {
    userState.streakDays = 1;
  }
  userState.lastActiveDate = today;
}

// Логування слабких слів
function logMistake(entry) {
  if (!userState.weakItems[currentTopicId]) {
    userState.weakItems[currentTopicId] = {};
  }
  const key = entry.va; // ключ – валенсійське слово
  const existing = userState.weakItems[currentTopicId][key] || {
    errors: 0,
    lastSeen: null,
    entry
  };
  existing.errors += 1;
  existing.lastSeen = new Date().toISOString();
  userState.weakItems[currentTopicId][key] = existing;
  saveUserState(userState);
}

// Сесія повторення слабких слів
function startWeakSession() {
  const topicWeak = userState.weakItems[currentTopicId] || {};
  const entries = Object.values(topicWeak)
    .sort((a, b) => b.errors - a.errors)
    .slice(0, MAX_QUESTIONS)
    .map(item => item.entry);

  if (!entries.length) {
    feedbackEl.textContent = 'Немає складних слів у цій темі – все супер! 😊';
    feedbackEl.className = 'feedback good';
    return;
  }
  isWeakSession = true;
  currentWords = entries;
  score = 0;
  attempts = 0;
  streak = 0;
  currentQuestionNumber = 1;
  questionAnswered = false;
  lessonEndEl.style.display = 'none';
  lessonAreaEl.style.display = 'block';
  pickNewIndex();
  renderQuestion();
}

// --- Події ---
speakBtn.addEventListener('click', speakCurrent);

nextBtn.addEventListener('click', () => {
  if (!questionAnswered) {
    feedbackEl.textContent = 'Спочатку вибери відповідь 😊';
    feedbackEl.className = 'feedback bad';
    return;
  }
  goToNextQuestion();
});

modeVaUkBtn.addEventListener('click', () => {
  mode = 'va-uk';
  modeVaUkBtn.classList.add('active');
  modeUkVaBtn.classList.remove('active');
  restartLesson();
});

modeUkVaBtn.addEventListener('click', () => {
  mode = 'uk-va';
  modeUkVaBtn.classList.add('active');
  modeVaUkBtn.classList.remove('active');
  restartLesson();
});

weakBtn.addEventListener('click', startWeakSession);

restartBtn.addEventListener('click', restartLesson);

nextTopicBtn.addEventListener('click', () => {
  const next = getNextTopic(currentTopicId);
  if (!next) return;
  changeTopic(next.id);
  lessonEndEl.style.display = 'none';
  lessonAreaEl.style.display = 'block';
});

// --- Ініціалізація ---
renderTopicsList();
pickNewIndex();
renderQuestion();

if (typeof speechSynthesis !== 'undefined') {
  speechSynthesis.onvoiceschanged = () => {};
}
