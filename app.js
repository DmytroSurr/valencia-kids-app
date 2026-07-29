const STORAGE_KEY = 'valenciaTrainerState';
const MAX_QUESTIONS = 10;
const COURSE_URL = 'data/course.json';

const TOPIC_IDS = [
  'casa1','casa2','escola1','escola2','jocs1','jocs2',
  'animals1','animals2','animals3','menjar1','menjar2','menjar3',
  'roba1','roba2','cos1','colors1','formes1','familia1','temps1','temps2',
  'phrases_casa1','phrases_escola1','phrases_likes1'
];

const DEFAULT_STATE = {
  userId: 'son1',
  totalXp: 0,
  streakDays: 0,
  lastActiveDate: null,
  progress: {},
  weakItems: {},
  lastTopicId: 'casa1'
};

let course = [];
let wordsByTopic = {};
let userState = loadUserState();
let currentTopicId = userState.lastTopicId || 'casa1';
let currentWords = [];
let currentIndex = 0;
let mode = 'va-uk';
let score = 0;
let attempts = 0;
let streak = 0;
let currentQuestionNumber = 1;
let questionAnswered = false;
let availableVoices = [];

const $ = id => document.getElementById(id);
const topicsListEl = $('topics-list');
const questionLabelEl = $('question-label');
const questionTextEl = $('question-text');
const phoneticEl = $('phonetic');
const optionsEl = $('options');
const feedbackEl = $('feedback');
const imageBoxEl = $('image-box');
const scoreEl = $('score');
const streakEl = $('streak');
const topicPillEl = $('topic-pill');
const xpValueEl = $('xp-value');
const streakDaysEl = $('streak-days');
const progressFillEl = $('progress-fill');
const speakBtn = $('speak-btn');
const nextBtn = $('next-btn');
const weakBtn = $('weak-btn');
const modeVaUkBtn = $('mode-va-uk');
const modeUkVaBtn = $('mode-uk-va');
const lessonAreaEl = $('lesson-area');
const lessonEndEl = $('lesson-end');
const endSummaryEl = $('end-summary');
const endExtraEl = $('end-extra');
const restartBtn = $('restart-btn');
const nextTopicBtn = $('next-topic-btn');

function loadUserState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? { ...DEFAULT_STATE, ...JSON.parse(raw) } : structuredClone(DEFAULT_STATE);
  } catch {
    return structuredClone(DEFAULT_STATE);
  }
}

function saveUserState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(userState));
}

function playSound(type) {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === 'correct') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime);
      osc.frequency.setValueAtTime(880, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.3);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } else if (type === 'wrong') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(220, ctx.currentTime);
      osc.frequency.setValueAtTime(164.81, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.35);
      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    }
  } catch (e) {}
}

function shuffle(array) {
  return array.map(v => ({ v, sort: Math.random() })).sort((a, b) => a.sort - b.sort).map(({ v }) => v);
}

function pickNewIndex() {
  if (currentWords.length > 0) {
    currentIndex = Math.floor(Math.random() * currentWords.length);
  }
}

function initVoices() {
  if ('speechSynthesis' in window) {
    availableVoices = window.speechSynthesis.getVoices();
    window.speechSynthesis.onvoiceschanged = () => {
      availableVoices = window.speechSynthesis.getVoices();
    };
  }
}

async function loadData() {
  const [courseRes, ...topicRes] = await Promise.all([
    fetch(COURSE_URL),
    ...TOPIC_IDS.map(id => fetch(`data/${id}.json`))
  ]);
  course = await courseRes.json();
  const entries = await Promise.all(topicRes.map(r => r.json()));
  wordsByTopic = Object.fromEntries(TOPIC_IDS.map((id, i) => [id, entries[i]]));
  currentWords = wordsByTopic[currentTopicId] || [];
  renderTopicsList();
  restartLesson();
}

function renderTopicsList() {
  topicsListEl.innerHTML = '';
  course.forEach(topic => {
    const div = document.createElement('div');
    div.className = 'topic-item' + (topic.id === currentTopicId ? ' active' : '');
    const titleSpan = document.createElement('span');
    titleSpan.className = 'topic-title';
    titleSpan.textContent = `${topic.order}. ${topic.title_uk}`;
    const statusSpan = document.createElement('span');
    statusSpan.className = 'topic-status';
    const prog = userState.progress[topic.id];
    statusSpan.textContent = !prog ? 'не пройдена' : (prog.bestScore >= 9 ? '✅ засвоєна' : `пройдена (${prog.bestScore}/10)`);
    div.append(titleSpan, statusSpan);
    div.addEventListener('click', () => changeTopic(topic.id));
    topicsListEl.appendChild(div);
  });
}

function renderImage(entry) {
  imageBoxEl.innerHTML = '';
  if (entry?.emoji) {
    const emojiSpan = document.createElement('span');
    emojiSpan.style.fontSize = '4rem';
    emojiSpan.style.display = 'block';
    emojiSpan.textContent = entry.emoji;
    imageBoxEl.appendChild(emojiSpan);
  } else if (entry?.image) {
    const img = document.createElement('img');
    img.src = entry.image;
    img.alt = entry.va;
    imageBoxEl.appendChild(img);
  } else {
    const defaultSpan = document.createElement('span');
    defaultSpan.style.fontSize = '3rem';
    defaultSpan.textContent = '🎓';
    imageBoxEl.appendChild(defaultSpan);
  }
}

function updateProgress() {
  scoreEl.textContent = `Результат: ${score} / ${attempts}`;
  streakEl.textContent = `Питання ${currentQuestionNumber} / ${MAX_QUESTIONS}`;
  progressFillEl.style.width = `${((currentQuestionNumber - 1) / MAX_QUESTIONS) * 100}%`;
  xpValueEl.textContent = userState.totalXp;
  streakDaysEl.textContent = userState.streakDays;
}

function renderQuestion() {
  if (!currentWords.length) {
    questionLabelEl.textContent = 'Тема ще не заповнена';
    questionTextEl.textContent = 'Додай слова у data файл';
    optionsEl.innerHTML = '';
    return;
  }
  feedbackEl.textContent = '';
  feedbackEl.className = 'feedback';
  questionAnswered = false;
  const entry = currentWords[currentIndex];
  const topicMeta = course.find(t => t.id === currentTopicId);
  if (topicMeta) topicPillEl.textContent = `Тема: ${topicMeta.title_uk}`;
  
  const distractors = currentWords.filter(w => w.va !== entry.va);
  const optionsCount = Math.min(distractors.length, 3);
  const selectedOptions = shuffle(distractors).slice(0, optionsCount).concat(entry);

  if (mode === 'va-uk') {
    questionLabelEl.textContent = 'Обери переклад українською';
    questionTextEl.textContent = entry.va;
    phoneticEl.textContent = entry.phonetic || '';
    renderOptions(shuffle(selectedOptions), entry.uk, 'uk', entry);
  } else {
    questionLabelEl.textContent = 'Обери переклад валенсійською';
    questionTextEl.textContent = entry.uk;
    phoneticEl.textContent = '';
    renderOptions(shuffle(selectedOptions), entry.va, 'va', entry);
  }
  renderImage(entry);
  updateProgress();
}

function renderOptions(options, correctValue, field, entry) {
  optionsEl.innerHTML = '';
  options.forEach(opt => {
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
        feedbackEl.textContent = 'Чудово! Правильна відповідь 😊';
        feedbackEl.className = 'feedback good';
        playSound('correct');
        if (navigator.vibrate) navigator.vibrate(40);
      } else {
        streak = 0;
        btn.classList.add('wrong');
        const correctBtn = allButtons.find(b => b.dataset.value === correctValue);
        if (correctBtn) correctBtn.classList.add('correct');
        const pair = mode === 'va-uk' ? `${entry.va} = ${entry.uk}` : `${entry.uk} = ${entry.va}`;
        feedbackEl.textContent = `Майже! Правильно: ${pair}`;
        feedbackEl.className = 'feedback bad';
        playSound('wrong');
        if (navigator.vibrate) navigator.vibrate([60, 40, 60]);
        logMistake(entry);
      }
      updateProgress();
      allButtons.forEach(b => b.disabled = true);
      saveUserState();
    });
    optionsEl.appendChild(btn);
  });
}

function speakCurrent() {
  if (!('speechSynthesis' in window)) return alert('Браузер не підтримує озвучку.');
  const entry = currentWords[currentIndex];
  if (!entry) return;
  const textToSpeak = mode === 'va-uk' ? entry.va : entry.uk;
  const utterance = new SpeechSynthesisUtterance(textToSpeak);
  const langCode = mode === 'va-uk' ? 'ca-ES' : 'uk-UA';
  const voiceMatch = availableVoices.find(v => v.lang === langCode) || 
                     availableVoices.find(v => v.lang.startsWith('es')) || 
                     availableVoices[0];
  if (voiceMatch) utterance.voice = voiceMatch;
  utterance.lang = langCode;
  utterance.rate = 0.9;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
}

function goToNextQuestion() {
  if (currentQuestionNumber >= MAX_QUESTIONS) return showLessonEnd();
  currentQuestionNumber += 1;
  pickNewIndex();
  renderQuestion();
}

function showLessonEnd() {
  progressFillEl.style.width = '100%';
  lessonAreaEl.style.display = 'none';
  lessonEndEl.style.display = 'block';
  const ratio = attempts === 0 ? 0 : score / attempts;
  endSummaryEl.textContent = `Ви відповіли правильно на ${score} з ${attempts} питань!`;
  endExtraEl.textContent = ratio === 1 ? 'Ідеальний результат! 🎉' : (ratio >= 0.7 ? 'Дуже добре! 👍' : 'Потренуємося ще! 💪');
  handleLessonComplete();
  renderTopicsList();
  const nextTopic = getNextTopic(currentTopicId);
  if (nextTopic) {
    nextTopicBtn.style.display = 'inline-block';
    nextTopicBtn.textContent = `➡️ Наступна: ${nextTopic.title_uk}`;
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
  lessonEndEl.style.display = 'none';
  lessonAreaEl.style.display = 'block';
  currentWords = wordsByTopic[currentTopicId] || [];
  pickNewIndex();
  renderQuestion();
}

function changeTopic(newTopicId) {
  currentTopicId = newTopicId;
  userState.lastTopicId = newTopicId;
  saveUserState();
  currentWords = wordsByTopic[currentTopicId] || [];
  restartLesson();
  renderTopicsList();
}

function getNextTopic(currentId) {
  const current = course.find(t => t.id === currentId);
  if (!current) return null;
  return course.find(t => t.order === current.order + 1) || null;
}

function handleLessonComplete() {
  const topicProg = userState.progress[currentTopicId] || { completedLessons: 0, bestScore: 0, lastCompleted: null };
  topicProg.completedLessons += 1;
  if (score > topicProg.bestScore) topicProg.bestScore = score;
  topicProg.lastCompleted = new Date().toISOString();
  userState.progress[currentTopicId] = topicProg;
  userState.totalXp += score + 10;
  updateStreakDays();
  saveUserState();
  updateProgress();
}

function updateStreakDays() {
  const today = new Date().toISOString().slice(0, 10);
  if (!userState.lastActiveDate) {
    userState.lastActiveDate = today;
    userState.streakDays = 1;
    return;
  }
  if (userState.lastActiveDate === today) return;
  const last = new Date(userState.lastActiveDate);
  const curr = new Date(today);
  const diffDays = Math.round((curr - last) / 86400000);
  userState.streakDays = diffDays === 1 ? userState.streakDays + 1 : 1;
  userState.lastActiveDate = today;
}

function logMistake(entry) {
  if (!userState.weakItems[currentTopicId]) userState.weakItems[currentTopicId] = {};
  const key = entry.va;
  const existing = userState.weakItems[currentTopicId][key] || { errors: 0, lastSeen: null, entry };
  existing.errors += 1;
  existing.lastSeen = new Date().toISOString();
  userState.weakItems[currentTopicId][key] = existing;
}

function startWeakSession() {
  const topicWeak = userState.weakItems[currentTopicId] || {};
  const entries = Object.values(topicWeak).sort((a, b) => b.errors - a.errors).map(item => item.entry);
  if (!entries.length) return feedbackEl.textContent = 'У цій темі немає складних слів! 🌟';
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

speakBtn.addEventListener('click', speakCurrent);
nextBtn.addEventListener('click', () => {
  if (!questionAnswered) return feedbackEl.textContent = 'Спочатку оберіть відповідь 😊';
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
  if (next) changeTopic(next.id);
});

initVoices();
loadData().catch(err => {
  console.error(err);
  questionLabelEl.textContent = 'Помилка завантаження';
  questionTextEl.textContent = 'Перевір наявність файлів у data/';
});
