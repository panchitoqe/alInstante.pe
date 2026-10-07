(() => {
  const whatsappNumber = '51947444869';
  const jobs = Array.isArray(window.JOB_LISTINGS) ? window.JOB_LISTINGS : [];
  const grid = document.querySelector('#jobs-grid');
  const searchInput = document.querySelector('#job-search');
  const categorySelect = document.querySelector('#job-category');
  const countLabel = document.querySelector('#jobs-count');
  const toast = document.querySelector('#toast');
  let toastTimeout;

  const escapeHTML = (value = '') => String(value).replace(/[&<>"']/g, (char) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'
  })[char]);
  const formatDate = (date) => {
    if (!date) return 'Convocatoria vigente';
    const parsed = new Date(`${date}T12:00:00`);
    return Number.isNaN(parsed.getTime()) ? escapeHTML(date) : new Intl.DateTimeFormat('es-PE', { day: 'numeric', month: 'short', year: 'numeric' }).format(parsed);
  };
  const slugify = (text = '') => text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const list = (items = []) => items.length ? `<ul>${items.map((item) => `<li>${escapeHTML(item)}</li>`).join('')}</ul>` : '<p>Consulta los detalles de esta convocatoria por WhatsApp.</p>';

  function openJob(job) {
    const slug = job.slug || slugify(job.puesto);
    const detail = document.querySelector('#job-detail');
    const applyText = job.contact || `Hola, deseo consultar por la convocatoria de ${job.puesto}.`;
    const wa = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(applyText)}`;
    detail.innerHTML = `<div class="detail-top"><span class="job-tag">${escapeHTML(job.sector || 'Oportunidad laboral')}</span><button class="modal-close" aria-label="Cerrar detalles">×</button></div><p class="detail-date">PUBLICADA ${formatDate(job.fecha)}</p><h2 id="job-modal-title">${escapeHTML(job.puesto)}</h2><p class="detail-company">${escapeHTML(job.empresa || 'Empresa')}</p><div class="detail-facts"><span>⌖ &nbsp;${escapeHTML(job.ubicacion || 'Arequipa')}</span><span>◷ &nbsp;${escapeHTML(job.horario || 'A tratar')}</span><span>◉ &nbsp;${escapeHTML(job.sueldo || 'A tratar')}</span><span>＋ &nbsp;${escapeHTML(job.vacantes || 'Vacantes por confirmar')}</span></div><div class="detail-columns"><div><h3>Requisitos</h3>${list(job.requisitos)}</div><div><h3>Beneficios</h3>${list(job.beneficios)}</div></div><div class="detail-actions"><a class="button button-lime" href="${wa}" target="_blank" rel="noreferrer">Consultar / postular <span class="arrow">↗</span></a><button class="share-button" data-share="${escapeHTML(slug)}">Compartir oferta ↗</button></div>`;
    detail.querySelector('.modal-close').addEventListener('click', closeJob);
    detail.querySelector('[data-share]').addEventListener('click', () => shareJob(job));
    document.querySelector('#job-modal').classList.add('is-open');
    document.body.classList.add('modal-open');
    history.replaceState(null, '', `#oferta-${slug}`);
  }

  function closeJob() {
    const modal = document.querySelector('#job-modal');
    if (!modal) return;
    modal.classList.remove('is-open');
    document.body.classList.remove('modal-open');
    if (location.hash.startsWith('#oferta-')) history.replaceState(null, '', `${location.pathname}${location.search}`);
  }

  async function shareJob(job) {
    const url = new URL(`${location.pathname}#oferta-${job.slug || slugify(job.puesto)}`, location.href).href;
    const data = { title: `${job.puesto} | Agencia Al Instante`, text: `Mira esta convocatoria en Arequipa: ${job.puesto}`, url };
    try {
      if (navigator.share) await navigator.share(data);
      else if (navigator.clipboard) { await navigator.clipboard.writeText(url); showToast('Enlace de la oferta copiado.'); }
      else window.prompt('Copia el enlace de esta oferta:', url);
    } catch (error) {
      if (error.name !== 'AbortError') showToast('No se pudo compartir el enlace.');
    }
  }

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add('is-visible');
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => toast.classList.remove('is-visible'), 3000);
  }

  function renderJobs() {
    const query = searchInput.value.trim().toLowerCase();
    const category = categorySelect.value;
    const filtered = jobs.filter((job) => {
      const searchable = [job.puesto, job.empresa, job.sector, job.ubicacion].join(' ').toLowerCase();
      return searchable.includes(query) && (!category || job.sector === category);
    });
    countLabel.textContent = jobs.length ? `${filtered.length} ${filtered.length === 1 ? 'convocatoria disponible' : 'convocatorias disponibles'}` : 'Nuevas oportunidades próximamente';
    if (!filtered.length) {
      const hasFilters = Boolean(query || category);
      grid.innerHTML = `<div class="empty-jobs"><div class="empty-graphic"><span>⌕</span><i></i><b></b></div><div><span class="empty-label">${hasFilters ? 'SIN RESULTADOS' : 'ESTAMOS PREPARANDO NUEVAS OPORTUNIDADES'}</span><h3>${hasFilters ? 'No encontramos coincidencias.' : 'Muy pronto, nuevas convocatorias.'}</h3><p>${hasFilters ? 'Prueba con otro puesto, ubicación o sector.' : 'Estamos organizando las ofertas para compartirte información clara y actualizada. Escríbenos y cuéntanos qué tipo de trabajo buscas.'}</p><a class="text-link" href="https://wa.me/${whatsappNumber}?text=${encodeURIComponent('Hola, estoy buscando trabajo en Arequipa. ¿Tienen convocatorias disponibles?')}" target="_blank" rel="noreferrer">${hasFilters ? 'Limpiar búsqueda' : 'Consultar por WhatsApp'} <span>↗</span></a></div></div>`;
      if (hasFilters) grid.querySelector('.text-link').addEventListener('click', (event) => { event.preventDefault(); searchInput.value = ''; categorySelect.value = ''; renderJobs(); });
      return;
    }
    grid.innerHTML = filtered.map((job) => `<article class="job-card"><div class="job-card-top"><span class="job-tag">${escapeHTML(job.sector || 'Oportunidad laboral')}</span><span class="job-date">${formatDate(job.fecha)}</span></div><h3>${escapeHTML(job.puesto)}</h3><p class="job-company">${escapeHTML(job.empresa || 'Empresa')}</p><div class="job-meta"><span>⌖ ${escapeHTML(job.ubicacion || 'Arequipa')}</span><span>◷ ${escapeHTML(job.horario || 'A tratar')}</span></div><div class="job-card-bottom"><span>${escapeHTML(job.sueldo || 'Sueldo a tratar')}</span><button class="job-view" data-job="${escapeHTML(job.slug || slugify(job.puesto))}">Ver detalles <b>↗</b></button></div></article>`).join('');
    grid.querySelectorAll('[data-job]').forEach((button) => button.addEventListener('click', () => openJob(jobs.find((job) => (job.slug || slugify(job.puesto)) === button.dataset.job))));
  }

  const categories = [...new Set(jobs.map((job) => job.sector).filter(Boolean))].sort();
  categories.forEach((category) => categorySelect.add(new Option(category, category)));
  searchInput.addEventListener('input', renderJobs);
  categorySelect.addEventListener('change', renderJobs);
  renderJobs();

  document.querySelector('#contact-form').addEventListener('submit', (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const message = [
      'Hola, Agencia de Empleos Al Instante. Quisiera hacer una consulta.',
      `*Necesito:* ${data.get('tipo')}`,
      `*Mi nombre:* ${data.get('nombre')}`,
      data.get('telefono') ? `*Mi teléfono:* ${data.get('telefono')}` : '',
      data.get('mensaje') ? `*Detalles:* ${data.get('mensaje')}` : ''
    ].filter(Boolean).join('\n');
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
  });

  document.querySelectorAll('[data-contact-type]').forEach((link) => link.addEventListener('click', () => {
    document.querySelector('#contact-type').value = 'Solicitar personal';
  }));

  const menuToggle = document.querySelector('.menu-toggle');
  menuToggle.addEventListener('click', () => {
    const open = menuToggle.getAttribute('aria-expanded') !== 'true';
    menuToggle.setAttribute('aria-expanded', String(open));
    document.querySelector('.main-nav').classList.toggle('nav-open', open);
    document.body.classList.toggle('menu-open', open);
  });
  document.querySelectorAll('.main-nav a').forEach((link) => link.addEventListener('click', () => {
    menuToggle.setAttribute('aria-expanded', 'false');
    document.querySelector('.main-nav').classList.remove('nav-open');
    document.body.classList.remove('menu-open');
  }));
  document.querySelector('#job-modal').addEventListener('click', (event) => { if (event.target.id === 'job-modal') closeJob(); });
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape') closeJob(); });
  document.querySelector('#year').textContent = new Date().getFullYear();

  const deepLink = decodeURIComponent(location.hash.replace('#oferta-', ''));
  if (location.hash.startsWith('#oferta-')) {
    const matchingJob = jobs.find((job) => (job.slug || slugify(job.puesto)) === deepLink);
    if (matchingJob) openJob(matchingJob);
  }
})();
