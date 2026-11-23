// ==========================================
// Omar Apps - الملف الرئيسي
// ==========================================
// كلمة مرور لوحة التحكم
const ADMIN_PASSWORD = "OmPa1357924680";

// ==========================================
// 1. تحميل التطبيقات
// ==========================================
// بنجيب التطبيقات المحفوظة من قبل (اللي ضفتها بضغطة زر)
// لو مفيش محفوظ، بنعرض التطبيقات الافتراضية من ملف apps.js
let apps = JSON.parse(localStorage.getItem('omar_apps') || 'null') || APPS;

// الشكاوى والاقتراحات والتعليقات
let complaints = JSON.parse(localStorage.getItem('omar_complaints') || '[]');
let suggestions = JSON.parse(localStorage.getItem('omar_suggestions') || '[]');
let comments = JSON.parse(localStorage.getItem('omar_comments') || '[]');

// متغيرات مؤقتة للتطبيق الجديد
let tempImage = "";
let tempApk = "";
let tempApkName = "";

// ==========================================
// 2. عرض التطبيقات في المتجر
// ==========================================
function renderApps(filter = '') {
  const g = document.getElementById('appsGrid');
  if (!g) return;
  g.innerHTML = '';

  let filtered = apps.filter(a => a.name.includes(filter));

  if (filtered.length === 0) {
    g.innerHTML = '<p style="grid-column:1/-1">😔 مفيش تطبيقات بالاسم ده<br>جرب تدور باسم تاني</p>';
    return;
  }

  filtered.forEach(a => {
    // تعليقات التطبيق ده بس
    let appComments = comments.filter(c => c.appId == a.id)
      .map(c => `<p style="text-align:right;background:rgba(255,255,255,.06);padding:8px;border-radius:8px"><b>${c.name}:</b> ${c.text}</p>`)
      .join('');

    g.innerHTML += `
    <div class="card">
      <img src="${a.image || 'https://via.placeholder.com/90/0B1E3A/FFFFFF?text=O'}"
           onerror="this.src='https://via.placeholder.com/90/0B1E3A/FFFFFF?text=O'"
           alt="${a.name}">
      <h3>${a.name}</h3>
      <p style="opacity:.8;font-size:14px">${a.category || ''} ${a.rating ? '⭐ ' + a.rating : ''} ${a.downloads ? '• 📥 ' + a.downloads : ''}</p>
      <p>${a.desc}</p>

      ${a.apk
        ? `<a class="btn" href="${a.apk}" download="${a.apkName || a.name + '.apk'}">📥 تحميل APK</a>`
        : `<button disabled>⏳ قريبا</button>`
      }

      <hr style="opacity:.2">
      <p style="text-align:right"><b>💬 تعليقات:</b></p>
      <input placeholder="اسمك" id="cname-${a.id}">
      <input placeholder="اكتب تعليقك..." id="ctext-${a.id}">
      <button onclick="addComment(${a.id})">إرسال تعليق</button>
      <div>${appComments}</div>
    </div>`;
  });
}

// حفظ التطبيقات
function saveApps() {
  localStorage.setItem('omar_apps', JSON.stringify(apps));
}

// ==========================================
// 3. التعليقات - لكل تطبيق صندوق خاص
// ==========================================
function addComment(id) {
  const n = document.getElementById('cname-' + id).value.trim() || 'زائر';
  const t = document.getElementById('ctext-' + id).value.trim();
  if (!t) return alert('اكتب تعليق الأول');
  comments.push({ appId: id, name: n, text: t, date: new Date().toLocaleString('ar-EG') });
  localStorage.setItem('omar_comments', JSON.stringify(comments));
  renderApps(document.getElementById('searchInput').value);
  alert('تم نشر تعليقك ✅');
}

// ==========================================
// 4. الشكاوى والاقتراحات
// ==========================================
function sendComplaint() {
  const n = document.getElementById('complaintName').value.trim() || 'زائر';
  const m = document.getElementById('complaintMsg').value.trim();
  if (!m) return alert('اكتب الشكوى الأول');
  complaints.push({ name: n, msg: m, date: new Date().toLocaleString('ar-EG') });
  localStorage.setItem('omar_complaints', JSON.stringify(complaints));
  document.getElementById('complaintMsg').value = '';
  alert('تم إرسال شكواك إلى المطور ✅');
}

function sendSuggestion() {
  const n = document.getElementById('suggestName').value.trim() || 'زائر';
  const m = document.getElementById('suggestMsg').value.trim();
  if (!m) return alert('اكتب الاقتراح الأول');
  suggestions.push({ name: n, msg: m, date: new Date().toLocaleString('ar-EG') });
  localStorage.setItem('omar_suggestions', JSON.stringify(suggestions));
  document.getElementById('suggestMsg').value = '';
  alert('تم إرسال اقتراحك ✅');
}

// ==========================================
// 5. لوحة التحكم - العنوان هو الزر السري
// ==========================================
document.getElementById('siteTitle').onclick = () => {
  document.getElementById('passwordModal').classList.remove('hidden');
};

function closeModal() {
  document.getElementById('passwordModal').classList.add('hidden');
  document.getElementById('adminPass').value = '';
  document.getElementById('passError').innerText = '';
}

function checkPassword() {
  const pass = document.getElementById('adminPass').value;
  if (pass === ADMIN_PASSWORD) {
    closeModal();
    openAdmin();
  } else {
    document.getElementById('passError').innerText = '❌ كلمة المرور خاطئة';
  }
}

function openAdmin() {
  document.getElementById('adminPanel').classList.remove('hidden');
  renderAdmin();
}

function closeAdmin() {
  document.getElementById('adminPanel').classList.add('hidden');
}

// عرض بيانات اللوحة
function renderAdmin() {
  document.getElementById('adminApps').innerHTML = apps.map(a =>
    `<p style="background:rgba(255,255,255,.06);padding:10px;border-radius:10px">
      <b>${a.name}</b> - ${a.apkName || 'بدون APK'}
      <button onclick="deleteApp(${a.id})" style="background:#ff4444">🗑️ حذف</button>
    </p>`
  ).join('') || 'لا يوجد تطبيقات';

  document.getElementById('adminComplaints').innerHTML =
    complaints.map((c, i) =>
      `<p style="background:rgba(255,255,255,.06);padding:10px;border-radius:10px">
        <b>${c.name}:</b> ${c.msg} <br><small>${c.date || ''}</small>
        <button onclick="deleteComplaint(${i})" style="background:#ff4444">حذف</button>
      </p>`
    ).join('') || 'لا يوجد شكاوى';

  document.getElementById('adminSuggestions').innerHTML =
    suggestions.map((s, i) =>
      `<p style="background:rgba(255,255,255,.06);padding:10px;border-radius:10px">
        <b>${s.name}:</b> ${s.msg} <br><small>${s.date || ''}</small>
        <button onclick="deleteSuggestion(${i})" style="background:#ff4444">حذف</button>
      </p>`
    ).join('') || 'لا يوجد اقتراحات';

  document.getElementById('adminComments').innerHTML =
    comments.map((c, i) => {
      let appName = (apps.find(a => a.id == c.appId) || {}).name || 'تطبيق محذوف';
      return `<p style="background:rgba(255,255,255,.06);padding:10px;border-radius:10px">
        <b>${c.name}</b> على <b>${appName}:</b> ${c.text}
        <button onclick="deleteComment(${i})" style="background:#ff4444">حذف</button>
      </p>`;
    }).join('') || 'لا يوجد تعليقات';
}

// حذف من اللوحة
function deleteApp(id) {
  if (!confirm('متأكد عايز تحذف التطبيق ده؟')) return;
  apps = apps.filter(a => a.id != id);
  comments = comments.filter(c => c.appId != id);
  saveApps();
  localStorage.setItem('omar_comments', JSON.stringify(comments));
  renderApps(); renderAdmin();
}
function deleteComplaint(i) {
  complaints.splice(i, 1);
  localStorage.setItem('omar_complaints', JSON.stringify(complaints));
  renderAdmin();
}
function deleteSuggestion(i) {
  suggestions.splice(i, 1);
  localStorage.setItem('omar_suggestions', JSON.stringify(suggestions));
  renderAdmin();
}
function deleteComment(i) {
  comments.splice(i, 1);
  localStorage.setItem('omar_comments', JSON.stringify(comments));
  renderApps(); renderAdmin();
}

// ==========================================
// 6. إضافة تطبيق جديد بضغطة زر ⭐
// ==========================================
// قراءة الصورة عند اختيارها
document.getElementById('newAppImage').addEventListener('change', e => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    tempImage = reader.result;
    const prev = document.getElementById('previewImage');
    if (prev) { prev.src = tempImage; prev.style.display = 'block'; }
  };
  reader.readAsDataURL(file);
});

// ==========================================
// سحب وإفلات ملف APK - بضغطة واحدة
// ==========================================
const dropZone = document.getElementById('dropZone');
const apkInput = document.getElementById('newAppApk');

// لما تدوس على منطقة السحب، يفتح اختيار الملف
dropZone.addEventListener('click', () => apkInput.click());

// لما تسحب ملف فوق المنطقة، تتغير لونها
dropZone.addEventListener('dragover', (e) => {
  e.preventDefault();
  dropZone.style.background = 'rgba(30,144,255,.25)';
  dropZone.style.borderColor = '#7EC8FF';
});

// لما تخرج بالملف من المنطقة، ترجع زي ما كانت
dropZone.addEventListener('dragleave', () => {
  dropZone.style.background = 'rgba(30,144,255,.08)';
  dropZone.style.borderColor = '#1E90FF';
});

// لما ترمي الملف في المنطقة - هنا بيتحفظ
dropZone.addEventListener('drop', (e) => {
  e.preventDefault();
  dropZone.style.background = 'rgba(30,144,255,.08)';
  dropZone.style.borderColor = '#1E90FF';
  const file = e.dataTransfer.files[0];
  if (file) handleApkFile(file);
});

// لما تختار الملف بالضغط
apkInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file) handleApkFile(file);
});

// دالة واحدة بتتعامل مع الملف سواء سحب أو ضغط
function handleApkFile(file) {
  if (!file.name.endsWith('.apk')) {
    return alert('❌ اختار ملف APK بس');
  }
  tempApkName = file.name;
  document.getElementById('apkInfo').innerText =
    '✅ ' + file.name + ' - ' + (file.size / 1024 / 1024).toFixed(2) + ' MB - جاهز للحفظ';

  const reader = new FileReader();
  reader.onload = () => { tempApk = reader.result; };
  reader.readAsDataURL(file);
}
  const file = e.target.files[0];
  if (!file) return;
  tempApkName = file.name;
  document.getElementById('apkInfo').innerText =
    file.name + ' - ' + (file.size / 1024 / 1024).toFixed(2) + ' MB';
  const reader = new FileReader();
  reader.onload = () => { tempApk = reader.result; };
  reader.readAsDataURL(file);
});

// دالة الإضافة
function addApp() {
  const name = document.getElementById('newAppName').value.trim();
  const desc = document.getElementById('newAppDesc').value.trim();
  if (!name) return alert('اكتب اسم التطبيق الأول');
  if (!desc) return alert('اكتب وصف التطبيق');

  apps.push({
    id: Date.now(),
    name: name,
    desc: desc,
    image: tempImage,
    apk: tempApk,
    apkName: tempApkName,
    category: "جديد",
    rating: 5.0,
    downloads: "0"
  });

  saveApps();
  renderApps();
  renderAdmin();

  // تصفير النموذج
  document.getElementById('newAppName').value = '';
  document.getElementById('newAppDesc').value = '';
  document.getElementById('newAppImage').value = '';
  document.getElementById('newAppApk').value = '';
  document.getElementById('apkInfo').innerText = '';
  const prev = document.getElementById('previewImage');
  if (prev) prev.style.display = 'none';
  tempImage = ''; tempApk = ''; tempApkName = '';

  alert('تمت إضافة التطبيق ✅\n\nمهم: ارفع ملف الـ APK على 【entity-GitHub¦canonical_name=GitHub】 في مجلد assets/apks/ بنفس الاسم عشان يظهر لكل الناس');
}

// ==========================================
// 7. البحث + تشغيل الموقع
// ==========================================
document.getElementById('searchInput').addEventListener('input', e => {
  renderApps(e.target.value);
});

// اضغط Enter في خانة كلمة المرور للدخول
document.getElementById('adminPass').addEventListener('keypress', e => {
  if (e.key === 'Enter') checkPassword();
});

// أول تشغيل
renderApps();