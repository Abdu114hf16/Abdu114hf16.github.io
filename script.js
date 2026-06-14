// ── NAV: scroll shadow + mobile toggle ────────────────────
const navWrap = document.querySelector('.nav-wrap');
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

window.addEventListener('scroll', () => {
  navWrap.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

navToggle.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  navToggle.classList.toggle('open', open);
  navToggle.setAttribute('aria-expanded', open);
});

// Close mobile nav when a link is clicked
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

// Close mobile nav on outside click
document.addEventListener('click', e => {
  if (!navWrap.contains(e.target)) {
    navLinks.classList.remove('open');
    navToggle.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  }
});

// ── SCROLL REVEAL (staggered) ─────────────────────────────
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const siblings = entry.target.parentElement.querySelectorAll('.reveal');
        let delay = 0;
        siblings.forEach((el, idx) => {
          if (el === entry.target) delay = idx * 80;
        });
        setTimeout(() => entry.target.classList.add('visible'), delay);
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
);

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ── ACTIVE NAV LINK on scroll ─────────────────────────────
const sections = document.querySelectorAll('section[id]');
const links = document.querySelectorAll('.nav-links a[href^="#"]');

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        links.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  },
  { threshold: 0.35 }
);

sections.forEach(section => sectionObserver.observe(section));

// ── CARD data-href click (for cards that contain <a> tags) ─
document.querySelectorAll('.project-card[data-href]').forEach(card => {
  card.style.cursor = 'pointer';
  card.addEventListener('click', () => {
    window.open(card.dataset.href, '_blank', 'noopener,noreferrer');
  });
  card.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      window.open(card.dataset.href, '_blank', 'noopener,noreferrer');
    }
  });
});

// ── PROJECTS: "View More" reveals the remaining cards ─────
const viewMoreBtn = document.getElementById('viewMoreBtn');
const moreProjects = document.getElementById('moreProjects');
const browseGithub = document.getElementById('browseGithub');

if (viewMoreBtn && moreProjects) {
  viewMoreBtn.addEventListener('click', () => {
    moreProjects.classList.add('show');
    // animate the newly shown cards in (they were display:none, so the
    // initial reveal observer never fired on them)
    moreProjects.querySelectorAll('.reveal').forEach((el, i) => {
      setTimeout(() => el.classList.add('visible'), i * 90);
    });
    viewMoreBtn.style.display = 'none';
    if (browseGithub) browseGithub.style.display = 'inline-flex';
  });
}

// ── BACK TO TOP button ───────────────────────────────────
const backToTop = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
  backToTop.classList.toggle('visible', window.scrollY > 400);
}, { passive: true });

backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ── SMOOTH SCROLL polyfill for older Safari ───────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ── DARK MODE TOGGLE ──────────────────────────────────────
const THEME_KEY = 'bp-theme';
const themeToggle = document.getElementById('themeToggle');

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    if (isDark) {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem(THEME_KEY, 'light');
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem(THEME_KEY, 'dark');
    }
  });
}

// ── ARABIC (RTL) LANGUAGE TOGGLE ──────────────────────────
const LANG_KEY = 'bp-lang';
const langToggle = document.getElementById('langToggle');

// Arabic translations. Proper nouns, tech tags, certificate names,
// emails and links intentionally stay in Latin script.
const AR = {
  nav_home: 'الرئيسية',
  nav_cv: 'السيرة الذاتية',
  nav_projects: 'المشاريع',
  nav_contact: 'تواصل',

  hero_greeting: 'مرحبًا، أنا',
  hero_name: 'عبدالله<br>الشمري',
  hero_tag1: 'طالب علوم حاسب بمرتبة الشرف الأولى في جامعة الملك سعود',
  hero_tag2: 'شغوف بعلم البيانات والذكاء الاصطناعي',
  hero_cta: 'استعرض أعمالي',

  about_title: 'نبذة',
  about_text: 'طالب في السنة الأخيرة بتخصص علوم الحاسب في جامعة الملك سعود، بأساسٍ قوي في الذكاء الاصطناعي وتحليل البيانات وذكاء الأعمال. أمتلك خبرة في بناء الحلول باستخدام نماذج تعلّم الآلة والنماذج الإحصائية، وتطوير البرمجيات، والإجابة عن التساؤلات، وتصميم التقارير باستخدام Power BI لتحويل البيانات الخام إلى رؤى قابلة للتنفيذ — وسدّ الفجوة بين النماذج التحليلية واحتياجات الأعمال.',
  m_university: 'الجامعة',
  m_university_v: 'جامعة الملك سعود',
  m_gpa: 'المعدل التراكمي',
  m_gpa_v: '4.85 / 5.0 · مرتبة الشرف الأولى',
  m_grad: 'التخرج',
  m_location: 'الموقع',
  m_location_v: 'الرياض، السعودية · قابلية الانتقال',
  m_languages: 'اللغات',
  m_languages_v: 'العربية · الإنجليزية',

  projects_title: 'المشاريع',
  p_eventia_badge: 'مشروع التخرج',
  p_eventia_desc: 'حلٌّ متكامل لـ<span class="accent">التحوّل الرقمي</span> قائم على الأدوار يغطّي دورة حياة الفعاليات كاملةً من منظورات متعددة — المنظِّم، والحاضر، والمورِّد، والمشرف. مبني باستخدام Django وMySQL، ويضمّ مساعدًا ذكيًا مدعومًا بـ Gemini، وسير عمل تراخيص SCEGA، ومراسلات داخل التطبيق، ولوحات تحكّم تحليلية.',
  p_flights_t: 'تحليل تأخيرات الرحلات التجارية',
  p_flights_desc: 'حلّ لذكاء الأعمال والتحليلات التنبؤية لتحليل تأخيرات الرحلات الجوية التجارية، باستخدام <span class="accent">قدرات تعلّم الآلة المتقدمة في Power BI</span> مثل الانحدار الخطي والتجميع والتنبؤ الزمني وكشف الشذوذ، لتحسين العمليات اللوجستية والتنبؤ باحتمالات التأخير.',
  p_donors_t: 'تحسين استهداف المتبرعين',
  p_donors_desc: 'مشروع تعلّم آلي خاضع للإشراف يحدّد المتبرعين الأكثر احتمالًا للتبرع عبر تحليل استكشافي موسّع والتحقق المتقاطع، و<span class="accent">مقارنة عدّة مصنِّفات</span> لاختيار النموذج الأمثل وتقليل تكاليف التواصل.',
  p_sms_t: 'مصنِّف الرسائل المزعجة',
  p_sms_desc: '<span class="accent">نموذج معالجة لغة طبيعية لاكتشاف الرسائل المزعجة</span> يصنّف الرسائل النصية كمزعجة أو سليمة باستخدام «نايف بايز متعدد الحدود» على سمات النص، ويُقيَّم بالدقة والاستدعاء ومقياس F1.',
  p_boolean_t: 'محرّك بحث منطقي',
  p_boolean_desc: 'محرّك بحث منطقي عالي الأداء مبني على فهرس مقلوب، يدعم عوامل البحث AND/OR. اختُبر على مجموعة تضمّ أكثر من 200 ألف مقال إخباري، محققًا أزمنة استرجاع بمستوى الميكروثانية.',
  p_ksa_t: 'اكتشف السعودية التفاعلي',
  p_ksa_desc: '<span class="accent">منصة ويب تفاعلية متكاملة</span> لاستكشاف مناطق المملكة العربية السعودية وتراثها الثقافي — تتضمّن لوحة إدارة (CRUD)، ومعارض صور، وبحثًا فوريًا، ووضعًا داكنًا، وواجهة عربية متجاوبة بالاتجاه من اليمين إلى اليسار.',
  p_viewmore: 'عرض المزيد',
  p_browse: 'تصفّح GitHub',

  skills_title: 'المهارات التقنية',
  s_prog: 'لغات البرمجة',
  s_ds: 'علم البيانات وذكاء الأعمال',
  s_tools: 'الأدوات',
  s_soft: 'المهارات الشخصية',
  ss_problem: 'حل المشكلات',
  ss_time: 'إدارة الوقت',
  ss_team: 'العمل الجماعي',
  ss_learn: 'التعلّم المستمر',

  certs_title: 'الشهادات',
  cert_view: 'عرض الشهادة ↗',

  edu_title: 'التعليم',
  edu_inst: 'جامعة الملك سعود',
  edu_loc: 'الرياض، السعودية',
  edu_degree: 'بكالوريوس العلوم في علوم الحاسب',
  edu_gpa_l: 'المعدل التراكمي:',
  edu_honor: 'مرتبة الشرف الأولى',
  edu_grad_l: 'التخرج المتوقع:',

  contact_overline: 'ماذا بعد؟',
  contact_heading: 'تواصل معي',
  contact_text: 'لديك سؤال أو فرصة أو ترغب بالتواصل فحسب؟ بريدي مفتوح دائمًا — وهنا تجدني.',
  cm_email: 'البريد الإلكتروني',
  cm_phone: 'الهاتف',
  cm_linkedin: 'لينكدإن',
  cm_github: 'جيت هب',
  contact_cta: 'تواصل معي',

  footer_copy: 'صُمّم وبُني بواسطة عبدالله الشمري',
};

const i18nEls = document.querySelectorAll('[data-i18n]');
// snapshot the original English markup so we can restore it on toggle-back.
// innerHTML (not textContent) so inline <span class="accent"> highlights survive.
const EN = new Map();
i18nEls.forEach(el => EN.set(el, el.innerHTML));

function setLang(lang) {
  const ar = lang === 'ar';
  i18nEls.forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (ar) {
      if (AR[key] != null) el.innerHTML = AR[key];
    } else {
      el.innerHTML = EN.get(el);
    }
  });
  document.documentElement.setAttribute('lang', ar ? 'ar' : 'en');
  document.documentElement.setAttribute('dir', ar ? 'rtl' : 'ltr');
  if (langToggle) {
    langToggle.textContent = ar ? 'EN' : 'ع';
    langToggle.setAttribute('aria-label', ar ? 'التبديل إلى الإنجليزية' : 'Switch to Arabic');
  }
  localStorage.setItem(LANG_KEY, ar ? 'ar' : 'en');
}

if (langToggle) {
  langToggle.addEventListener('click', () => {
    const isArabic = document.documentElement.getAttribute('lang') === 'ar';
    setLang(isArabic ? 'en' : 'ar');
  });
}

// Apply saved language on load (the inline head script already set dir/lang
// to avoid a layout flash; here we swap the actual text + button label).
if (localStorage.getItem(LANG_KEY) === 'ar') {
  setLang('ar');
} else if (langToggle) {
  langToggle.textContent = 'ع';
}
