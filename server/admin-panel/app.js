const $ = (id) => document.getElementById(id);

function showMsg(el, text, isError) {
  el.textContent = text;
  el.classList.remove('hidden', 'error', 'success');
  el.classList.add(isError ? 'error' : 'success');
}

async function api(path, options = {}) {
  const res = await fetch(path, { credentials: 'same-origin', ...options });
  if (res.status === 401) {
    window.location.href = '/admin/login.html';
    throw new Error('Not authenticated');
  }
  return res;
}

// ---------- Logout ----------

$('logout-btn').addEventListener('click', async () => {
  await api('/admin/auth/logout', { method: 'POST' });
  window.location.href = '/admin/login.html';
});

// ---------- Profile ----------

async function loadProfile() {
  const res = await api('/admin/api/profile');
  const data = await res.json();
  $('name').value = data.name || '';
  $('bio').value = data.bio || '';
  if (data.homePhoto) {
    $('home-photo-preview').src = data.homePhoto;
    $('home-photo-preview').classList.remove('hidden');
  }
  if (data.aboutPhoto) {
    $('about-photo-preview').src = data.aboutPhoto;
    $('about-photo-preview').classList.remove('hidden');
  }
}

$('home-photo').addEventListener('change', () => {
  const file = $('home-photo').files[0];
  if (!file) return;
  $('home-photo-preview').src = URL.createObjectURL(file);
  $('home-photo-preview').classList.remove('hidden');
});

$('about-photo').addEventListener('change', () => {
  const file = $('about-photo').files[0];
  if (!file) return;
  $('about-photo-preview').src = URL.createObjectURL(file);
  $('about-photo-preview').classList.remove('hidden');
});

$('profile-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const msg = $('profile-msg');
  const formData = new FormData();
  formData.append('name', $('name').value);
  formData.append('bio', $('bio').value);
  if ($('home-photo').files[0]) formData.append('homePhoto', $('home-photo').files[0]);
  if ($('about-photo').files[0]) formData.append('aboutPhoto', $('about-photo').files[0]);

  const res = await api('/admin/api/profile', { method: 'PUT', body: formData });
  if (res.ok) {
    showMsg(msg, 'Profile saved.', false);
    $('home-photo').value = '';
    $('about-photo').value = '';
  } else {
    const data = await res.json().catch(() => ({}));
    showMsg(msg, data.error || 'Failed to save profile', true);
  }
});

// ---------- Projects ----------

let editingId = null;

function resetProjectForm() {
  editingId = null;
  $('project-form').reset();
  $('project-id').value = '';
  $('project-image-preview').classList.add('hidden');
  $('project-form-title').textContent = 'Add project';
  $('project-submit-btn').textContent = 'Add project';
  $('project-cancel-btn').classList.add('hidden');
}

$('project-cancel-btn').addEventListener('click', resetProjectForm);

$('image').addEventListener('change', () => {
  const file = $('image').files[0];
  if (!file) return;
  $('project-image-preview').src = URL.createObjectURL(file);
  $('project-image-preview').classList.remove('hidden');
});

$('project-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const msg = $('project-msg');

  const formData = new FormData();
  formData.append('title', $('title').value);
  formData.append('description', $('description').value);
  formData.append('link', $('link').value);
  formData.append(
    'tags',
    JSON.stringify(
      $('tags').value.split(',').map((t) => t.trim()).filter(Boolean)
    )
  );
  if ($('image').files[0]) formData.append('image', $('image').files[0]);

  const url = editingId ? `/admin/api/projects/${editingId}` : '/admin/api/projects';
  const method = editingId ? 'PUT' : 'POST';

  const res = await api(url, { method, body: formData });
  if (res.ok) {
    showMsg(msg, editingId ? 'Project updated.' : 'Project added.', false);
    resetProjectForm();
    loadProjects();
  } else {
    const data = await res.json().catch(() => ({}));
    showMsg(msg, data.error || 'Failed to save project', true);
  }
});

function startEdit(project) {
  editingId = project.id;
  $('project-id').value = project.id;
  $('title').value = project.title;
  $('description').value = project.description || '';
  $('link').value = project.link || '';
  $('tags').value = (project.tags || []).join(', ');
  $('image').value = '';
  if (project.image) {
    $('project-image-preview').src = project.image;
    $('project-image-preview').classList.remove('hidden');
  } else {
    $('project-image-preview').classList.add('hidden');
  }
  $('project-form-title').textContent = `Edit: ${project.title}`;
  $('project-submit-btn').textContent = 'Save changes';
  $('project-cancel-btn').classList.remove('hidden');
  $('project-form').scrollIntoView({ behavior: 'smooth' });
}

async function deleteProject(id) {
  if (!confirm('Delete this project? This cannot be undone.')) return;
  const res = await api(`/admin/api/projects/${id}`, { method: 'DELETE' });
  if (res.ok) loadProjects();
}

async function reorderProject(id, direction) {
  await api(`/admin/api/projects/${id}/reorder`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ direction }),
  });
  loadProjects();
}

async function loadProjects() {
  const res = await api('/admin/api/projects');
  const projects = await res.json();
  const list = $('project-list');
  list.innerHTML = '';

  projects.forEach((project, idx) => {
    const li = document.createElement('li');
    li.className = 'project-item';

    const img = document.createElement('img');
    img.src = project.image || '';
    img.alt = '';
    li.appendChild(img);

    const body = document.createElement('div');
    body.className = 'body';

    const h3 = document.createElement('h3');
    h3.textContent = project.title;
    body.appendChild(h3);

    const p = document.createElement('p');
    p.textContent = project.description || '';
    body.appendChild(p);

    (project.tags || []).forEach((tag) => {
      const span = document.createElement('span');
      span.className = 'tag';
      span.textContent = tag;
      body.appendChild(span);
    });
    li.appendChild(body);

    const actions = document.createElement('div');
    actions.className = 'actions';

    const upBtn = document.createElement('button');
    upBtn.className = 'btn btn-secondary btn-icon';
    upBtn.textContent = '↑';
    upBtn.disabled = idx === 0;
    upBtn.onclick = () => reorderProject(project.id, 'up');
    actions.appendChild(upBtn);

    const downBtn = document.createElement('button');
    downBtn.className = 'btn btn-secondary btn-icon';
    downBtn.textContent = '↓';
    downBtn.disabled = idx === projects.length - 1;
    downBtn.onclick = () => reorderProject(project.id, 'down');
    actions.appendChild(downBtn);

    const editBtn = document.createElement('button');
    editBtn.className = 'btn btn-secondary btn-icon';
    editBtn.textContent = 'Edit';
    editBtn.onclick = () => startEdit(project);
    actions.appendChild(editBtn);

    const delBtn = document.createElement('button');
    delBtn.className = 'btn btn-danger btn-icon';
    delBtn.textContent = 'Delete';
    delBtn.onclick = () => deleteProject(project.id);
    actions.appendChild(delBtn);

    li.appendChild(actions);
    list.appendChild(li);
  });
}

loadProfile();
loadProjects();
