function filterPublications(type) {
  const items = document.querySelectorAll('.pub-item');
  const buttons = document.querySelectorAll('.filter-btn');
  buttons.forEach(btn => btn.classList.toggle('active', btn.dataset.filter === type));
  items.forEach(item => {
    if (type === 'all' || item.dataset.type === type) {
      item.style.display = '';
    } else {
      item.style.display = 'none';
    }
  });
}
