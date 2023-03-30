/* eslint-disable */
const confirmDelete = document.querySelector('.confirm-delete');
const overlay = document.querySelector('.overlay');
const deleteUser = document.querySelectorAll('.user__options__li--du');
const cancelBtn = document.querySelector('.btn--cancel');
const deleteBtn = document.querySelector('.btn--delete');
deleteUser.forEach((de) => {
  de.addEventListener('click', (e) => {
    deleteBtn.dataset.id = de.dataset.id;
    confirmDelete.classList.remove('hidden');
    overlay.classList.remove('hidden');
  });
});
overlay.addEventListener('click', () => {
  confirmDelete.classList.add('hidden');
  overlay.classList.add('hidden');
});
cancelBtn.addEventListener('click', () => {
  confirmDelete.classList.add('hidden');
  overlay.classList.add('hidden');
});
deleteBtn.addEventListener('click', (e) => {
  const id = e.target.dataset.id;
  document.getElementById(id).remove();
  deleteBtn.classList.remove(id);
  confirmDelete.classList.add('hidden');
  overlay.classList.add('hidden');
});
