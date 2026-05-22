/**
 * Arabic Mobile Quiz Game UI - Interaction Logic (Mockup & Game Engine)
 * Features:
 * - Dynamic Heart rendering (heart icons in HTML HUD).
 * - Multi-HUD Coins synchronizer.
 * - HTML5 Audio Synthesis (Web Audio API) for rich retro gaming sound effects.
 * - Confetti Canvas Particle engine.
 * - Trivia Option checker & Helper tools.
 * - Who Am I guesser with hints and coins deduction.
 * - Dynamic Victory screen stats display based on user gameplay performance.
 */

// --- Global State ---
let coins = parseInt(localStorage.getItem('gameCoins')) || 200;
let quizHearts = 3;
let whoamiHearts = 3;
let quizProgress = 60;
let whoamiProgress = 30;

// Game stats for Victory Screen
let statCorrect = 8;
let statWrong = 2;
let statEarnedCoins = 50;
let statTotalQuestions = 10;

const settings = {
  music: true,
  sfx: true,
  notifications: true
};

// --- Background Music ---
const bgMusic = new Audio("https://www.chosic.com/wp-content/uploads/2021/09/Elevator-music(chosic.com).mp3");
bgMusic.loop = true;
bgMusic.volume = 0.3;


// --- Localization Engine ---
const translations = {
  ar: {
    btn_start_play: "ابدأ اللعب",
    btn_open_settings: "الإعدادات",
    modes_title: "اختر نمط اللعب",
    mode_quiz_title: "لعبة الأسئلة",
    mode_whoami_title: "من أنا؟",
    quiz_question_text: "ما هي عاصمة اليابان؟",
    quiz_options: ["كيوتو", "أوساكا", "طوكيو", "هيروشيما"],
    helper_audience_lbl: "الجمهور",
    helper_skip_lbl: "تخطي",
    whoami_title: "من أنا؟",
    whoami_clue_title: "أنا عالم؟",
    clue1: "أنا عالم رياضيات وفيزياء شهير.",
    clue2: "اكتشفت قانون الجاذبية العام عندما سقطت التفاحة على رأسي.",
    clue3: "أنا صاحب كتاب الأصول الرياضية للفلسفة الطبيعية وصيغت قوانين الحركة الكلاسيكية.",
    whoami_input_placeholder: "اكتب اسم الشخصية هنا...",
    whoami_btn_submit: "إرسال الإجابة",
    whoami_hint_text: "تلميح",
    victory_ribbon_text: "أحسنت!",
    victory_score_lbl: "النقاط",
    victory_lbl_coins: "العملات",
    victory_lbl_check: "صحيح",
    victory_lbl_wrong: "خطأ",
    victory_btn_replay: "إعادة اللعب",
    victory_btn_home: "الرئيسية",
    settings_title: "الإعدادات",
    settings_profile_name: "زيرو",
    settings_xp_lbl: "المستوى 1 - 450 / 1000 XP",
    settings_music_lbl: "الموسيقى الخلفية",
    settings_sfx_lbl: "المؤثرات الصوتية",
    settings_notifs_lbl: "الإشعارات اليومية",
    settings_lang_lbl: "لغة اللعبة",
    settings_lang_val: "العربية (RTL)",
    settings_version_lbl: "نسخة اللعبة: 1.2.0 (Premium)",
    
    // Alerts
    alert_audience: "نسبة تصويت الجمهور للإجابات:\n- طوكيو: 75%\n- أوساكا: 10%\n- كيوتو: 10%\n- هيروشيما: 5%",
    alert_quiz_gameover: "انتهت المحاولات! حاول مرة أخرى.",
    alert_whoami_empty: "من فضلك اكتب اسماً للإجابة!",
    alert_whoami_max_hints: "لقد حصلت بالفعل على جميع التلميحات المتاحة لهذه الشخصية!",
    alert_whoami_no_coins: "عذراً، ليس لديك ما يكفي من العملات للحصول على تلميح!",
    alert_whoami_gameover: "انتهت المحاولات! الإجابة الصحيحة هي: إسحاق نيوتن",
    
    // Rewarded Ad Modal
    reward_ad_title: "شاهد واحصل على مكافأة! 🪙",
    reward_ad_desc: "شاهد إعلاناً قصيراً للحصول على 50 عملة مجانية!",
    reward_ad_btn_watch: "شاهد الإعلان الآن",
    reward_ad_playing: "جاري عرض الإعلان...",
    reward_ad_success: "رائع! تم إضافة 50 عملة لحسابك 🪙",
    reward_ad_btn_close: "إغلاق",
    reward_ad_btn_claim: "استلام المكافأة",
    reward_ad_scene_text: "شاشة الإعلان المميز"
  },
  en: {
    btn_start_play: "Play Now",
    btn_open_settings: "Settings",
    modes_title: "Choose Game Mode",
    mode_quiz_title: "Trivia Quiz",
    mode_whoami_title: "Who Am I?",
    quiz_question_text: "What is the capital of Japan?",
    quiz_options: ["Kyoto", "Osaka", "Tokyo", "Hiroshima"],
    helper_audience_lbl: "Audience",
    helper_skip_lbl: "Skip",
    whoami_title: "Who Am I?",
    whoami_clue_title: "Who am I?",
    clue1: "I am a famous mathematician and physicist.",
    clue2: "I discovered the law of universal gravitation when an apple fell on my head.",
    clue3: "I authored the Principia Mathematica and formulated the classical laws of motion.",
    whoami_input_placeholder: "Type character name here...",
    whoami_btn_submit: "Submit",
    whoami_hint_text: "Hint",
    victory_ribbon_text: "Well Done!",
    victory_score_lbl: "Score",
    victory_lbl_coins: "Coins",
    victory_lbl_check: "Correct",
    victory_lbl_wrong: "Wrong",
    victory_btn_replay: "Replay",
    victory_btn_home: "Home",
    settings_title: "Settings",
    settings_profile_name: "Zero",
    settings_xp_lbl: "Level 1 - 450 / 1000 XP",
    settings_music_lbl: "Background Music",
    settings_sfx_lbl: "Sound Effects",
    settings_notifs_lbl: "Daily Notifications",
    settings_lang_lbl: "Game Language",
    settings_lang_val: "English (LTR)",
    settings_version_lbl: "Game Version: 1.2.0 (Premium)",
    
    // Alerts
    alert_audience: "Audience poll results:\n- Tokyo: 75%\n- Osaka: 10%\n- Kyoto: 10%\n- Hiroshima: 5%",
    alert_quiz_gameover: "No attempts left! Try again.",
    alert_whoami_empty: "Please type a name to answer!",
    alert_whoami_max_hints: "You have already received all available hints for this character!",
    alert_whoami_no_coins: "Sorry, you don't have enough coins to get a hint!",
    alert_whoami_gameover: "No attempts left! The correct answer is: Isaac Newton",
    
    // Rewarded Ad Modal
    reward_ad_title: "Watch & Get Rewarded! 🪙",
    reward_ad_desc: "Watch a short video to get 50 free coins!",
    reward_ad_btn_watch: "Watch Ad Now",
    reward_ad_playing: "Ad is playing...",
    reward_ad_success: "Awesome! 50 coins added to your balance 🪙",
    reward_ad_btn_close: "Close",
    reward_ad_btn_claim: "Claim Reward",
    reward_ad_scene_text: "Premium Ad Screen"
  }
};

let currentLang = localStorage.getItem('gameLang') || 'ar';

function applyLanguage(lang) {
  currentLang = lang;
  localStorage.setItem('gameLang', lang);
  
  const trans = translations[lang];
  
  // Set HTML attributes
  document.documentElement.dir = (lang === 'ar') ? 'rtl' : 'ltr';
  document.documentElement.lang = lang;
  
  // Update Start screen buttons
  const btnStartPlay = document.getElementById('btn-start-play');
  if (btnStartPlay) btnStartPlay.innerText = trans.btn_start_play;
  
  const btnOpenSettings = document.getElementById('btn-open-settings');
  if (btnOpenSettings) btnOpenSettings.innerText = trans.btn_open_settings;
  
  // Ribbon swap on Home screen
  const arRibbon = document.getElementById('ribbon-ar-img');
  const enRibbon = document.getElementById('ribbon-en-text');
  if (arRibbon && enRibbon) {
    if (lang === 'ar') {
      arRibbon.style.display = 'block';
      enRibbon.style.display = 'none';
    } else {
      arRibbon.style.display = 'none';
      enRibbon.style.display = 'inline-block';
    }
  }
  
  // Modes Screen
  const modesTitle = document.getElementById('modes-title');
  if (modesTitle) modesTitle.innerText = trans.modes_title;
  
  const modeQuizTitle = document.getElementById('mode-quiz-title');
  if (modeQuizTitle) modeQuizTitle.innerText = trans.mode_quiz_title;
  
  const modeWhoamiTitle = document.getElementById('mode-whoami-title');
  if (modeWhoamiTitle) modeWhoamiTitle.innerText = trans.mode_whoami_title;
  
  // Quiz Screen
  const quizQuestionText = document.getElementById('quiz-question-text');
  if (quizQuestionText) quizQuestionText.innerText = trans.quiz_question_text;
  
  // Quiz Option buttons
  for (let i = 0; i < 4; i++) {
    const btnOpt = document.getElementById(`btn-option-${i}`);
    if (btnOpt) {
      const textSpan = btnOpt.querySelector('span:first-child');
      if (textSpan) textSpan.innerText = trans.quiz_options[i];
    }
  }
  
  const helperAudienceLbl = document.getElementById('helper-audience-lbl');
  if (helperAudienceLbl) helperAudienceLbl.innerText = trans.helper_audience_lbl;
  
  const helperSkipLbl = document.getElementById('helper-skip-lbl');
  if (helperSkipLbl) helperSkipLbl.innerText = trans.helper_skip_lbl;
  
  // Who Am I Screen
  const whoamiTitle = document.getElementById('whoami-title');
  if (whoamiTitle) whoamiTitle.innerText = trans.whoami_title;
  
  const whoamiClueTitle = document.getElementById('whoami-clue-title');
  if (whoamiClueTitle) whoamiClueTitle.innerText = trans.whoami_clue_title;
  
  const whoamiInput = document.getElementById('whoami-input');
  if (whoamiInput) whoamiInput.placeholder = trans.whoami_input_placeholder;
  
  const whoamiBtnSubmit = document.getElementById('whoami-btn-submit');
  if (whoamiBtnSubmit) whoamiBtnSubmit.innerText = trans.whoami_btn_submit;
  
  const whoamiHintText = document.getElementById('whoami-hint-text');
  if (whoamiHintText) whoamiHintText.innerText = trans.whoami_hint_text;
  
  // Update who am i clues if present
  const clueList = document.querySelector('.clue-text-list');
  if (clueList) {
    const currentClueCount = clueList.children.length;
    clueList.innerHTML = '';
    
    const c1 = document.createElement('div');
    c1.className = 'clue-item';
    c1.innerText = trans.clue1;
    clueList.appendChild(c1);
    
    if (currentClueCount >= 2) {
      const c2 = document.createElement('div');
      c2.className = 'clue-item';
      c2.innerText = trans.clue2;
      clueList.appendChild(c2);
    }
    
    if (currentClueCount >= 3) {
      const c3 = document.createElement('div');
      c3.className = 'clue-item';
      c3.innerText = trans.clue3;
      clueList.appendChild(c3);
    }
  }
  
  // Victory Screen
  const victoryRibbonText = document.getElementById('victory-ribbon-text');
  if (victoryRibbonText) victoryRibbonText.innerText = trans.victory_ribbon_text;
  
  const victoryScoreLbl = document.getElementById('victory-score-lbl');
  if (victoryScoreLbl) victoryScoreLbl.innerText = trans.victory_score_lbl;
  
  const victoryLblCoins = document.getElementById('victory-lbl-coins');
  if (victoryLblCoins) victoryLblCoins.innerText = trans.victory_lbl_coins;
  
  const victoryLblCheck = document.getElementById('victory-lbl-check');
  if (victoryLblCheck) victoryLblCheck.innerText = trans.victory_lbl_check;
  
  const victoryLblWrong = document.getElementById('victory-lbl-wrong');
  if (victoryLblWrong) victoryLblWrong.innerText = trans.victory_lbl_wrong;
  
  const victoryBtnReplay = document.getElementById('victory-btn-replay');
  if (victoryBtnReplay) victoryBtnReplay.innerText = trans.victory_btn_replay;
  
  const victoryBtnHome = document.getElementById('victory-btn-home');
  if (victoryBtnHome) victoryBtnHome.innerText = trans.victory_btn_home;
  
  // Settings Screen
  const settingsTitle = document.getElementById('settings-title');
  if (settingsTitle) settingsTitle.innerText = trans.settings_title;
  
  const settingsProfileName = document.getElementById('settings-profile-name');
  if (settingsProfileName) settingsProfileName.innerText = trans.settings_profile_name;
  
  const settingsXpLbl = document.getElementById('settings-xp-lbl');
  if (settingsXpLbl) settingsXpLbl.innerText = trans.settings_xp_lbl;
  
  const settingsMusicLbl = document.getElementById('settings-music-lbl');
  if (settingsMusicLbl) settingsMusicLbl.innerText = trans.settings_music_lbl;
  
  const settingsSfxLbl = document.getElementById('settings-sfx-lbl');
  if (settingsSfxLbl) settingsSfxLbl.innerText = trans.settings_sfx_lbl;
  
  const settingsNotifsLbl = document.getElementById('settings-notifs-lbl');
  if (settingsNotifsLbl) settingsNotifsLbl.innerText = trans.settings_notifs_lbl;
  
  const settingsLangLbl = document.getElementById('settings-lang-lbl');
  if (settingsLangLbl) settingsLangLbl.innerText = trans.settings_lang_lbl;
  
  const settingsLangVal = document.getElementById('settings-lang-val');
  if (settingsLangVal) settingsLangVal.innerText = trans.settings_lang_val;
  
  const settingsVersionLbl = document.getElementById('settings-version-lbl');
  if (settingsVersionLbl) settingsVersionLbl.innerText = trans.settings_version_lbl;
  
  // Rewarded Ad Modal
  const rewardAdTitle = document.getElementById('reward-ad-title');
  if (rewardAdTitle) rewardAdTitle.innerHTML = trans.reward_ad_title;
  
  const rewardAdDesc = document.getElementById('reward-ad-desc');
  if (rewardAdDesc) rewardAdDesc.innerText = trans.reward_ad_desc;
  
  const rewardAdBtnWatch = document.getElementById('reward-ad-btn-watch');
  if (rewardAdBtnWatch) rewardAdBtnWatch.innerText = trans.reward_ad_btn_watch;
  
  const rewardAdPlayingText = document.getElementById('reward-ad-playing-text');
  if (rewardAdPlayingText) rewardAdPlayingText.innerText = trans.reward_ad_playing;
  
  const rewardAdSuccessText = document.getElementById('reward-ad-success-text');
  if (rewardAdSuccessText) rewardAdSuccessText.innerHTML = trans.reward_ad_success;
  
  const rewardAdBtnClaim = document.getElementById('reward-ad-btn-claim');
  if (rewardAdBtnClaim) rewardAdBtnClaim.innerText = trans.reward_ad_btn_claim;
  
  const rewardAdSceneText = document.getElementById('reward-ad-scene-text');
  if (rewardAdSceneText) rewardAdSceneText.innerText = trans.reward_ad_scene_text;
}

// --- Dynamic Coins & HUD Synchronizer ---
function updateCoinsUI(amountToAdd) {
  coins += amountToAdd;
  localStorage.setItem('gameCoins', coins);
  
  // Update all coins displays
  const quizCoins = document.getElementById('quiz-coins-count');
  const whoamiCoins = document.getElementById('whoami-coins-count');
  const modesCoins = document.getElementById('modes-coins-count');
  
  if (quizCoins) quizCoins.innerText = coins;
  if (whoamiCoins) whoamiCoins.innerText = coins;
  if (modesCoins) modesCoins.innerText = coins;
}

// --- Dynamic Hearts HUD Render ---
function updateHeartsUI(containerId, count) {
  const container = document.getElementById(containerId);
  if (!container) return;
  
  container.innerHTML = '';
  for (let i = 0; i < 3; i++) {
    const heart = document.createElement('i');
    if (i < count) {
      heart.className = 'fa-solid fa-heart heart-red';
    } else {
      heart.className = 'fa-regular fa-heart heart-empty';
      heart.style.color = '#5a3cbd';
      heart.style.marginRight = '2px';
    }
    container.appendChild(heart);
  }
  
  // Compatibility fallbacks for any direct text elements
  if (containerId === 'quiz-hearts-container') {
    const countSpan = document.getElementById('quiz-hearts-count');
    if (countSpan) countSpan.innerText = count;
  } else if (containerId === 'whoami-hearts-container') {
    const countSpan = document.getElementById('whoami-hearts-count');
    if (countSpan) countSpan.innerText = count;
  }
}

// Initialize HUD elements on load
function initHUD() {
  updateCoinsUI(0);
  updateHeartsUI('quiz-hearts-container', quizHearts);
  updateHeartsUI('whoami-hearts-container', whoamiHearts);
}

// --- Custom Game Alert (replaces native alert()) ---
const _gameAlertOverlay = document.getElementById('game-alert-modal');
const _gameAlertTitle   = document.getElementById('game-alert-title');
const _gameAlertMessage = document.getElementById('game-alert-message');
const _gameAlertIcon    = document.getElementById('game-alert-icon');
const _gameAlertIconWrap = _gameAlertOverlay ? _gameAlertOverlay.querySelector('.game-alert-icon-wrap') : null;
const _gameAlertOkBtn   = document.getElementById('game-alert-ok-btn');
let _gameAlertCallback  = null;

// Icon & color config per type
const _alertConfig = {
  info:    { icon: 'fa-circle-info',  okLabel: { ar: 'حسناً',     en: 'OK'     } },
  success: { icon: 'fa-circle-check', okLabel: { ar: 'رائع! 🎉',   en: 'Great!' } },
  warning: { icon: 'fa-triangle-exclamation', okLabel: { ar: 'حسناً', en: 'OK' } },
  error:   { icon: 'fa-circle-xmark', okLabel: { ar: 'حسناً',     en: 'OK'     } },
  audience:{ icon: 'fa-users',        okLabel: { ar: 'شكراً!',    en: 'Thanks!' } },
};

/**
 * showGameAlert(title, message, type, callback)
 * type: 'info' | 'success' | 'warning' | 'error' | 'audience'
 */
function showGameAlert(title, message, type = 'info', callback = null) {
  if (!_gameAlertOverlay) { return; }

  const cfg = _alertConfig[type] || _alertConfig.info;

  // Set content
  if (_gameAlertTitle)   _gameAlertTitle.innerText   = title;
  if (_gameAlertMessage) _gameAlertMessage.innerText  = message;

  // Swap icon class
  if (_gameAlertIcon) {
    _gameAlertIcon.className = `fa-solid ${cfg.icon} game-alert-icon icon-${type}`;
    // Re-trigger bounce animation
    void _gameAlertIcon.offsetWidth;
  }
  if (_gameAlertIconWrap) {
    _gameAlertIconWrap.className = `game-alert-icon-wrap type-${type}`;
  }

  // OK button label
  if (_gameAlertOkBtn) {
    _gameAlertOkBtn.innerText = cfg.okLabel[currentLang] || cfg.okLabel.ar;
  }

  _gameAlertCallback = callback;

  // Show
  _gameAlertOverlay.classList.add('active');
  // Play sound only if audio context already exists (avoid creating it in modal init)
  if (audioCtx) playSound('click');
}

function _closeGameAlert() {
  if (!_gameAlertOverlay) return;
  _gameAlertOverlay.classList.remove('active');
  if (typeof _gameAlertCallback === 'function') {
    const cb = _gameAlertCallback;
    _gameAlertCallback = null;
    setTimeout(cb, 50); // small delay so modal closes first
  }
}

// OK button listener
if (_gameAlertOkBtn) {
  _gameAlertOkBtn.addEventListener('click', () => {
    playSound('click');
    _closeGameAlert();
  });
}

// --- Audio Engine (Synthesized via Web Audio API) ---
let audioCtx = null;
// Pre-create AudioContext immediately to avoid first-click delay
function getAudioContext() {
  if (!audioCtx) {
    try {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    } catch(e) {
      return null;
    }
  }
  // resume() is async - don't block on it
  if (audioCtx.state === 'suspended') {
    audioCtx.resume(); // fire-and-forget, no await
  }
  return audioCtx;
}

function playSound(type) {
  if (!settings.sfx) return;
  // Run sound synthesis asynchronously to avoid blocking UI thread
  requestAnimationFrame(() => { _playSoundInternal(type); });
}
function _playSoundInternal(type) {
  try {
    const audioCtx = getAudioContext();
    if (!audioCtx) return;
    const now = audioCtx.currentTime;
    
    switch (type) {
      case 'click': {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.exponentialRampToValueAtTime(150, now + 0.1);
        
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
        
        osc.start(now);
        osc.stop(now + 0.1);
        break;
      }
      case 'correct': {
        // High ascending double chime
        const osc1 = audioCtx.createOscillator();
        const osc2 = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        
        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(audioCtx.destination);
        
        osc1.type = 'triangle';
        osc2.type = 'sine';
        
        osc1.frequency.setValueAtTime(523.25, now); // C5
        osc2.frequency.setValueAtTime(523.25, now);
        
        osc1.frequency.setValueAtTime(659.25, now + 0.08); // E5
        osc2.frequency.setValueAtTime(659.25, now + 0.08);
        
        osc1.frequency.setValueAtTime(783.99, now + 0.16); // G5
        osc2.frequency.setValueAtTime(783.99, now + 0.16);
        
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
        
        osc1.start(now);
        osc2.start(now);
        osc1.stop(now + 0.4);
        osc2.stop(now + 0.4);
        break;
      }
      case 'wrong': {
        // Low buzzer sound
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(120, now);
        osc.frequency.linearRampToValueAtTime(80, now + 0.3);
        
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
        
        osc.start(now);
        osc.stop(now + 0.3);
        break;
      }
      case 'victory': {
        // Fanfare chord arpeggio
        const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99];
        
        notes.forEach((freq, i) => {
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.connect(gain);
          gain.connect(audioCtx.destination);
          
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + (i * 0.06));
          
          gain.gain.setValueAtTime(0.15, now + (i * 0.06));
          gain.gain.exponentialRampToValueAtTime(0.01, now + (i * 0.06) + 0.4);
          
          osc.start(now + (i * 0.06));
          osc.stop(now + (i * 0.06) + 0.4);
        });
        break;
      }
    }
  } catch (e) {
    console.warn("Audio synthesis error:", e);
  }
}

// --- Confetti Animation Engine ---
let confettiActive = false;
const canvas = document.getElementById('confetti-canvas');
const canvasCtx = canvas.getContext('2d');
let particles = [];

function resizeCanvas() {
  if (canvas && canvas.parentElement) {
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = canvas.parentElement.clientHeight;
  }
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class ConfettiParticle {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * -50 - 20;
    this.size = Math.random() * 8 + 6;
    this.speedY = Math.random() * 3 + 2;
    this.speedX = Math.random() * 2 - 1;
    this.rotation = Math.random() * 360;
    this.rotationSpeed = Math.random() * 4 - 2;
    
    const colors = ['#FFEB3B', '#FF3D71', '#00E5FF', '#4CAF50', '#EA80FC', '#FF8A80'];
    this.color = colors[Math.floor(Math.random() * colors.length)];
  }

  update() {
    this.y += this.speedY;
    this.x += this.speedX;
    this.rotation += this.rotationSpeed;
    
    if (this.y > canvas.height) {
      this.y = Math.random() * -50 - 20;
      this.x = Math.random() * canvas.width;
    }
  }

  draw() {
    canvasCtx.save();
    canvasCtx.translate(this.x, this.y);
    canvasCtx.rotate((this.rotation * Math.PI) / 180);
    canvasCtx.fillStyle = this.color;
    canvasCtx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
    canvasCtx.restore();
  }
}

function initConfetti() {
  particles = [];
  for (let i = 0; i < 60; i++) {
    particles.push(new ConfettiParticle());
  }
}

function animateConfetti() {
  if (!confettiActive) return;
  canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
  
  particles.forEach(p => {
    p.update();
    p.draw();
  });
  
  requestAnimationFrame(animateConfetti);
}

function startConfetti() {
  confettiActive = true;
  initConfetti();
  animateConfetti();
}

function stopConfetti() {
  confettiActive = false;
  canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
}

// --- Navigation Flow ---
const screens = {
  main: document.getElementById('screen-main'),
  modes: document.getElementById('screen-modes'),
  quiz: document.getElementById('screen-quiz'),
  whoami: document.getElementById('screen-whoami'),
  victory: document.getElementById('screen-victory'),
  settings: document.getElementById('screen-settings')
};

let currentScreen = 'main';

function navigateTo(screenId) {
  playSound('click');
  
  if (screenId !== 'victory') {
    stopConfetti();
  }
  
  // Transition logic
  Object.keys(screens).forEach(id => {
    if (id === currentScreen) {
      screens[id].classList.remove('active');
      screens[id].classList.add('exit-left');
      setTimeout(() => {
        screens[id].classList.remove('exit-left');
      }, 400);
    }
    if (id === screenId) {
      screens[id].classList.add('active');
    }
  });
  
  currentScreen = screenId;
  
  // Screen behaviors
  if (screenId === 'victory') {
    // Populate dynamic stats on Victory Screen
    const scoreCircle = document.querySelector('.victory-score-circle');
    const scoreTextSpan = document.querySelector('.victory-score-circle span:first-child');
    if (scoreTextSpan) {
      scoreTextSpan.innerText = `${statCorrect}/${statTotalQuestions}`;
    }
    
    if (scoreCircle) {
      const percentage = statTotalQuestions > 0 ? Math.round((statCorrect / statTotalQuestions) * 100) : 80;
      scoreCircle.style.background = `conic-gradient(#ffca28 0% ${percentage}%, #20104e ${percentage}% 100%)`;
    }
    
    const coinsStat = document.getElementById('victory-stat-coins');
    const correctStat = document.getElementById('victory-stat-correct');
    const wrongStat = document.getElementById('victory-stat-wrong');
    
    if (coinsStat) coinsStat.innerText = `+${statEarnedCoins}`;
    if (correctStat) correctStat.innerText = statCorrect;
    if (wrongStat) wrongStat.innerText = statWrong;
    
    setTimeout(() => {
      playSound('victory');
      startConfetti();
    }, 200);
  }
}

// Navigation Listeners
document.getElementById('btn-start-play').addEventListener('click', () => {
  navigateTo('modes');
});

const btnOpenSettings = document.getElementById('btn-open-settings');
if (btnOpenSettings) {
  btnOpenSettings.addEventListener('click', () => {
    navigateTo('settings');
  });
}

// Back buttons
document.querySelectorAll('.btn-back-to-main').forEach(btn => {
  btn.addEventListener('click', () => navigateTo('main'));
});
document.querySelectorAll('.btn-back-to-modes').forEach(btn => {
  btn.addEventListener('click', () => navigateTo('modes'));
});

// Bottom tabs navigation routing (Guarded in case they are deleted from HTML)
const navSettings = document.getElementById('nav-settings');
if (navSettings) {
  navSettings.addEventListener('click', () => {
    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
    navSettings.classList.add('active');
    navigateTo('settings');
  });
}

const navTrophy = document.getElementById('nav-trophy');
if (navTrophy) {
  navTrophy.addEventListener('click', () => {
    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
    navTrophy.classList.add('active');
    
    // Preset demo stats for quick trophy viewing
    statCorrect = 8;
    statWrong = 2;
    statEarnedCoins = 50;
    statTotalQuestions = 10;
    
    navigateTo('victory');
  });
}

const navGift = document.getElementById('nav-gift');
if (navGift) {
  navGift.addEventListener('click', () => {
    playSound('correct');
    
    // Give reward
    updateCoinsUI(100);
    
    // Flash visual feedback on all coins HUD elements
    ['quiz-coins-count', 'whoami-coins-count', 'modes-coins-count'].forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        const parent = el.parentElement;
        parent.style.transform = 'scale(1.2)';
        parent.style.transition = 'transform 0.15s ease';
        setTimeout(() => {
          parent.style.transform = 'scale(1)';
        }, 150);
      }
    });
  });
}

// --- Rewarded Video Ad Modal System ---
const modalAd = document.getElementById('modal-rewarded-ad');
const btnWatchAd = document.getElementById('reward-ad-btn-watch');
const btnClaimReward = document.getElementById('reward-ad-btn-claim');
const btnCloseAd = document.getElementById('reward-ad-close-btn');
const adVideoContainer = document.getElementById('ad-video-container');
const adSuccessContainer = document.getElementById('ad-success-container');
const adProgressFill = document.getElementById('ad-video-progress-fill');
const adCountdown = document.getElementById('ad-video-countdown');

let adTimer = null;

function openRewardedAdModal() {
  playSound('click');
  
  if (modalAd) modalAd.classList.add('active');
  
  if (btnWatchAd) btnWatchAd.style.display = 'block';
  if (btnClaimReward) btnClaimReward.style.display = 'none';
  if (btnCloseAd) {
    btnCloseAd.style.display = 'flex';
    btnCloseAd.disabled = false;
  }
  if (adVideoContainer) adVideoContainer.style.display = 'none';
  if (adSuccessContainer) adSuccessContainer.style.display = 'none';
  if (adProgressFill) adProgressFill.style.width = '0%';
  if (adCountdown) adCountdown.innerText = '5';
  
  if (adTimer) {
    clearInterval(adTimer);
    adTimer = null;
  }
}

function startRewardedAdSimulation() {
  if (btnWatchAd) btnWatchAd.style.display = 'none';
  if (btnCloseAd) {
    btnCloseAd.disabled = true;
    btnCloseAd.style.display = 'none';
  }
  
  if (adVideoContainer) adVideoContainer.style.display = 'flex';
  
  let timeLeft = 5;
  if (adCountdown) adCountdown.innerText = timeLeft;
  if (adProgressFill) adProgressFill.style.width = '0%';
  
  let step = 0;
  const totalSteps = 50; // 50 steps * 100ms = 5000ms
  
  adTimer = setInterval(() => {
    step++;
    const percent = Math.min(100, (step / totalSteps) * 100);
    if (adProgressFill) adProgressFill.style.width = `${percent}%`;
    
    if (step % 10 === 0) {
      timeLeft--;
      if (adCountdown) adCountdown.innerText = Math.max(0, timeLeft);
    }
    
    if (step >= totalSteps) {
      clearInterval(adTimer);
      adTimer = null;
      rewardUserFromAd();
    }
  }, 100);
}

function rewardUserFromAd() {
  if (adVideoContainer) adVideoContainer.style.display = 'none';
  if (adSuccessContainer) adSuccessContainer.style.display = 'flex';
  
  updateCoinsUI(50);
  playSound('correct');
  
  startConfetti();
  setTimeout(() => {
    stopConfetti();
  }, 2000);
  
  if (btnClaimReward) btnClaimReward.style.display = 'block';
}

// Rewarded Ad listeners
if (btnWatchAd) {
  btnWatchAd.addEventListener('click', () => {
    playSound('click');
    startRewardedAdSimulation();
  });
}

if (btnCloseAd) {
  btnCloseAd.addEventListener('click', () => {
    playSound('click');
    if (modalAd) modalAd.classList.remove('active');
  });
}

if (btnClaimReward) {
  btnClaimReward.addEventListener('click', () => {
    playSound('click');
    if (modalAd) modalAd.classList.remove('active');
  });
}

// Add rewarded ad trigger on HUD "+" buttons
document.querySelectorAll('.hud-btn-plus').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    openRewardedAdModal();
  });
});

// Mode selection card clicks
document.getElementById('mode-card-quiz').addEventListener('click', () => {
  resetQuizState();
  navigateTo('quiz');
});
document.getElementById('mode-card-whoami').addEventListener('click', () => {
  resetWhoamiState();
  navigateTo('whoami');
});

// Victory button clicks
document.getElementById('victory-btn-replay').addEventListener('click', () => {
  resetQuizState();
  navigateTo('quiz');
});
document.getElementById('victory-btn-home').addEventListener('click', () => {
  document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
  const navSettingsEl = document.getElementById('nav-settings');
  if (navSettingsEl) {
    navSettingsEl.classList.add('active');
  }
  navigateTo('main');
});

// --- Quiz Gameplay Logic ---
const quizProgressBar = document.getElementById('quiz-progress-bar');
const optionsButtons  = document.querySelectorAll('.btn-option');
const quizQuestionTextEl = document.getElementById('quiz-question-text');

// Flag to block double-clicks / re-clicks after answering
let isAnswering = false;

// ---- Dynamic quiz state ----
let quizDeck        = [];   // shuffled copy of quizQuestions
let currentQIndex   = 0;    // index into quizDeck
const QUESTIONS_PER_ROUND = 10; // how many Qs per round

/** Fisher-Yates shuffle (in-place) */
function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/** Load one question into the UI */
function loadQuestion(index) {
  const q = quizDeck[index];
  if (!q) return;

  // Update question text
  if (quizQuestionTextEl) quizQuestionTextEl.innerText = q.q;

  // Shuffle options for this render
  const shuffledOpts = shuffleArray([...q.opts]);

  optionsButtons.forEach((btn, i) => {
    const opt = shuffledOpts[i];
    const textSpan = btn.querySelector('span:first-child');
    if (textSpan) textSpan.innerText = opt;
    // Mark correct data attribute
    btn.setAttribute('data-correct', opt === q.answer ? 'true' : 'false');
    btn.classList.remove('correct', 'wrong');
    btn.style.opacity = '1';
    btn.style.pointerEvents = 'auto';
    btn.disabled = false;
  });

  // Update progress bar
  const progressPct = Math.round(((index) / QUESTIONS_PER_ROUND) * 100);
  if (quizProgressBar) quizProgressBar.style.width = `${progressPct}%`;

  isAnswering = false;
}

function resetQuizState() {
  quizHearts    = 3;
  isAnswering   = false;
  currentQIndex = 0;

  // Build a fresh shuffled deck (use quizQuestions if available, fallback safe)
  const pool = (typeof quizQuestions !== 'undefined' && quizQuestions.length)
    ? quizQuestions
    : [];
  quizDeck = shuffleArray([...pool]).slice(0, QUESTIONS_PER_ROUND);

  updateHeartsUI('quiz-hearts-container', quizHearts);

  // Reset stats
  statCorrect        = 0;
  statWrong          = 0;
  statEarnedCoins    = 0;
  statTotalQuestions = Math.min(QUESTIONS_PER_ROUND, quizDeck.length);

  // Load first question
  if (quizDeck.length > 0) {
    loadQuestion(0);
  }
}

// Build audience poll text dynamically based on current question
function buildAudienceText(q) {
  if (!q) return translations[currentLang].alert_audience;
  const correctOpt = q.answer;
  const others = q.opts.filter(o => o !== correctOpt);
  shuffleArray(others);
  const pct = [75, 13, 7, 5];
  const allOpts = [{ text: correctOpt, pct: 75 }, ...others.slice(0, 3).map((t, i) => ({ text: t, pct: pct[i + 1] }))];
  shuffleArray(allOpts);
  const lines = allOpts.map(o => `- ${o.text}: ${o.pct}%`).join('\n');
  return currentLang === 'ar'
    ? `نسبة تصويت الجمهور:\n${lines}`
    : `Audience poll:\n${lines}`;
}

optionsButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    // Block re-clicks immediately using flag
    if (isAnswering) return;
    isAnswering = true;

    // Disable all buttons instantly on first click
    optionsButtons.forEach(b => { b.disabled = true; });

    const isCorrect = btn.getAttribute('data-correct') === 'true';

    if (isCorrect) {
      playSound('correct');
      btn.classList.add('correct');
      btn.disabled = false; // keep correct visible

      // Update stats
      statCorrect++;
      const coinsPerQ = 5;
      statEarnedCoins += coinsPerQ;
      updateCoinsUI(coinsPerQ);

      currentQIndex++;

      if (currentQIndex >= quizDeck.length) {
        // All questions answered → go to victory
        if (quizProgressBar) quizProgressBar.style.width = '100%';
        setTimeout(() => navigateTo('victory'), 800);
      } else {
        // Next question after brief pause
        setTimeout(() => loadQuestion(currentQIndex), 800);
      }

    } else {
      playSound('wrong');
      btn.classList.add('wrong');
      quizHearts--;
      statWrong++;
      statCorrect = Math.max(0, statCorrect);
      updateHeartsUI('quiz-hearts-container', quizHearts);

      // Shake question card
      const questionCard = document.querySelector('.question-card');
      if (questionCard) {
        questionCard.style.animation = 'float-icon 0.1s 4 ease-in-out';
        setTimeout(() => { questionCard.style.animation = ''; }, 400);
      }

      if (quizHearts <= 0) {
        // Game over
        setTimeout(() => {
          showGameAlert(
            currentLang === 'ar' ? '😢 انتهت المحاولات!' : '😢 Game Over!',
            translations[currentLang].alert_quiz_gameover,
            'error',
            () => resetQuizState()
          );
        }, 600);
      } else {
        // Re-enable remaining (non-wrong) buttons
        setTimeout(() => {
          isAnswering = false;
          optionsButtons.forEach(b => {
            if (!b.classList.contains('wrong')) b.disabled = false;
          });
        }, 500);
      }
    }
  });
});

// Helper tool clicks
document.getElementById('helper-5050').addEventListener('click', () => {
  playSound('click');
  // Remove 2 incorrect options
  let eliminated = 0;
  optionsButtons.forEach(btn => {
    if (btn.getAttribute('data-correct') !== 'true' && eliminated < 2 && !btn.disabled && btn.style.opacity !== '0.2') {
      btn.style.opacity = '0.2';
      btn.style.pointerEvents = 'none';
      btn.disabled = true;
      eliminated++;
    }
  });
});

document.getElementById('helper-audience').addEventListener('click', () => {
  playSound('click');
  const currentQ = quizDeck[currentQIndex] || null;
  const audienceTitle = currentLang === 'ar' ? '📊 تصويت الجمهور' : '📊 Audience Poll';
  showGameAlert(audienceTitle, buildAudienceText(currentQ), 'audience');
});

document.getElementById('helper-skip').addEventListener('click', () => {
  playSound('click');
  // Skip to next question, count as wrong
  statWrong++;
  currentQIndex++;
  if (currentQIndex >= quizDeck.length) {
    navigateTo('victory');
  } else {
    loadQuestion(currentQIndex);
  }
});

// --- "Who Am I?" Detective game logic ---
const whoamiInput = document.getElementById('whoami-input');
const whoamiSubmit = document.getElementById('whoami-btn-submit');
const whoamiHint = document.getElementById('whoami-btn-hint');
const clueTextList = document.querySelector('.clue-text-list');
const whoamiProgressBar = document.getElementById('whoami-progress-bar');

let hintsUsed = 0;

function resetWhoamiState() {
  whoamiHearts = 3;
  updateHeartsUI('whoami-hearts-container', whoamiHearts);
  
  if (whoamiProgressBar) whoamiProgressBar.style.width = '30%';
  if (whoamiInput) {
    whoamiInput.style.backgroundColor = '';
    whoamiInput.style.borderColor = '';
    whoamiInput.value = '';
  }
  
  hintsUsed = 0;
  // Revert clues list back to original 2 clues
  if (clueTextList) {
    clueTextList.innerHTML = `
      <div class="clue-item">${translations[currentLang].clue1}</div>
      <div class="clue-item">${translations[currentLang].clue2}</div>
    `;
  }
}

whoamiSubmit.addEventListener('click', () => {
  const answer = whoamiInput.value.trim().toLowerCase();
  
  if (!answer) {
    showGameAlert(
      currentLang === 'ar' ? '✏️ أدخل إجابتك' : '✏️ Enter Your Answer',
      translations[currentLang].alert_whoami_empty,
      'warning'
    );
    return;
  }
  
  const isCorrect = (
    answer.includes('نيوتن') || 
    answer.includes('newton') || 
    answer.includes('اسحاق') || 
    answer.includes('إسحاق')
  );
  
  if (isCorrect) {
    playSound('correct');
    whoamiInput.style.backgroundColor = '#e8f5e9';
    whoamiInput.style.borderColor = '#4caf50';
    if (whoamiProgressBar) whoamiProgressBar.style.width = '100%';
    
    // Add coins reward
    statEarnedCoins = 80;
    statCorrect = 10;
    statWrong = 0;
    updateCoinsUI(statEarnedCoins);
    
    setTimeout(() => {
      navigateTo('victory');
      resetWhoamiState();
    }, 1200);
  } else {
    playSound('wrong');
    whoamiInput.style.backgroundColor = '#ffebee';
    whoamiInput.style.borderColor = '#e53935';
    
    whoamiHearts--;
    updateHeartsUI('whoami-hearts-container', whoamiHearts);
    
    // Shake input field
    whoamiInput.style.transform = 'translateX(10px)';
    whoamiInput.style.transition = 'transform 0.05s ease';
    setTimeout(() => { whoamiInput.style.transform = 'translateX(-10px)'; }, 50);
    setTimeout(() => { whoamiInput.style.transform = 'translateX(5px)'; }, 100);
    setTimeout(() => { whoamiInput.style.transform = 'translateX(0)'; }, 150);
    
    if (whoamiHearts <= 0) {
      setTimeout(() => {
        showGameAlert(
          currentLang === 'ar' ? '😢 انتهت المحاولات!' : '😢 Game Over!',
          translations[currentLang].alert_whoami_gameover,
          'error',
          () => resetWhoamiState()
        );
      }, 800);
    }
  }
});

// Hint logic
whoamiHint.addEventListener('click', () => {
  if (hintsUsed >= 1) {
    showGameAlert(
      currentLang === 'ar' ? '💡 لا تلميحات متبقية' : '💡 No Hints Left',
      translations[currentLang].alert_whoami_max_hints,
      'info'
    );
    return;
  }
  
  if (coins < 20) {
    showGameAlert(
      currentLang === 'ar' ? '🪙 عملات غير كافية' : '🪙 Not Enough Coins',
      translations[currentLang].alert_whoami_no_coins,
      'warning'
    );
    return;
  }
  
  playSound('click');
  
  // Deduct coins
  updateCoinsUI(-20);
  hintsUsed++;
  
  // Add third clue
  const newClue = document.createElement('div');
  newClue.className = 'clue-item';
  newClue.innerText = translations[currentLang].clue3;
  newClue.style.opacity = '0';
  newClue.style.transform = 'translateY(10px)';
  newClue.style.transition = 'all 0.4s ease';
  
  if (clueTextList) {
    clueTextList.appendChild(newClue);
    setTimeout(() => {
      newClue.style.opacity = '1';
      newClue.style.transform = 'translateY(0)';
    }, 100);
  }
});

// --- Settings Toggles ---
document.getElementById('settings-toggle-music').addEventListener('change', (e) => {
  settings.music = e.target.checked;
  playSound('click');
  if (settings.music) {
    bgMusic.play().catch(err => console.log("Music play blocked:", err));
  } else {
    bgMusic.pause();
  }
});

// Start background music on first user interaction (browser security policy)
function initBgMusicOnInteraction() {
  if (settings.music && bgMusic.paused) {
    bgMusic.play().catch(err => console.log("Autoplay blocked, waiting for interaction:", err));
  }
}
document.addEventListener('click', initBgMusicOnInteraction, { once: true });
document.addEventListener('touchstart', initBgMusicOnInteraction, { once: true });

document.getElementById('settings-toggle-sfx').addEventListener('change', (e) => {
  settings.sfx = e.target.checked;
  if (settings.sfx) {
    setTimeout(() => playSound('click'), 100);
  }
});

document.getElementById('settings-toggle-notifs').addEventListener('change', (e) => {
  settings.notifications = e.target.checked;
  playSound('click');
});

// Language setting switcher click handler
const settingsRowLang = document.getElementById('settings-row-lang');
if (settingsRowLang) {
  settingsRowLang.addEventListener('click', () => {
    playSound('click');
    const newLang = (currentLang === 'ar') ? 'en' : 'ar';
    applyLanguage(newLang);
  });
}

// --- Initial Setup Trigger ---
window.addEventListener('DOMContentLoaded', () => {
  initHUD();
  applyLanguage(currentLang);
});
