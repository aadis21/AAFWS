/* ═══════════════════════════════════════
   AAFWS — app.js
═══════════════════════════════════════ */

// ── DEMANDS DATA ──────────────────────
const DEMANDS=[
  {cat:"Financial Security",icon:"💰",items:["Monthly stipend for junior advocates","Low-interest loans & financial assistance","Startup-style welfare for first-generation lawyers","Easy credit access without fixed salary requirements","Emergency cash assistance for advocates in crisis"]},
  {cat:"Training & Skill Development",icon:"🎓",items:["Mandatory mock court sessions","Advocacy workshops on courtroom skills","Digital legal research & AI technology training","Structured mentorship under senior advocates","Continuing legal education (CLE) programs"]},
  {cat:"Welfare & Social Security",icon:"🛡️",items:["Pension schemes for senior advocates","Emergency welfare funds","Compensation during disability or accidents","Family support on advocate's death","Disability assistance programs"]},
  {cat:"Healthcare & Medical",icon:"🏥",items:["Comprehensive health insurance","Affordable medical treatment facilities","Emergency medical assistance funds","Mental health counseling & stress management","Dental and vision coverage"]},
  {cat:"Court Infrastructure",icon:"🏛️",items:["Modern professionally designed bar rooms","High-speed Wi-Fi & digital infrastructure","Modern libraries with e-legal databases","Rest & wellness areas for advocates","Secure document storage facilities"]},
  {cat:"Housing & Social Dignity",icon:"🏠",items:["Protection against social discrimination","Housing schemes & financial support","Official recognition of legal profession dignity","Legal safeguards against unfair discrimination","Advocate welfare colonies in metro cities"]},
  {cat:"Support for Women Advocates",icon:"⚖️",items:["Safe working environments in courts","Maternity support & childcare facilities","Grievance redressal for workplace harassment","Equal professional opportunities","Leadership development for women advocates"]},
  {cat:"Technology & Modernization",icon:"💻",items:["Digitization of court & advocate systems","Training on e-filing & virtual hearings","Affordable legal software access","Digital networking platforms for advocates","Online case management systems"]},
  {cat:"Mental Wellness",icon:"🧠",items:["Stress-management workshops","Psychological counseling support","Burnout & depression awareness campaigns","Reduce exploitation of junior advocates","Peer support programs"]},
  {cat:"Policy & Institutional Reforms",icon:"📋",items:["Stronger advocate welfare boards","Increased government funding","Young advocate representation in policy","Regular surveys on working conditions","Independent ombudsman for advocates"]}
];

// ── BUILD ACCORDION ───────────────────
function buildAccordion(){
  const el=document.getElementById('accordion');
  if(!el)return;
  el.innerHTML=DEMANDS.map((d,i)=>`
    <div class="accordion-item" id="acc${i}">
      <div class="accordion-head" onclick="toggleAcc(${i})">
        <span class="acc-icon">${d.icon}</span>
        <span class="acc-title">${d.cat}</span>
        <span class="acc-count">${d.items.length} demands</span>
        <span class="acc-arrow" id="arr${i}">▼</span>
      </div>
      <div class="accordion-body">
        ${d.items.map(it=>`<div class="demand-item"><span class="demand-diamond">◆</span><span class="demand-text">${it}</span></div>`).join('')}
      </div>
    </div>`).join('');
}
function toggleAcc(i){
  const el=document.getElementById('acc'+i);
  const arr=document.getElementById('arr'+i);
  const open=el.classList.toggle('open');
  arr.textContent=open?'▲':'▼';
}

// ── TABS ──────────────────────────────
function showTab(id,el){
  document.querySelectorAll('.tab').forEach(t=>t.classList.remove('active'));
  document.querySelectorAll('.nav-link').forEach(l=>l.classList.remove('active'));
  const sec=document.getElementById(id);
  if(sec)sec.classList.add('active');
  if(el)el.classList.add('active');
  else{const lk=document.querySelector('.nav-link[onclick*=\"'+id+'\"]');if(lk)lk.classList.add('active');}
  if(id==='demands')buildAccordion();
  closeNav();
}
function showDemand(i){
  showTab('demands',null);
  setTimeout(()=>toggleAcc(i),60);
}

// ── HAMBURGER ────────────────────────
document.getElementById('hamburger').addEventListener('click',()=>{
  document.getElementById('navLinks').classList.toggle('open');
});
function closeNav(){document.getElementById('navLinks').classList.remove('open');}

// ── FORM ─────────────────────────────
let formStep=1;const totalSteps=4;
const initialFormData={fullName:'',dob:'',gender:'',memberType:'',barCouncilNo:'',enrollmentYear:'',court:'',state:'',city:'',specialization:'',experience:'',seniorAdvocate:'',phone:'',email:'',address:'',pincode:'',nominee:'',relationship:'',declaration:false};
const formData={...initialFormData};
const formErrors={};
let isSubmitting=false;

function openForm(){formStep=1;renderForm();document.getElementById('formModal').style.display='flex';}
function closeForm(){document.getElementById('formModal').style.display='none';}
function closeSuccess(){document.getElementById('successModal').style.display='none';}

function renderStepBar(){
  const steps=['Personal','Professional','Contact','Declaration'];
  document.getElementById('stepBar').innerHTML=steps.map((s,i)=>`
    <div class="step-seg">
      <div class="step-line ${i+1<=formStep?'done':'idle'}"></div>
      <div class="step-label ${i+1===formStep?'active':''}">${s}</div>
    </div>`).join('');
}

function inp(name){return`style="width:100%;background:#fff;border:1.5px solid ${formErrors[name]?'#C62828':'#DDD8CC'};border-radius:8px;padding:10px 14px;color:#1A1A2E;font-size:14px;box-sizing:border-box;font-family:inherit;outline:none"`;}
function field(label,name,type='text',opts){
  const errHtml=formErrors[name]?`<p class="field-err">${formErrors[name]}</p>`:'';
  let input='';
  if(opts){input=`<select name="${name}" onchange="fup('${name}',this.value)" ${inp(name).replace('style=','style=')}>
    <option value="">Select ${label}</option>
    ${opts.map(o=>`<option value="${o}" ${formData[name]===o?'selected':''}>${o}</option>`).join('')}
  </select>`;}
  else{input=`<input type="${type}" name="${name}" value="${formData[name]||''}" oninput="fup('${name}',this.value)" ${inp(name)}>`;}
  return`<div class="field">${errHtml?errHtml:''}<label>${label}</label>${input}</div>`;
}
function fup(k,v){formData[k]=v;delete formErrors[k];}

function renderForm(){
  renderStepBar();
  const b=document.getElementById('modalBody');
  if(formStep===1){
    b.innerHTML=`<p class="section-sub">Personal Information</p>
      ${field('Full Name (as per Bar Council records)','fullName')}
      <div class="two-fields">
        ${field('Date of Birth','dob','date')}
        ${field('Gender','gender','text',['Male','Female','Other'])}
      </div>
      ${field('Member Type','memberType','text',['Individual Advocate','Family Member','Junior Advocate','Senior Advocate'])}`;
  } else if(formStep===2){
    b.innerHTML=`<p class="section-sub">Professional Details</p>
      ${field('Bar Council Enrollment Number','barCouncilNo')}
      <div class="two-fields">
        ${field('Enrollment Year','enrollmentYear','number')}
        ${field('Years of Experience','experience','number')}
      </div>
      ${field('Primary Court of Practice','court')}
      <div class="two-fields">
        ${field('State','state')}
        ${field('City / District','city')}
      </div>
      ${field('Area of Specialization','specialization','text',['Constitutional Law','Criminal Law','Civil Law','Family Law','Corporate Law','Tax Law','Cyber Law','Environmental Law','Labour Law','Other'])}
      ${field('Name of Senior Advocate / Mentor (if applicable)','seniorAdvocate')}`;
  } else if(formStep===3){
    b.innerHTML=`<p class="section-sub">Contact & Address</p>
      <div class="two-fields">
        ${field('Mobile Number','phone','tel')}
        ${field('Email Address','email','email')}
      </div>
      ${field('Residential / Office Address','address')}
      ${field('PIN Code','pincode')}
      <div class="inner-box">
        <p class="inner-box-title">Nominee Details (for welfare benefits)</p>
        <div class="two-fields">
          ${field('Nominee Full Name','nominee')}
          ${field('Relationship','relationship','text',['Spouse','Father','Mother','Son','Daughter','Sibling','Other'])}
        </div>
      </div>`;
  } else {
    const summHtml=formData.fullName?`<div class="summary-box"><p class="summary-title">Application Summary</p><div class="summary-grid">
      ${[['Name',formData.fullName],['Bar Council No.',formData.barCouncilNo],['Court',formData.court],['State',formData.state],['Specialization',formData.specialization],['Phone',formData.phone]].filter(([,v])=>v).map(([k,v])=>`<div><span class="summary-key">${k}: </span><span class="summary-val">${v}</span></div>`).join('')}
    </div></div>`:'';
    b.innerHTML=`<p class="section-sub">Declaration & Undertaking</p>
      <div class="decl-scroll"><p>I hereby solemnly declare that:<br/><br/>
      <strong>1.</strong> The information provided is true, correct and complete. I am a practicing advocate duly enrolled with the Bar Council.<br/><br/>
      <strong>2.</strong> I agree to abide by the rules of the <strong>Advocate & Advocate Family Welfare Society (AAFWS)</strong> as amended from time to time.<br/><br/>
      <strong>3.</strong> I will inform the Society of any changes in my professional status or contact details.<br/><br/>
      <strong>4.</strong> I understand the Society reserves the right to accept or reject this application.<br/><br/>
      <strong>5.</strong> I consent to use of my information for Society administration and welfare program delivery.<br/><br/>
      <strong>6.</strong> False declaration may result in immediate termination of membership and forfeiture of all benefits.</p></div>
      ${summHtml}
      <label class="check-wrap">
        <input type="checkbox" id="declChk" ${formData.declaration?'checked':''} onchange="formData.declaration=this.checked;delete formErrors.declaration;renderFooter()">
        <span>I have read and accept the above declaration. I confirm all information is accurate and agree to be bound by the rules of AAFWS.</span>
      </label>
      ${formErrors.declaration?`<p class="field-err">${formErrors.declaration}</p>`:''}
    `;
  }
  renderFooter();
}

function renderFooter(){
  const f=document.getElementById('modalFooter');
  const back=formStep>1?`<button class="btn-back" onclick="prevStep()">← Back</button>`:'<div></div>';
  const submitLabel = isSubmitting ? 'Submitting...' : 'Submit Application ✓';
  const submitDisabled = isSubmitting ? 'disabled' : '';
  const next = formStep<totalSteps
    ? `<button class="btn-next" onclick="nextStep()">Next →</button>`
    : `<button class="btn-submit" ${submitDisabled} onclick="submitForm()">${submitLabel}</button>`;
  f.innerHTML = back + next;
}

function validate(){
  let ok=true;
  if(formStep===1){if(!formData.fullName.trim()){formErrors.fullName='Required';ok=false;}if(!formData.dob){formErrors.dob='Required';ok=false;}if(!formData.gender){formErrors.gender='Required';ok=false;}}
  if(formStep===2){if(!formData.barCouncilNo.trim()){formErrors.barCouncilNo='Required';ok=false;}if(!formData.enrollmentYear){formErrors.enrollmentYear='Required';ok=false;}if(!formData.court.trim()){formErrors.court='Required';ok=false;}if(!formData.state.trim()){formErrors.state='Required';ok=false;}}
  if(formStep===3){if(!formData.phone.trim()){formErrors.phone='Required';ok=false;}if(!formData.email.trim()){formErrors.email='Required';ok=false;}}
  if(formStep===4){if(!formData.declaration){formErrors.declaration='You must accept the declaration';ok=false;}}
  return ok;
}
function nextStep(){if(validate()){formStep++;renderForm();}else renderForm();}
function prevStep(){formStep--;renderForm();}
async function submitForm(){
  if(!validate()){
    renderForm();
    return;
  }

  isSubmitting=true;
  renderFooter();

  try {
    const response = await fetch('https://aawfs-backend.onrender.com/api/membership/apply', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    const result = await response.json();
    if(!response.ok){
      throw new Error(result.message || 'Submission failed. Please try again.');
    }

    closeForm();
    document.getElementById('refNum').textContent = result.referenceId || 'AAFWS-'+String(Date.now()).slice(-6);
    document.getElementById('successModal').style.display = 'flex';
    Object.assign(formData, initialFormData);
    formStep = 1;
    Object.keys(formErrors).forEach((key)=>delete formErrors[key]);
  } catch (error) {
    alert(error.message || 'Unable to submit application. Please try again.');
  } finally {
    isSubmitting=false;
    renderFooter();
  }
}