/* admin.js
   Firebase Auth + Realtime Database read/write for the admin page.
   Uses update() so saving one field never blanks out others.
   Pre-populates form with defaults when database is empty.
   Supports adding extra cards to any section.
*/

(function () {

  var db, auth;
  var extraCards = {};

  /* ── Defaults — must match CMS_DEFAULTS in cms.js exactly ────────── */
  window.CMS_DEFAULTS = {
    hero_tagline_main: "Limited Scope Representation",
    hero_tagline_sub:  "Focused legal help for North Carolina without the large retainer.",
    services_intro_1: "If you have a North Carolina legal matter and are looking for an alternative to high-priced law firms, you've come to the right place.",
    services_intro_2: "My practice focuses on <strong>limited scope representation</strong>, a growing model where clients and attorneys contract to limit the attorney's involvement to specific tasks or phases of a case. Instead of billing by the hour, I charge a reasonable flat fee determined on a case-by-case basis. You get focused, professional legal support without paying for full representation.",
    direct_rep_heading: "Direct Representation in Asheville/Buncombe County and Western North Carolina",
    direct_rep_body_1: "In addition to limited scope assistance available to clients across North Carolina, I offer full direct representation in the courts of Western North Carolina, with a primary focus on Buncombe, Madison, and Haywood Counties, and the surrounding region on a case-by-case basis.",
    direct_rep_body_2: "If you are dealing with a traffic ticket, misdemeanor charge, small claims matter, including landlord-tenant, or a civil dispute in district court, I can appear alongside you, handle the courtroom, and see your case through from beginning to end. For many routine traffic and speeding tickets, particularly in Buncombe County, I can often handle the matter remotely on your behalf, without you ever needing to take time off work or set foot in a courtroom.",
    direct_rep_body_3: "My direct representation practice is built around the same values as my limited scope work: flat fees, honest communication, and practical legal help for real people.",
    limited_scope_heading: "What is limited scope representation?",
    limited_scope_body: "Limited scope legal services means your attorney handles only the parts of your case you choose. North Carolina State Bar rules permit attorneys to limit their representation when it is reasonable and you give informed consent. In my practice, this means I provide legal drafting, research, and strategy support, but I do not appear in court on your behalf or become the attorney of record. You stay in control of your case.",
    who_heading: "Who Should Consider Limited Scope Representation?",
    who_body: "This model is well-suited for people who are representing themselves (<em>pro se</em>) and need legal guidance or drafting support, want help drafting or reviewing court filings, including AI-assisted documents, need strategy advice without hiring full counsel, cannot afford full representation, or only need a lawyer for a specific phase of their case. Limited scope representation works best for individuals who have some familiarity with the legal system and are comfortable presenting oral arguments in court. It may not be appropriate in every situation, the right fit must be assessed on a case-by-case basis.",
    assist_list: [
      "Drafting complaints, answers, and counterclaims",
      "Ghostwriting motions and responses for <em>pro se</em> parties",
      "Legal research and case strategy",
      "Drafting and responding to discovery requests, with proper objections",
      "Reviewing court documents before filing",
      "Preparing for hearings and trial",
      "Coaching for mediation and settlement",
      "Appellate briefing support"
    ],
    ai_heading: "Using AI to draft legal documents?",
    ai_body: "Limited scope representation is an ideal fit for clients who have used AI tools to draft legal pleadings, motions, or other documents and want an attorney to review the work for legal accuracy, proper formatting, and jurisdiction-specific requirements before filing. AI can be a powerful starting point. Attorney review helps ensure the final product is sound.",
    practice_areas_intro: "I handle the following areas of North Carolina law:",
    practice_areas_list: [
      "Civil litigation, drafting and strategy support",
      "Landlord-tenant disputes",
      "Contract disputes",
      "Divorce and separation",
      "Criminal defense, misdemeanors",
      "Traffic offenses",
      "DUI / DWI",
      "Criminal appeals and post-conviction (appellate briefing, MAR, habeas)",
      "Expungements"
    ],
    why_heading: "Why I built this practice",
    why_body: "I have always been passionate about helping everyday people access the legal system. <em>Pro se</em> litigants, individuals representing themselves in court, deserve greater access to professional guidance than current practice typically allows. One of the challenges in the legal profession is that law schools spend three years training attorneys to think and speak like lawyers, creating a professional class that can feel removed from everyday society. In reality, there is much that people can do for themselves in court, particularly with an attorney supporting them behind the scenes. Limited scope representation bridges that gap.",
    nc_only_heading: "North Carolina only",
    nc_only_body: "My practice is limited to North Carolina. I am licensed to practice law in North Carolina only. If your legal matter arises under the laws of another state, Virginia, Tennessee, South Carolina, or anywhere else, I am not able to assist you, and you will need to find an attorney licensed in that state.",
    how_clients_heading: "How I work with clients",
    how_clients_body: "I run a small, focused practice and give each client individualized attention. Because I don't bill by the hour, I'm not watching the clock, which means I can be genuinely responsive. Email is my preferred method of communication.",
    intake_heading: "The intake process",
    intake_list: [
      "<strong>Initial email</strong>: Send a brief description of your matter to <a href='mailto:nikifosterlaw@gmail.com'>nikifosterlaw@gmail.com</a> so I can run a conflict check before we speak.",
      "<strong>Free 30-minute consultation</strong>: We discuss your case, identify where legal help is needed, and determine whether limited scope representation is the right fit at no charge.",
      "<strong>Scope agreement</strong>: We clearly define what I will and won't handle, confirmed in writing.",
      "<strong>Flat fee</strong>: You pay only for the agreed services. No hourly billing, no surprises."
    ],
    considerations_heading: "Important considerations",
    considerations_body: "Limited scope representation is not the same as full representation. I do not appear in court unless permitted by the tribunal and agreed upon in advance. You remain responsible for deadlines and filings outside the agreed scope. All arrangements are confirmed in a clear written agreement.",
    about_p1: "I am a North Carolina native, born and raised in the Piedmont. I attended the University of North Carolina at Chapel Hill for both undergraduate and law school, graduating with honors from the law school in 1995, in the top ten percent of my class, a distinction known as Order of the Coif, and as a published member of the North Carolina Law Review.",
    about_p2: "After law school, I served as a Staff Attorney at the federal Eleventh Circuit Court of Appeals in Atlanta and then as a <em>Pro Se</em> Law Clerk in the Northern District of California. My early practice focused on death penalty defense, appeals, and post-conviction relief, which expanded over time to include the immigration consequences of criminal convictions and post-conviction relief for non-citizen clients.",
    about_p3: "In 2010, I founded the North Carolina chapter of NORML (National Organization for the Reform of Marijuana Laws), and in 2011, I was a leading founder of the Occupy Asheville movement. I have been involved in efforts to overturn several wrongful convictions, most notably that of former physician Gordon Piland of Asheville, who was wrongfully convicted of trafficking opioids based on a loophole in North Carolina law in what was a cannabis case.",
    about_p4: "When the pandemic brought the world to a halt in 2020, I returned to graduate school and earned an MFA in Creative Writing in 2024, largely to begin writing a memoir documenting the Piland wrongful conviction. That book is still in progress. Piland eventually got out of prison after more than three years wrongfully behind bars over the age of seventy.",
    about_p5: "I have lived in Asheville and Western North Carolina for more than twenty-five years, including as a child, and I consider it home. I am active in the local community, the music scene, and I am always working to get people out to vote. Because I have taken time away from legal practice to pursue writing and activism, I think of myself as a grounded, well-rounded person first, and an attorney second, or even third. In my spare time, I write political poetry.",
    book_text: "<strong>Coming Soon</strong>",
    contact_intro: "Ready to get started? Email <a href='mailto:nikifosterlaw@gmail.com'>nikifosterlaw@gmail.com</a> with a brief description of your matter and the parties involved. This allows me to run a conflict check before we speak and schedule your free 30-minute consultation.",
    contact_name: "Law Office of Niki Foster",
    contact_address: "Post Office Box 1065\nAsheville, NC 28802",
    contact_email: "nikifosterlaw@gmail.com",
    contact_phone: "(828) 407-6588",
    contact_phone_raw: "+18284076588"
  };

  /* ── Init ────────────────────────────────────────────────────────── */
  function init() {
    try {
      auth = firebase.auth();
      db   = firebase.database();
    } catch (e) {
      showStatus('Firebase failed to initialize. Please check your connection.', 'error');
      return;
    }

    auth.onAuthStateChanged(function (user) {
      if (user) {
        showAdmin(user);
        loadContent();
      } else {
        showLogin();
      }
    });

    var emailForm = document.getElementById('login-email-form');
    if (emailForm) {
      emailForm.addEventListener('submit', function (e) {
        e.preventDefault();
        var email    = document.getElementById('login-email').value.trim();
        var password = document.getElementById('login-password').value;
        var btn      = document.getElementById('login-email-btn');
        btn.textContent = 'Signing in...';
        btn.disabled    = true;
        auth.signInWithEmailAndPassword(email, password).catch(function (err) {
          btn.textContent = 'Sign In';
          btn.disabled    = false;
          document.getElementById('login-error').textContent = friendlyError(err.code);
        });
      });
    }

    var googleBtn = document.getElementById('login-google-btn');
    if (googleBtn) {
      googleBtn.addEventListener('click', function () {
        auth.signInWithPopup(new firebase.auth.GoogleAuthProvider()).catch(function (err) {
          document.getElementById('login-error').textContent = friendlyError(err.code);
        });
      });
    }

    var logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) logoutBtn.addEventListener('click', function () { auth.signOut(); });

    var saveBtn = document.getElementById('save-btn');
    if (saveBtn) saveBtn.addEventListener('click', saveContent);

    document.addEventListener('click', function (e) {
      if (e.target.classList.contains('add-card-btn')) {
        addExtraCard(e.target.dataset.section);
      }
      if (e.target.classList.contains('list-add-btn')) {
        var container = document.getElementById(e.target.dataset.target);
        if (container) {
          container.appendChild(makeListItem(e.target.dataset.target, ''));
          container.lastChild.querySelector('textarea').focus();
        }
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  /* ── Auth UI ──────────────────────────────────────────────────────── */
  function showLogin() {
    document.getElementById('login-screen').style.display = 'flex';
    document.getElementById('admin-screen').style.display = 'none';
  }

  function showAdmin(user) {
    document.getElementById('login-screen').style.display = 'none';
    document.getElementById('admin-screen').style.display = 'block';
    document.getElementById('user-email').textContent = user.email || user.displayName || 'Signed in';
  }

  function friendlyError(code) {
    var map = {
      'auth/user-not-found':        'No account found with that email address.',
      'auth/wrong-password':        'Incorrect password. Please try again.',
      'auth/invalid-email':         'Please enter a valid email address.',
      'auth/too-many-requests':     'Too many attempts. Please wait a few minutes.',
      'auth/network-request-failed':'Network error. Please check your connection.',
      'auth/popup-closed-by-user':  'Google sign-in was closed. Please try again.'
    };
    return map[code] || 'Sign-in failed. Please try again.';
  }

  /* ── Load content ─────────────────────────────────────────────────── */
  function loadContent() {
    showStatus('Loading your content...', 'info');
    db.ref('content').once('value').then(function (snapshot) {
      var data = snapshot.val() || {};
      populateForm(data);
      showStatus('Content loaded. Make your changes and click Save All Changes.', 'success');
    }).catch(function () {
      populateForm({});
      showStatus('Could not reach database. Form loaded with default content.', 'warn');
    });
  }

  /* ── Populate form ────────────────────────────────────────────────── */
  function populateForm(data) {
    var D = window.CMS_DEFAULTS;
    function v(key) {
      return (data[key] !== undefined && data[key] !== '') ? data[key] : (D[key] || '');
    }

    var textFields = [
      'hero_tagline_main','hero_tagline_sub',
      'services_intro_1','services_intro_2',
      'direct_rep_heading','direct_rep_body_1','direct_rep_body_2','direct_rep_body_3',
      'limited_scope_heading','limited_scope_body',
      'who_heading','who_body',
      'ai_heading','ai_body',
      'practice_areas_intro',
      'why_heading','why_body',
      'nc_only_heading','nc_only_body',
      'how_clients_heading','how_clients_body',
      'intake_heading',
      'considerations_heading','considerations_body',
      'about_p1','about_p2','about_p3','about_p4','about_p5',
      'book_text',
      'contact_intro','contact_name','contact_address',
      'contact_email','contact_phone','contact_phone_raw'
    ];

    textFields.forEach(function (key) {
      var el = document.getElementById('field-' + key);
      if (el) el.value = v(key);
    });

    renderListEditor('assist-list-editor',   (data.assist_list && data.assist_list.length)                       ? data.assist_list         : D.assist_list);
    renderListEditor('practice-list-editor', (data.practice_areas_list && data.practice_areas_list.length)       ? data.practice_areas_list : D.practice_areas_list);
    renderListEditor('intake-list-editor',   (data.intake_list && data.intake_list.length)                       ? data.intake_list         : D.intake_list);

    extraCards = {};
    ['services','how_it_works','about','book','contact'].forEach(function (section) {
      extraCards[section] = [];
      var container = document.getElementById('extra-cards-admin-' + section);
      if (!container) return;
      container.innerHTML = '';
      if (data.extra_cards && data.extra_cards[section]) {
        Object.values(data.extra_cards[section]).forEach(function (card) {
          if (card) renderExtraCardAdmin(section, card.heading || '', card.body || '');
        });
      }
    });
  }

  /* ── List editors ─────────────────────────────────────────────────── */
  function renderListEditor(containerId, items) {
    var container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = '';
    (items || []).forEach(function (item) {
      container.appendChild(makeListItem(containerId, item));
    });
  }

  function makeListItem(containerId, value) {
    var wrap = document.createElement('div');
    wrap.className = 'list-item-row';
    var handle = document.createElement('span');
    handle.className = 'drag-handle';
    handle.textContent = '⠿';
    var input = document.createElement('textarea');
    input.className = 'list-item-input';
    input.value = value;
    input.rows  = 2;
    var removeBtn = document.createElement('button');
    removeBtn.className   = 'list-remove-btn';
    removeBtn.textContent = '✕ Remove';
    removeBtn.type        = 'button';
    removeBtn.addEventListener('click', function () { wrap.remove(); });
    wrap.appendChild(handle);
    wrap.appendChild(input);
    wrap.appendChild(removeBtn);
    return wrap;
  }

  function getListValues(containerId) {
    var container = document.getElementById(containerId);
    if (!container) return [];
    return Array.from(container.querySelectorAll('.list-item-input'))
      .map(function (el) { return el.value.trim(); })
      .filter(function (v) { return v.length > 0; });
  }

  /* ── Extra card admin UI ──────────────────────────────────────────── */
  function addExtraCard(section) { renderExtraCardAdmin(section, '', ''); }

  function renderExtraCardAdmin(section, heading, body) {
    var container = document.getElementById('extra-cards-admin-' + section);
    if (!container) return;
    var index = container.children.length;
    var wrap  = document.createElement('div');
    wrap.className       = 'extra-card-editor';
    wrap.dataset.section = section;
    wrap.dataset.index   = index;
    wrap.innerHTML =
      '<div class="extra-card-header">' +
        '<span class="extra-card-label">Additional Card ' + (index + 1) + '</span>' +
        '<button type="button" class="extra-card-remove">✕ Remove Card</button>' +
      '</div>' +
      '<label class="field-label">Card Heading <span style="font-weight:400;font-style:italic;">(optional)</span></label>' +
      '<input type="text" class="admin-input extra-card-heading" value="' + escHtml(heading) + '" placeholder="Leave blank for no heading">' +
      '<label class="field-label" style="margin-top:0.75rem;">Card Body Text</label>' +
      '<p class="field-hint">You can use &lt;strong&gt;bold&lt;/strong&gt; and &lt;em&gt;italic&lt;/em&gt; formatting.</p>' +
      '<textarea class="admin-textarea extra-card-body" rows="4" placeholder="Type the card content here...">' + escHtml(body) + '</textarea>';
    wrap.querySelector('.extra-card-remove').addEventListener('click', function () {
      wrap.remove();
      var remaining = container.querySelectorAll('.extra-card-editor');
      remaining.forEach(function (card, i) {
        card.querySelector('.extra-card-label').textContent = 'Additional Card ' + (i + 1);
        card.dataset.index = i;
      });
    });
    container.appendChild(wrap);
  }

  function getExtraCards(section) {
    var container = document.getElementById('extra-cards-admin-' + section);
    if (!container) return [];
    var cards = [];
    container.querySelectorAll('.extra-card-editor').forEach(function (wrap) {
      var heading = wrap.querySelector('.extra-card-heading').value.trim();
      var body    = wrap.querySelector('.extra-card-body').value.trim();
      if (heading || body) cards.push({ heading: heading, body: body });
    });
    return cards;
  }

  function escHtml(str) {
    return (str || '').replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }

  /* ── Save ─────────────────────────────────────────────────────────── */
  function saveContent() {
    var btn = document.getElementById('save-btn');
    btn.textContent = 'Saving...';
    btn.disabled    = true;
    showStatus('Saving your changes...', 'info');

    var textFields = [
      'hero_tagline_main','hero_tagline_sub',
      'services_intro_1','services_intro_2',
      'direct_rep_heading','direct_rep_body_1','direct_rep_body_2','direct_rep_body_3',
      'limited_scope_heading','limited_scope_body',
      'who_heading','who_body',
      'ai_heading','ai_body',
      'practice_areas_intro',
      'why_heading','why_body',
      'nc_only_heading','nc_only_body',
      'how_clients_heading','how_clients_body',
      'intake_heading',
      'considerations_heading','considerations_body',
      'about_p1','about_p2','about_p3','about_p4','about_p5',
      'book_text',
      'contact_intro','contact_name','contact_address',
      'contact_email','contact_phone','contact_phone_raw'
    ];

    var newData = {};
    textFields.forEach(function (key) {
      var el = document.getElementById('field-' + key);
      if (el) newData[key] = el.value.trim();
    });

    newData.assist_list         = getListValues('assist-list-editor');
    newData.practice_areas_list = getListValues('practice-list-editor');
    newData.intake_list         = getListValues('intake-list-editor');

    newData.extra_cards = {};
    ['services','how_it_works','about','book','contact'].forEach(function (section) {
      var cards = getExtraCards(section);
      if (cards.length) {
        newData.extra_cards[section] = {};
        cards.forEach(function (card, i) {
          newData.extra_cards[section]['card_' + i] = card;
        });
      }
    });

    db.ref('content').update(newData).then(function () {
      btn.textContent = '✓ Saved!';
      btn.disabled    = false;
      showStatus('All changes saved! Your website has been updated.', 'success');
      setTimeout(function () {
        btn.textContent = 'Save All Changes';
      }, 2000);
    }).catch(function (err) {
      btn.textContent = 'Save All Changes';
      btn.disabled    = false;
      showStatus('Save failed: ' + err.message, 'error');
    });
  }

  /* ── Status bar ───────────────────────────────────────────────────── */
  function showStatus(msg, type) {
    var bar = document.getElementById('status-bar');
    if (!bar) return;
    bar.textContent   = msg;
    bar.className     = 'status-bar status-' + type;
    bar.style.display = 'block';
  }

})();