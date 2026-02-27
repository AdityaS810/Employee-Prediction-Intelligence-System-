document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('loginForm');
  const roleTitle = document.getElementById('roleTitle');
  const errorEl = document.getElementById('error');
  const roleTabs = document.querySelectorAll('.role-tab');

  let currentRole = form && form.dataset.role ? form.dataset.role : 'hr';
  if (form) form.dataset.role = currentRole;

  roleTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      roleTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      currentRole = tab.dataset.role;
      if (form) form.dataset.role = currentRole;
      if (roleTitle) roleTitle.innerText = currentRole === 'hr' ? 'HR LOGIN' : 'EMPLOYEE LOGIN';
      if (errorEl) errorEl.innerText = '';
    });
  });

  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!errorEl) return;
    errorEl.innerText = '';
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const remember = document.getElementById('remember') ? document.getElementById('remember').checked : false;

    if (!username || !password) {
      errorEl.innerText = 'Please enter username and password';
      return;
    }

    try {
      const resp = await authenticate(currentRole, username, password);
      if (resp.ok) {
        setSession({ role: currentRole, username }, remember);
        window.location.href = resp.redirect;
      } else {
        errorEl.innerText = resp.message || 'Invalid Username or Password';
      }
    } catch (err) {
      errorEl.innerText = 'An error occurred. Please try again.';
    }
  });
});