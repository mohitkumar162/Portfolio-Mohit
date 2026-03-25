async function formSuccess(e) {
  e.preventDefault();
  const form = document.getElementById('cf');
  const data = new FormData(form);
  const res = await fetch(form.action, {
    method: 'POST',
    body: data,
    headers: { Accept: 'application/json' }
  });
  if (res.ok) {
    form.reset();
    const ok = document.getElementById('cf-ok');
    ok.style.display = 'block';
    setTimeout(() => { ok.style.display = 'none'; }, 4000);
  }
}