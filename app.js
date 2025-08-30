const API = 'http://localhost:3000'; // بعدا روی هاست تغییر بده

async function sha256(str) {
  const buf = new TextEncoder().encode(str);
  const hash = await crypto.subtle.digest('SHA-256', buf);
  return Array.from(new Uint8Array(hash)).map(b=>b.toString(16).padStart(2,'0')).join('');
}

async function register() {
  const username = document.getElementById('reg_username').value;
  const password = document.getElementById('reg_password').value;
  const passwordHash = await sha256(password);
  const res = await fetch(API+'/register', {
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify({username,passwordHash})
  });
  if(res.ok){
    alert('ثبت‌نام موفق!');
    window.location='index.html';
  } else {
    alert('نام کاربری موجود است.');
  }
}

async function login() {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  const passwordHash = await sha256(password);
  const res = await fetch(API+'/login', {
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify({username,passwordHash})
  });
  if(res.ok){
    localStorage.setItem('user',username);
    window.location='chat.html';
  } else {
    alert('نام کاربری یا رمز عبور اشتباه است.');
  }
}

async function sendMessage() {
  const username = localStorage.getItem('user');
  const text = document.getElementById('msg').value;
  if(!text) return;
  await fetch(API+'/messages', {
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify({username,text})
  });
  document.getElementById('msg').value='';
  loadMessages();
}

async function loadMessages() {
  const res = await fetch(API+'/messages');
  const msgs = await res.json();
  const box = document.getElementById('messages');
  if(!box) return;
  box.innerHTML = msgs.map(m=>`<p><b>${m.username}</b>: ${m.text}</p>`).join('');
  box.scrollTop = box.scrollHeight;
}
function logout(){
  localStorage.removeItem('user');
  window.location='index.html';
}
setInterval(loadMessages,2000);
