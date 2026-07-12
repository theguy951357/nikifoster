/* cms.js
   Reads page content from Firebase Realtime Database and populates
   all content placeholders. Falls back to hardcoded defaults if
   the database is empty or unavailable.
*/

(function () {

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

  /* ── Helpers ─────────────────────────────────────────────────────── */
  function set(id, html) {
    var el = document.getElementById(id);
    if (el) el.innerHTML = html;
  }

  function setList(id, items) {
    var el = document.getElementById(id);
    if (!el) return;
    el.innerHTML = (items || []).map(function (item) {
      return '<li class="reveal-child">' + item + '</li>';
    }).join('');
  }

  function renderExtraCards(section, cards) {
    var container = document.getElementById('extra-cards-' + section);
    if (!container) return;
    container.innerHTML = '';
    if (!cards || !cards.length) return;
    cards.forEach(function (card) {
      if (!card || (!card.heading && !card.body)) return;
      var div = document.createElement('div');
      div.className = 'card reveal reveal-fade is-visible';
      div.style.flexDirection = 'column';
      div.style.alignItems = 'flex-start';
      div.innerHTML =
        (card.heading ? '<h3 class="reveal-child is-visible">' + card.heading + '</h3>' : '') +
        (card.body    ? '<p class="reveal-child is-visible">'  + card.body    + '</p>' : '');
      container.appendChild(div);
    });
  }

  function populate(data) {
    var D = window.CMS_DEFAULTS;
    function v(key)     { return (data[key] !== undefined && data[key] !== '') ? data[key] : D[key]; }
    function vList(key) { return (data[key] && Array.isArray(data[key]) && data[key].length) ? data[key] : D[key]; }

    set('cms-hero-main', v('hero_tagline_main'));
    set('cms-hero-sub',  v('hero_tagline_sub'));

    set('cms-services-intro-1', v('services_intro_1'));
    set('cms-services-intro-2', v('services_intro_2'));

    set('cms-direct-heading', v('direct_rep_heading'));
    set('cms-direct-p1',      v('direct_rep_body_1'));
    set('cms-direct-p2',      v('direct_rep_body_2'));
    set('cms-direct-p3',      v('direct_rep_body_3'));

    set('cms-ls-heading', v('limited_scope_heading'));
    set('cms-ls-body',    v('limited_scope_body'));

    set('cms-who-heading', v('who_heading'));
    set('cms-who-body',    v('who_body'));

    setList('cms-assist-list',   vList('assist_list'));

    set('cms-ai-heading', v('ai_heading'));
    set('cms-ai-body',    v('ai_body'));

    set('cms-practice-intro', v('practice_areas_intro'));
    setList('cms-practice-list', vList('practice_areas_list'));

    set('cms-why-heading', v('why_heading'));
    set('cms-why-body',    v('why_body'));

    set('cms-nc-heading', v('nc_only_heading'));
    set('cms-nc-body',    v('nc_only_body'));

    set('cms-how-heading',            v('how_clients_heading'));
    set('cms-how-body',               v('how_clients_body'));
    set('cms-intake-heading',         v('intake_heading'));
    setList('cms-intake-list',        vList('intake_list'));
    set('cms-considerations-heading', v('considerations_heading'));
    set('cms-considerations-body',    v('considerations_body'));

    set('cms-about-p1', v('about_p1'));
    set('cms-about-p2', v('about_p2'));
    set('cms-about-p3', v('about_p3'));
    set('cms-about-p4', v('about_p4'));
    set('cms-about-p5', v('about_p5'));

    set('cms-book', v('book_text'));

    set('cms-contact-intro',   v('contact_intro'));
    set('cms-contact-name',    v('contact_name'));
    set('cms-contact-address', v('contact_address').replace(/\n/g, '<br>'));
    set('cms-contact-email',   '<a href="mailto:' + v('contact_email') + '">' + v('contact_email') + '</a>');
    set('cms-contact-phone',   '<a href="tel:'   + v('contact_phone_raw') + '">' + v('contact_phone') + '</a>');

    var extra = data.extra_cards || {};
    ['services', 'how_it_works', 'about', 'book', 'contact'].forEach(function (section) {
      renderExtraCards(section, extra[section] ? Object.values(extra[section]) : []);
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    populate({});
    try {
      firebase.database().ref('content').on('value', function (snapshot) {
        var data = snapshot.val();
        if (data) populate(data);
      }, function (err) {
        console.warn('CMS: database read failed, using defaults.', err);
      });
    } catch (e) {
      console.warn('CMS: Firebase not available, using defaults.', e);
    }
  });

})();