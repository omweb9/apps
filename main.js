// ==========================================
// Omar Apps - main.js - نسخة كاملة ومصلحة
// ==========================================

const ADMIN_PASSWORD = "OmPa1357924680";

// لو ملف apps.js مش موجود، اعمل تطبيقات افتراضية
// مهم: بنستخدم window.APPS مش var APPS عشان ميحصلش تكرار
if (typeof APPS === 'undefined') {
  window.APPS = [
    { id: 1, name: "تطبيق عمر 1", desc: "وصف التطبيق الأول", image: "", apk: "", apkName: "" }
  ];
}

let apps = [];
try {
  apps = JSON.parse(localStorage.getItem('omar_apps') || 'null') || APPS;
} catch(e) { apps = APPS; }

let complaints = [];
let suggestions = [];
let comments = [];
try {
  complaints = JSON.parse(localStorage.getItem('omar_complaints') || '[]');
  suggestions = JSON.parse(localStorage.getItem('omar_suggestions') || '[]');
  comments = JSON.parse(localStorage.getItem('omar_comments') || '[]');
} catch(e) {}

let tempImage = "";
let tempApk = "";
let tempApkName = "";

function $(id){ return document.getElementById(id); }

// ============ عرض التطبيقات ============
function renderApps(filter){
  filter = filter || '';
  let g = $('appsGrid');
  if(!g) return;
  g.innerHTML = '';
  let filtered = apps.filter(function(a){ return a.name.indexOf(filter) !== -1; });
  if(filtered.length === 0){
    g.innerHTML = '<p>لسه مفيش تطبيقات - ضيف أول تطبيق من لوحة التحكم</p>';
    return;
  }
  filtered.forEach(function(a){
    let appComments = comments.filter(function(c){ return c.appId == a.id; })
      .map(function(c){ return '<p style="text-align:right;background:rgba(255,255,255,.06);padding:8px;border-radius:8px"><b>'+c.name+':</b> '+c.text+'</p>'; }).join('');
    g.innerHTML += '<div class="card">'
      + '<img src="'+(a.image || 'https://via.placeholder.com/90')+'" onerror="this.src=\'https://via.placeholder.com/90\'">'
      + '<h3>'+a.name+'</h3><p>'+a.desc+'</p>'
      + (a.apk ? '<a class="btn" href="'+a.apk+'" download="'+(a.apkName || a.name+'.apk')+'">📥 تحميل APK</a>' : '<button disabled>⏳ قريبا</button>')
      + '<input placeholder="اسمك" id="cname-'+a.id+'">'
      + '<input placeholder="اكتب تعليقك..." id="ctext-'+a.id+'">'
      + '<button onclick="addComment('+a.id+')">إرسال تعليق</button>'
      + '<div>'+appComments+'</div></div>';
  });
}

function saveApps(){
  try{ localStorage.setItem('omar_apps', JSON.stringify(apps)); }catch(e){}
}

// ============ تعليق ============
function addComment(id){
  let n = $('cname-'+id).value.trim() || 'زائر';
  let t = $('ctext-'+id).value.trim();
  if(!t) return alert('اكتب تعليق الأول');
  comments.push({appId:id, name:n, text:t});
  try{ localStorage.setItem('omar_comments', JSON.stringify(comments)); }catch(e){}
  renderApps($('searchInput') ? $('searchInput').value : '');
  alert('تم نشر تعليقك ✅');
}

// ============ شكوى ============
function sendComplaint(){
  let nameEl = $('complaintName');
  let msgEl = $('complaintMsg');
  if(!msgEl) return alert('عنصر الشكوى مش موجود');
  let m = msgEl.value.trim();
  if(!m) return alert('اكتب الشكوى الأول');
  complaints.push({name: nameEl ? (nameEl.value.trim() || 'زائر') : 'زائر', msg:m, date:new Date().toLocaleString('ar-EG')});
  try{ localStorage.setItem('omar_complaints', JSON.stringify(complaints)); }catch(e){}
  msgEl.value = '';
  alert('تم إرسال شكواك إلى المطور ✅');
}

// ============ اقتراح ============
function sendSuggestion(){
  let nameEl = $('suggestName');
  let msgEl = $('suggestMsg');
  if(!msgEl) return alert('عنصر الاقتراح مش موجود');
  let m = msgEl.value.trim();
  if(!m) return alert('اكتب الاقتراح الأول');
  suggestions.push({name: nameEl ? (nameEl.value.trim() || 'زائر') : 'زائر', msg:m, date:new Date().toLocaleString('ar-EG')});
  try{ localStorage.setItem('omar_suggestions', JSON.stringify(suggestions)); }catch(e){}
  msgEl.value = '';
  alert('تم إرسال اقتراحك ✅');
}

// ============ لوحة التحكم ============
function openPasswordModal(){
  let m = $('passwordModal');
  if(m) m.classList.remove('hidden');
  else alert('نافذة كلمة المرور مش موجودة');
}
function closeModal(){
  let m = $('passwordModal');
  if(m) m.classList.add('hidden');
  if($('adminPass')) $('adminPass').value = '';
  if($('passError')) $('passError').innerText = '';
}
function checkPassword(){
  let pass = $('adminPass') ? $('adminPass').value : '';
  if(pass === ADMIN_PASSWORD){
    closeModal();
    openAdmin();
  } else {
    if($('passError')) $('passError').innerText = '❌ كلمة المرور خاطئة';
    else alert('كلمة المرور خاطئة');
  }
}
function openAdmin(){
  let p = $('adminPanel');
  if(p) p.classList.remove('hidden');
  renderAdmin();
}
function closeAdmin(){
  let p = $('adminPanel');
  if(p) p.classList.add('hidden');
}

function renderAdmin(){
  if($('adminApps')) $('adminApps').innerHTML = apps.map(function(a){
    return '<p><b>'+a.name+'</b> - '+(a.apkName || 'بدون APK')+' <button onclick="deleteApp('+a.id+')" style="background:#ff4444">حذف</button></p>';
  }).join('') || 'لا يوجد';
  if($('adminComplaints')) $('adminComplaints').innerHTML = complaints.map(function(c,i){
    return '<p><b>'+c.name+':</b> '+c.msg+' <button onclick="deleteComplaint('+i+')" style="background:#ff4444">حذف</button></p>';
  }).join('') || 'لا يوجد شكاوى';
  if($('adminSuggestions')) $('adminSuggestions').innerHTML = suggestions.map(function(s,i){
    return '<p><b>'+s.name+':</b> '+s.msg+' <button onclick="deleteSuggestion('+i+')" style="background:#ff4444">حذف</button></p>';
  }).join('') || 'لا يوجد اقتراحات';
  if($('adminComments')) $('adminComments').innerHTML = comments.map(function(c,i){
    return '<p>'+c.name+': '+c.text+' <button onclick="deleteComment('+i+')" style="background:#ff4444">حذف</button></p>';
  }).join('') || 'لا يوجد تعليقات';
}

function deleteApp(id){
  if(!confirm('متأكد عايز تحذف التطبيق ده؟')) return;
  apps = apps.filter(function(a){ return a.id != id; });
  saveApps(); renderApps(); renderAdmin();
}
function deleteComplaint(i){ complaints.splice(i,1); try{localStorage.setItem('omar_complaints', JSON.stringify(complaints));}catch(e){} renderAdmin(); }
function deleteSuggestion(i){ suggestions.splice(i,1); try{localStorage.setItem('omar_suggestions', JSON.stringify(suggestions));}catch(e){} renderAdmin(); }
function deleteComment(i){ comments.splice(i,1); try{localStorage.setItem('omar_comments', JSON.stringify(comments));}catch(e){} renderApps(); renderAdmin(); }

// ============ إضافة تطبيق - سحب وإفلات ============
function handleApkFile(file){
  if(!file.name.endsWith('.apk')) return alert('❌ اختار ملف APK بس');
  tempApkName = file.name;
  if($('apkInfo')) $('apkInfo').innerText = '✅ ' + file.name + ' - ' + (file.size/1024/1024).toFixed(2) + ' MB - جاهز للحفظ';
  let reader = new FileReader();
  reader.onload = function(){ tempApk = reader.result; };
  reader.readAsDataURL(file);
}

function addApp(){
  let name = $('newAppName') ? $('newAppName').value.trim() : '';
  let desc = $('newAppDesc') ? $('newAppDesc').value.trim() : '';
  if(!name) return alert('اكتب اسم التطبيق الأول');
  if(!desc) return alert('اكتب وصف التطبيق');
  apps.push({id: Date.now(), name:name, desc:desc, image:tempImage, apk:tempApk, apkName:tempApkName});
  saveApps(); renderApps(); renderAdmin();
  if($('newAppName')) $('newAppName').value = '';
  if($('newAppDesc')) $('newAppDesc').value = '';
  if($('apkInfo')) $('apkInfo').innerText = '';
  tempImage=''; tempApk=''; tempApkName='';
  alert('تمت إضافة التطبيق ✅');
}

// ============ ربط الأحداث بعد تحميل الصفحة ============
document.addEventListener('DOMContentLoaded', function(){
  let title = $('siteTitle');
  if(title){ title.addEventListener('click', openPasswordModal); }

  let search = $('searchInput');
  if(search){ search.addEventListener('input', function(e){ renderApps(e.target.value); }); }

  let imgInput = $('newAppImage');
  if(imgInput){
    imgInput.addEventListener('change', function(e){
      let file = e.target.files[0];
      if(!file) return;
      let reader = new FileReader();
      reader.onload = function(){
        tempImage = reader.result;
        let prev = $('previewImage');
        if(prev){ prev.src = tempImage; prev.style.display = 'block'; }
      };
      reader.readAsDataURL(file);
    });
  }

  let dropZone = $('dropZone');
  let apkInput = $('newAppApk');
  if(dropZone && apkInput){
    dropZone.addEventListener('click', function(){ apkInput.click(); });
    dropZone.addEventListener('dragover', function(e){ e.preventDefault(); dropZone.style.background='rgba(30,144,255,.25)'; });
    dropZone.addEventListener('dragleave', function(){ dropZone.style.background='rgba(30,144,255,.08)'; });
    dropZone.addEventListener('drop', function(e){
      e.preventDefault();
      dropZone.style.background='rgba(30,144,255,.08)';
      let f = e.dataTransfer.files[0];
      if(f) handleApkFile(f);
    });
    apkInput.addEventListener('change', function(e){
      let f = e.target.files[0];
      if(f) handleApkFile(f);
    });
  }

  let passInput = $('adminPass');
  if(passInput){
    passInput.addEventListener('keypress', function(e){
      if(e.key === 'Enter') checkPassword();
    });
  }

  renderApps();
});

renderApps();
