const STORAGE_KEY = 'valenciaTrainerState';
const MAX_QUESTIONS = 10;
const LESSONS_URL = 'data/lessons.json';

const BADGES = [
  { id: 'streak3', type: 'streak', threshold: 3, icon: '🔥', title: '3 дні поспіль', desc: 'Займайся 3 дні підряд' },
  { id: 'streak7', type: 'streak', threshold: 7, icon: '🔥', title: 'Тиждень поспіль', desc: 'Займайся 7 днів підряд' },
  { id: 'streak14', type: 'streak', threshold: 14, icon: '🔥', title: '2 тижні поспіль', desc: 'Займайся 14 днів підряд' },
  { id: 'streak30', type: 'streak', threshold: 30, icon: '🔥', title: 'Місяць поспіль', desc: 'Займайся 30 днів підряд' },
  { id: 'mastered1', type: 'mastered', threshold: 1, icon: '⭐', title: 'Перший крок', desc: 'Опануй першу тему' },
  { id: 'mastered5', type: 'mastered', threshold: 5, icon: '🌟', title: 'П’ять тем', desc: 'Опануй 5 тем' },
  { id: 'mastered10', type: 'mastered', threshold: 10, icon: '💫', title: 'Десять тем', desc: 'Опануй 10 тем' },
  { id: 'masteredAll', type: 'masteredAll', threshold: 1, icon: '🏆', title: 'Весь курс', desc: 'Опануй усі теми курсу' },
  { id: 'xp100', type: 'xp', threshold: 100, icon: '⚡', title: '100 XP', desc: 'Набери 100 очок досвіду' },
  { id: 'xp500', type: 'xp', threshold: 500, icon: '⚡', title: '500 XP', desc: 'Набери 500 очок досвіду' },
  { id: 'xp1000', type: 'xp', threshold: 1000, icon: '⚡', title: '1000 XP', desc: 'Набери 1000 очок досвіду' }
];

const DEFAULT_STATE = {
  userId: 'son1',
  totalXp: 0,
  streakDays: 0,
  lastActiveDate: null,
  progress: {},
  weakItems: {},
  badges: {},
  lastTopicId: null
};

let course = [];
let wordsByTopic = {};
let userState = loadUserState();
let currentTopicId = userState.lastTopicId;
let currentWords = [];
let sessionQueue = [];
let sessionLength = MAX_QUESTIONS;
let isReviewMode = false;
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
const badgesBtn = $('badges-btn');
const parentBtn = $('parent-btn');
const reviewBtn = $('review-btn');
const mascotEl = $('mascot');
const memoryBtn = $('memory-btn');
const memoryModal = $('memory-modal');
const memoryCloseBtn = $('memory-close');
const memoryGridEl = $('memory-grid');
const memoryInfoEl = $('memory-info');
const memoryResultEl = $('memory-result');
const badgesModal = $('badges-modal');
const badgesGridEl = $('badges-grid');
const badgesCloseBtn = $('badges-close');
const parentModal = $('parent-modal');
const parentCloseBtn = $('parent-close');
const parentStatsEl = $('parent-stats');
const parentWeakListEl = $('parent-weak-list');

function loadUserState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? { ...structuredClone(DEFAULT_STATE), ...JSON.parse(raw) } : structuredClone(DEFAULT_STATE);
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
    } else if (type === 'badge') {
      osc.type = 'sine';
      [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => {
        osc.frequency.setValueAtTime(f, ctx.currentTime + i * 0.09);
      });
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.4);
      osc.start();
      osc.stop(ctx.currentTime + 0.4);
    }
  } catch (e) {}
}

function triggerMascot(mood) {
  if (!mascotEl) return;
  mascotEl.classList.remove('happy', 'sad', 'excited');
  // Force a reflow so the animation restarts even if the same mood fires twice in a row.
  void mascotEl.offsetWidth;
  mascotEl.classList.add(mood);
}

function shuffle(array) {
  return array.map(v => ({ v, sort: Math.random() })).sort((a, b) => a.sort - b.sort).map(({ v }) => v);
}

function buildSessionQueue(words, length) {
  if (!words.length) return [];
  let queue = [];
  while (queue.length < length) {
    let batch = shuffle(words);
    if (queue.length && words.length > 1 && batch[0] === queue[queue.length - 1]) {
      const swapIdx = 1;
      [batch[0], batch[swapIdx]] = [batch[swapIdx], batch[0]];
    }
    queue = queue.concat(batch);
  }
  return queue.slice(0, length);
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
  const res = await fetch(LESSONS_URL);
  const json = await res.json();
  course = [...json.modules].sort((a, b) => a.order - b.order);
  wordsByTopic = json.lessons_data || {};
  if (!currentTopicId || !wordsByTopic[currentTopicId]) {
    currentTopicId = course.length ? course[0].id : null;
  }
  userState.lastTopicId = currentTopicId;
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

function computeReviewLength(wordCount) {
  if (wordCount <= 0) return 0;
  // Repeat each weak word about 3x, capped at the normal lesson length —
  // reviewing 2 words shouldn't force a full 10-question grind.
  return Math.min(MAX_QUESTIONS, Math.max(3, wordCount * 3));
}

function updateProgress() {
  scoreEl.textContent = `Результат: ${score} / ${attempts}`;
  streakEl.textContent = `Питання ${currentQuestionNumber} / ${sessionLength}`;
  progressFillEl.style.width = `${((currentQuestionNumber - 1) / sessionLength) * 100}%`;
  xpValueEl.textContent = userState.totalXp;
  streakDaysEl.textContent = userState.streakDays;
}

function renderQuestion() {
  const entry = sessionQueue[currentQuestionNumber - 1];
  if (!currentWords.length || !entry) {
    questionLabelEl.textContent = 'Тема ще не заповнена';
    questionTextEl.textContent = 'Додай слова у data файл';
    optionsEl.innerHTML = '';
    return;
  }
  feedbackEl.textContent = '';
  feedbackEl.className = 'feedback';
  questionAnswered = false;
  if (isReviewMode) {
    topicPillEl.textContent = '🔁 Повторення складних слів';
  } else {
    const topicMeta = course.find(t => t.id === currentTopicId);
    if (topicMeta) topicPillEl.textContent = `Тема: ${topicMeta.title_uk}`;
  }

  const distractors = currentWords.filter(w => w.va !== entry.va);
  const optionsCount = Math.min(distractors.length, 3);
  const selectedOptions = shuffle(distractors).slice(0, optionsCount).concat(entry);

  if (mode === 'va-uk') {
    questionLabelEl.textContent = 'Обери переклад українською';
    questionTextEl.textContent = entry.va;
    phoneticEl.textContent = entry.phonetic || '';
    renderOptions(shuffle(selectedOptions), entry.uk, 'uk', entry);
  } else {
    questionTextEl.textContent = entry.uk;
    phoneticEl.textContent = '';
    const useTyping = canTypeThisWord(entry) && Math.random() < 0.3;
    if (useTyping) {
      questionLabelEl.textContent = 'Напиши переклад валенсійською';
      renderTypeInput(entry);
    } else {
      questionLabelEl.textContent = 'Обери переклад валенсійською';
      renderOptions(shuffle(selectedOptions), entry.va, 'va', entry);
    }
  }
  renderImage(entry);
  updateProgress();
  // Only auto-speak on render when the Valencian word is already the visible
  // prompt (va-uk). In uk-va mode that would give away the answer, so instead
  // we speak it right after the child answers (see renderOptions/renderTypeInput).
  if (mode === 'va-uk') {
    setTimeout(() => autoSpeak(entry), 300);
  }
}

function canTypeThisWord(entry) {
  // Only ask the child to type words from a topic they've already mastered
  // (bestScore >= 9, same threshold as the "✅ засвоєна" label in the topic list),
  // and skip words they've recently gotten wrong more than once.
  const topicProg = userState.progress[currentTopicId];
  if (!topicProg || topicProg.bestScore < 9) return false;
  const topicWeak = userState.weakItems[currentTopicId];
  const weakEntry = topicWeak && topicWeak[entry.va];
  if (weakEntry && weakEntry.errors >= 2) return false;
  return true;
}

function normalizeForCompare(str) {
  return (str || '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function renderTypeInput(entry) {
  optionsEl.innerHTML = '';
  const wrapper = document.createElement('div');
  wrapper.className = 'type-answer';

  const input = document.createElement('input');
  input.type = 'text';
  input.className = 'type-input';
  input.placeholder = 'Напиши валенсійською...';
  input.autocomplete = 'off';
  input.autocapitalize = 'off';
  input.spellcheck = false;

  const submitBtn = document.createElement('button');
  submitBtn.className = 'option type-submit-btn';
  submitBtn.textContent = 'Перевірити';

  wrapper.append(input, submitBtn);
  optionsEl.appendChild(wrapper);

  const checkAnswer = () => {
    if (questionAnswered) return;
    questionAnswered = true;
    attempts += 1;
    const isCorrect = normalizeForCompare(input.value) === normalizeForCompare(entry.va);
    input.disabled = true;
    submitBtn.disabled = true;

    if (isCorrect) {
      score += 1;
      streak += 1;
      improveWeakWord(entry);
      input.classList.add('correct');
      feedbackEl.textContent = 'Чудово! Правильна відповідь 😊';
      feedbackEl.className = 'feedback good';
      playSound('correct');
      triggerMascot('happy');
      if (navigator.vibrate) navigator.vibrate(40);
    } else {
      streak = 0;
      input.classList.add('wrong');
      feedbackEl.textContent = `Майже! Правильно: ${entry.va}`;
      feedbackEl.className = 'feedback bad';
      playSound('wrong');
      triggerMascot('sad');
      if (navigator.vibrate) navigator.vibrate([60, 40, 60]);
      logMistake(entry);
    }
    updateProgress();
    saveUserState();
    setTimeout(() => autoSpeak(entry), 300);
  };

  submitBtn.addEventListener('click', checkAnswer);
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') checkAnswer();
  });
  setTimeout(() => input.focus(), 50);
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
        improveWeakWord(entry);
        btn.classList.add('correct');
        feedbackEl.textContent = 'Чудово! Правильна відповідь 😊';
        feedbackEl.className = 'feedback good';
        playSound('correct');
        triggerMascot('happy');
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
        triggerMascot('sad');
        if (navigator.vibrate) navigator.vibrate([60, 40, 60]);
        logMistake(entry);
      }
      updateProgress();
      allButtons.forEach(b => b.disabled = true);
      saveUserState();
      if (mode === 'uk-va') {
        setTimeout(() => autoSpeak(entry), 300);
      }
    });
    optionsEl.appendChild(btn);
  });
}

let currentAudioEl = null;

function playRecordedAudio(path) {
  try {
    if (currentAudioEl) {
      currentAudioEl.pause();
      currentAudioEl.currentTime = 0;
    }
    currentAudioEl = new Audio(path);
    currentAudioEl.play().catch(() => {});
    return true;
  } catch (e) {
    return false;
  }
}

function speakEntry(entry) {
  if (!entry) return false;

  // Always pronounce the Valencian word/phrase, regardless of quiz direction —
  // the point of the audio is hearing the language being learned.
  if (entry.audio) {
    if (playRecordedAudio(entry.audio)) return true;
  }

  if (!('speechSynthesis' in window)) return false;
  const utterance = new SpeechSynthesisUtterance(entry.va);
  const langCode = 'ca-ES';
  const voiceMatch = availableVoices.find(v => v.lang === langCode) ||
                     availableVoices.find(v => v.lang.startsWith('es')) ||
                     availableVoices[0];
  if (voiceMatch) utterance.voice = voiceMatch;
  utterance.lang = langCode;
  utterance.rate = 0.9;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
  return true;
}

function autoSpeak(entry) {
  try {
    speakEntry(entry);
  } catch (e) {}
}

function speakCurrent() {
  const entry = sessionQueue[currentQuestionNumber - 1];
  if (!speakEntry(entry)) alert('Браузер не підтримує озвучку.');
}

function goToNextQuestion() {
  if (currentQuestionNumber >= sessionLength) return showLessonEnd();
  currentQuestionNumber += 1;
  renderQuestion();
}

function showLessonEnd() {
  progressFillEl.style.width = '100%';
  lessonAreaEl.style.display = 'none';
  lessonEndEl.style.display = 'block';
  const ratio = attempts === 0 ? 0 : score / attempts;
  endSummaryEl.textContent = `Ви відповіли правильно на ${score} з ${attempts} питань!`;
  const newBadges = handleLessonComplete();
  let extraText = ratio === 1 ? 'Ідеальний результат! 🎉' : (ratio >= 0.7 ? 'Дуже добре! 👍' : 'Потренуємося ще! 💪');
  endExtraEl.innerHTML = '';
  const ratioP = document.createElement('p');
  ratioP.textContent = extraText;
  endExtraEl.appendChild(ratioP);
  if (newBadges.length) {
    playSound('badge');
    triggerMascot('excited');
    const badgeP = document.createElement('p');
    badgeP.className = 'new-badge-line';
    badgeP.textContent = `Нова нагорода: ${newBadges.map(b => `${b.icon} ${b.title}`).join(', ')}`;
    endExtraEl.appendChild(badgeP);
  }
  renderTopicsList();
  if (isReviewMode) {
    nextTopicBtn.style.display = 'none';
  } else {
    const nextTopic = getNextTopic(currentTopicId);
    if (nextTopic) {
      nextTopicBtn.style.display = 'inline-block';
      nextTopicBtn.textContent = `➡️ Наступна: ${nextTopic.title_uk}`;
    } else {
      nextTopicBtn.style.display = 'none';
    }
  }
}

function restartLesson() {
  isReviewMode = false;
  score = 0;
  attempts = 0;
  streak = 0;
  currentQuestionNumber = 1;
  questionAnswered = false;
  lessonEndEl.style.display = 'none';
  lessonAreaEl.style.display = 'block';
  currentWords = wordsByTopic[currentTopicId] || [];
  sessionLength = MAX_QUESTIONS;
  sessionQueue = buildSessionQueue(currentWords, sessionLength);
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

function getMasteredCount() {
  return Object.values(userState.progress).filter(p => p.bestScore >= 9).length;
}

function checkAndAwardBadges() {
  const mastered = getMasteredCount();
  const stats = {
    streak: userState.streakDays,
    mastered,
    masteredAll: course.length > 0 && mastered >= course.length ? 1 : 0,
    xp: userState.totalXp
  };
  const newlyEarned = [];
  BADGES.forEach(badge => {
    if (userState.badges[badge.id]) return;
    const value = stats[badge.type];
    if (value >= badge.threshold) {
      userState.badges[badge.id] = new Date().toISOString();
      newlyEarned.push(badge);
    }
  });
  return newlyEarned;
}

function handleLessonComplete() {
  if (isReviewMode) {
    // Cross-topic/topic review sessions aren't tied to a single topic's
    // progress record — just reward XP and streak, no topic mastery changes.
    userState.totalXp += score + 5;
    updateStreakDays();
    const newBadges = checkAndAwardBadges();
    saveUserState();
    updateProgress();
    return newBadges;
  }
  const topicProg = userState.progress[currentTopicId] || { completedLessons: 0, bestScore: 0, lastCompleted: null };
  topicProg.completedLessons += 1;
  if (score > topicProg.bestScore) topicProg.bestScore = score;
  topicProg.lastCompleted = new Date().toISOString();
  userState.progress[currentTopicId] = topicProg;
  userState.totalXp += score + 10;
  updateStreakDays();
  const newBadges = checkAndAwardBadges();
  saveUserState();
  updateProgress();
  return newBadges;
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

function cleanEntry(entry) {
  return { va: entry.va, uk: entry.uk, phonetic: entry.phonetic, emoji: entry.emoji, audio: entry.audio };
}

function logMistake(entry) {
  // entry._topicId is set on entries pulled into a cross-topic review session
  // (see getAllWeakEntries); otherwise fall back to whatever topic is open.
  const topicId = entry._topicId || currentTopicId;
  if (!userState.weakItems[topicId]) userState.weakItems[topicId] = {};
  const key = entry.va;
  const existing = userState.weakItems[topicId][key] || { errors: 0, lastSeen: null, entry: cleanEntry(entry) };
  existing.errors += 1;
  existing.lastSeen = new Date().toISOString();
  userState.weakItems[topicId][key] = existing;
}

function improveWeakWord(entry) {
  // When a previously-weak word is answered correctly during a review session,
  // let it "graduate" out of the weak list instead of hanging around forever.
  const topicId = entry._topicId;
  if (!topicId) return;
  const topicWeak = userState.weakItems[topicId];
  if (!topicWeak || !topicWeak[entry.va]) return;
  topicWeak[entry.va].errors -= 1;
  if (topicWeak[entry.va].errors <= 0) {
    delete topicWeak[entry.va];
    if (Object.keys(topicWeak).length === 0) delete userState.weakItems[topicId];
  }
}

function getAllWeakEntries() {
  const list = [];
  Object.entries(userState.weakItems).forEach(([topicId, words]) => {
    Object.values(words).forEach(item => {
      list.push({ ...item.entry, _topicId: topicId, _errors: item.errors });
    });
  });
  list.sort((a, b) => b._errors - a._errors);
  return list;
}

function startWeakSession() {
  const topicWeak = userState.weakItems[currentTopicId] || {};
  const entries = Object.values(topicWeak)
    .sort((a, b) => b.errors - a.errors)
    .map(item => ({ ...item.entry, _topicId: currentTopicId, _errors: item.errors }));
  if (!entries.length) return feedbackEl.textContent = 'У цій темі немає складних слів! 🌟';
  isReviewMode = true;
  currentWords = entries;
  score = 0;
  attempts = 0;
  streak = 0;
  currentQuestionNumber = 1;
  questionAnswered = false;
  lessonEndEl.style.display = 'none';
  lessonAreaEl.style.display = 'block';
  sessionLength = computeReviewLength(entries.length);
  sessionQueue = buildSessionQueue(currentWords, sessionLength);
  renderQuestion();
}

function startGlobalReview() {
  const entries = getAllWeakEntries();
  if (!entries.length) {
    feedbackEl.textContent = 'Наразі немає складних слів для повторення! 🌟';
    return;
  }
  isReviewMode = true;
  currentWords = entries;
  score = 0;
  attempts = 0;
  streak = 0;
  currentQuestionNumber = 1;
  questionAnswered = false;
  lessonEndEl.style.display = 'none';
  lessonAreaEl.style.display = 'block';
  sessionLength = computeReviewLength(entries.length);
  sessionQueue = buildSessionQueue(currentWords, sessionLength);
  renderQuestion();
}

function renderBadgesModal() {
  badgesGridEl.innerHTML = '';
  BADGES.forEach(badge => {
    const earned = Boolean(userState.badges[badge.id]);
    const div = document.createElement('div');
    div.className = 'badge-card' + (earned ? ' earned' : ' locked');
    const iconSpan = document.createElement('div');
    iconSpan.className = 'badge-card-icon';
    iconSpan.textContent = badge.icon;
    const titleSpan = document.createElement('div');
    titleSpan.className = 'badge-card-title';
    titleSpan.textContent = badge.title;
    const descSpan = document.createElement('div');
    descSpan.className = 'badge-card-desc';
    descSpan.textContent = badge.desc;
    div.append(iconSpan, titleSpan, descSpan);
    badgesGridEl.appendChild(div);
  });
}

function renderParentDashboard() {
  const mastered = getMasteredCount();
  parentStatsEl.innerHTML = '';
  const stats = [
    { label: 'Всього XP', value: userState.totalXp },
    { label: 'Днів поспіль', value: userState.streakDays },
    { label: 'Тем опановано', value: `${mastered} / ${course.length}` },
    { label: 'Нагород отримано', value: `${Object.keys(userState.badges).length} / ${BADGES.length}` }
  ];
  stats.forEach(s => {
    const div = document.createElement('div');
    div.className = 'parent-stat';
    div.innerHTML = `<div class="parent-stat-value">${s.value}</div><div class="parent-stat-label">${s.label}</div>`;
    parentStatsEl.appendChild(div);
  });

  const allWeak = [];
  Object.entries(userState.weakItems).forEach(([topicId, words]) => {
    const topicMeta = course.find(t => t.id === topicId);
    Object.values(words).forEach(item => {
      allWeak.push({
        topicTitle: topicMeta ? topicMeta.title_uk : topicId,
        va: item.entry.va,
        uk: item.entry.uk,
        errors: item.errors
      });
    });
  });
  allWeak.sort((a, b) => b.errors - a.errors);
  parentWeakListEl.innerHTML = '';
  if (!allWeak.length) {
    const p = document.createElement('p');
    p.className = 'small-info';
    p.textContent = 'Поки немає слів, у яких дитина часто помиляється. 🌟';
    parentWeakListEl.appendChild(p);
  } else {
    allWeak.slice(0, 10).forEach(item => {
      const row = document.createElement('div');
      row.className = 'parent-weak-row';
      row.innerHTML = `<span>${item.va} — ${item.uk}</span><span class="parent-weak-meta">${item.topicTitle} · ${item.errors} пом.</span>`;
      parentWeakListEl.appendChild(row);
    });
  }
}

const MEMORY_PAIR_COUNT = 6;
let memoryCards = [];
let memoryFlipped = [];
let memoryMatchedCount = 0;
let memoryMoves = 0;
let memoryLock = false;

function getMemoryWordPool() {
  const attemptedTopicIds = Object.keys(userState.progress);
  let pool = [];
  attemptedTopicIds.forEach(topicId => {
    (wordsByTopic[topicId] || []).forEach(w => pool.push(w));
  });
  if (pool.length < MEMORY_PAIR_COUNT) {
    // Not enough attempted topics yet — fall back to the whole course so the
    // game still works for a brand-new learner.
    pool = [];
    Object.values(wordsByTopic).forEach(words => words.forEach(w => pool.push(w)));
  }
  const seen = new Set();
  return pool.filter(w => {
    if (seen.has(w.va)) return false;
    seen.add(w.va);
    return true;
  });
}

function startMemoryGame() {
  const pool = getMemoryWordPool();
  const picked = shuffle(pool).slice(0, Math.min(MEMORY_PAIR_COUNT, pool.length));
  const cards = [];
  picked.forEach((entry, i) => {
    cards.push({ id: `${i}-va`, pairKey: i, text: entry.va, matched: false });
    cards.push({ id: `${i}-uk`, pairKey: i, text: entry.uk, matched: false });
  });
  memoryCards = shuffle(cards);
  memoryFlipped = [];
  memoryMatchedCount = 0;
  memoryMoves = 0;
  memoryLock = false;
  memoryResultEl.textContent = '';
  renderMemoryGrid();
  updateMemoryInfo();
}

function updateMemoryInfo() {
  memoryInfoEl.textContent = `Спроб: ${memoryMoves} · Знайдено пар: ${memoryMatchedCount} / ${MEMORY_PAIR_COUNT}`;
}

function renderMemoryGrid() {
  memoryGridEl.innerHTML = '';
  memoryCards.forEach(card => {
    const btn = document.createElement('button');
    btn.className = 'memory-card';
    btn.textContent = '❓';
    btn.addEventListener('click', () => onMemoryCardClick(btn, card));
    memoryGridEl.appendChild(btn);
  });
}

function onMemoryCardClick(cardEl, card) {
  if (memoryLock || card.matched || memoryFlipped.some(f => f.card.id === card.id)) return;

  cardEl.textContent = card.text;
  cardEl.classList.add('flipped');
  memoryFlipped.push({ cardEl, card });

  if (memoryFlipped.length < 2) return;

  memoryMoves += 1;
  memoryLock = true;
  const [first, second] = memoryFlipped;

  if (first.card.pairKey === second.card.pairKey) {
    first.card.matched = true;
    second.card.matched = true;
    first.cardEl.classList.remove('flipped');
    second.cardEl.classList.remove('flipped');
    first.cardEl.classList.add('matched');
    second.cardEl.classList.add('matched');
    first.cardEl.disabled = true;
    second.cardEl.disabled = true;
    memoryMatchedCount += 1;
    playSound('correct');
    triggerMascot('happy');
    memoryFlipped = [];
    memoryLock = false;
    updateMemoryInfo();
    if (memoryMatchedCount === MEMORY_PAIR_COUNT) {
      onMemoryGameComplete();
    }
  } else {
    playSound('wrong');
    triggerMascot('sad');
    updateMemoryInfo();
    setTimeout(() => {
      first.cardEl.textContent = '❓';
      second.cardEl.textContent = '❓';
      first.cardEl.classList.remove('flipped');
      second.cardEl.classList.remove('flipped');
      memoryFlipped = [];
      memoryLock = false;
    }, 900);
  }
}

function onMemoryGameComplete() {
  memoryResultEl.textContent = `Чудово! Усі пари знайдено за ${memoryMoves} спроб! 🎉`;
  userState.totalXp += 10;
  saveUserState();
  updateProgress();
  playSound('badge');
  triggerMascot('excited');
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

badgesBtn.addEventListener('click', () => {
  renderBadgesModal();
  badgesModal.style.display = 'flex';
});
badgesCloseBtn.addEventListener('click', () => badgesModal.style.display = 'none');
badgesModal.addEventListener('click', (e) => {
  if (e.target === badgesModal) badgesModal.style.display = 'none';
});

reviewBtn.addEventListener('click', startGlobalReview);

memoryBtn.addEventListener('click', () => {
  startMemoryGame();
  memoryModal.style.display = 'flex';
});
memoryCloseBtn.addEventListener('click', () => memoryModal.style.display = 'none');
memoryModal.addEventListener('click', (e) => {
  if (e.target === memoryModal) memoryModal.style.display = 'none';
});

parentBtn.addEventListener('click', () => {
  renderParentDashboard();
  parentModal.style.display = 'flex';
});
parentCloseBtn.addEventListener('click', () => parentModal.style.display = 'none');
parentModal.addEventListener('click', (e) => {
  if (e.target === parentModal) parentModal.style.display = 'none';
});

initVoices();
loadData().catch(err => {
  console.error(err);
  questionLabelEl.textContent = 'Помилка завантаження';
  questionTextEl.textContent = 'Перевір наявність файлу data/lessons.json';
});
