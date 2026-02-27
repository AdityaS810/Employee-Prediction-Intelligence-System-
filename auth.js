// Simple mock authentication module for static demo
const mockStore = {
  hr: { username: 'admin', password: 'admin123', redirect: 'hr-dashboard.html' },
  employee: { username: 'employee', password: 'emp123', redirect: 'Dashboard/employee-dashboard.html' }
};

function authenticate(role, username, password) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const record = mockStore[role];
      if (record && username === record.username && password === record.password) {
        resolve({ ok: true, redirect: record.redirect });
      } else {
        resolve({ ok: false, message: 'Invalid username or password' });
      }
    }, 250);
  });
}

function setSession(session, remember) {
  if (remember) {
    localStorage.setItem('epis_session', JSON.stringify(session));
  } else {
    sessionStorage.setItem('epis_session', JSON.stringify(session));
  }
}

function getSession() {
  const s = sessionStorage.getItem('epis_session') || localStorage.getItem('epis_session');
  return s ? JSON.parse(s) : null;
}

function clearSession() {
  sessionStorage.removeItem('epis_session');
  localStorage.removeItem('epis_session');
}

function requireAuth(allowedRole) {
  const s = getSession();
  if (!s || (allowedRole && s.role !== allowedRole)) {
    window.location.href = 'HR Login.html';
  }
}
