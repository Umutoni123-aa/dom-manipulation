  //  HELPERS 
  function showToast(msg) {
    const toast = document.getElementById('toast');
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2400);
  }

  //  1. NAVIGATION LINK HIGHLIGHT 
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function (e) {
      // Don't mark dropdown children as top-level active
      if (this.closest('.dropdown-menu')) return;
      document.querySelectorAll('.nav-links > li > a.nav-link').forEach(l => l.classList.remove('active'));
      this.classList.add('active');
    });
  });

  //  2. DROPDOWN MENU 
  const programsToggle = document.getElementById('programs-toggle');
  const programsDropdown = document.getElementById('programs-dropdown');

  programsToggle.addEventListener('click', function (e) {
    e.stopPropagation();
    programsDropdown.classList.toggle('open');
  });

  document.addEventListener('click', function () {
    programsDropdown.classList.remove('open');
  });

  programsDropdown.addEventListener('click', function (e) {
    e.stopPropagation();
  });

  //  3. HAMBURGER MENU
  const hamburger = document.getElementById('hamburger');
   
const mobileMenu = document.getElementById('mobile-menu');


  hamburger.addEventListener('click', function () {
    this.classList.toggle('open');
    mobileMenu.classList.toggle('open');
  });

  //  4. TEXT MANIPULATION 
  const quotes = [
    ' "The only bad workout is the one that didn\'t happen. Lace up and go!"',
    ' "Your body can stand almost anything. It\'s your mind you have to convince."',
    ' "Success is usually the culmination of controlling failure. — Sylvester Stallone"',
    ' "Train insane or remain the same. Push your limits every single day!"',
    ' "The pain you feel today will be the strength you feel tomorrow."',
    ' "Champions aren\'t made in gyms. They are made from something deep inside them."',
    ' "Every workout is progress. Every rep counts. Never stop. Never quit."',
  ];
  let quoteIndex = 0;
  const defaultQuote = quotes[0];
  const motivationText = document.getElementById('motivation-text');

  document.getElementById('btn-new-quote').addEventListener('click', function () {
    quoteIndex = (quoteIndex + 1) % quotes.length;
    motivationText.style.opacity = '0';
    setTimeout(() => {
      motivationText.textContent = quotes[quoteIndex];
      motivationText.style.opacity = '1';
    }, 200);
  });

  document.getElementById('btn-reset-quote').addEventListener('click', function () {
    motivationText.style.opacity = '0';
    setTimeout(() => {
      motivationText.textContent = defaultQuote;
      quoteIndex = 0;
      motivationText.style.opacity = '1';
    }, 200);
  });

  //  5. LIGHT / DARK MODE 
  const themeToggle = document.getElementById('theme-toggle');
  const html = document.documentElement;

  themeToggle.addEventListener('click', function () {
    const isDark = html.getAttribute('data-theme') === 'dark';
    html.setAttribute('data-theme', isDark ? 'light' : 'dark');
    this.textContent = isDark ? '🌙' : '☀️';
  });

  //  6. INPUT AND DISPLAY
  const goalInput = document.getElementById('goal-input');
  const displayOutput = document.getElementById('display-output');

  document.getElementById('btn-set-goal').addEventListener('click', function () {
    const val = goalInput.value.trim();
    if (!val) { showToast(' Please enter a goal first!'); return; }
    displayOutput.textContent = ' Today\'s Goal: ' + val;
    displayOutput.style.display = 'block';
    showToast(' Goal set!');
  });

  document.getElementById('btn-clear-goal').addEventListener('click', function () {
    goalInput.value = '';
    displayOutput.style.display = 'none';
  });

  goalInput.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') document.getElementById('btn-set-goal').click();
  });

  //  7 & 8. DYNAMIC LIST + REMOVAL 
  const activityList = document.getElementById('activity-list');
  const listInput = document.getElementById('list-input');
  const listEmpty = document.getElementById('list-empty');

  function createListItem(text) {
    const li = document.createElement('li');
    li.setAttribute('data-value', text);
    li.innerHTML = text + ' <span class="remove-hint">click to remove</span>';
    li.addEventListener('click', function () {
      this.style.transform = 'translateX(10px)';
      this.style.opacity = '0';
      setTimeout(() => {
        this.remove();
        checkEmpty();
        showToast(' Removed: ' + text);
      }, 200);
    });
    return li;
  }

  // Attach click to existing items
  activityList.querySelectorAll('li').forEach(li => {
    const text = li.getAttribute('data-value');
    li.addEventListener('click', function () {
      this.style.transform = 'translateX(10px)';
      this.style.opacity = '0';
      setTimeout(() => { this.remove(); checkEmpty(); }, 200);
    });
  });

  function checkEmpty() {
    const visible = activityList.querySelectorAll('li:not([style*="display: none"])');
    listEmpty.style.display = visible.length === 0 ? 'block' : 'none';
  }

  document.getElementById('btn-add-item').addEventListener('click', function () {
    const val = listInput.value.trim();
    if (!val) { showToast(' Type something to add!'); return; }
    activityList.appendChild(createListItem(val));
    listInput.value = '';
    document.getElementById('search-input').value = '';
    filterList('');
    checkEmpty();
    showToast(' Added: ' + val);
  });

  listInput.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') document.getElementById('btn-add-item').click();
  });

  //  9. SEARCH / FILTER 
  function filterList(query) {
    const q = query.toLowerCase();
    const items = activityList.querySelectorAll('li');
    let visibleCount = 0;
    items.forEach(li => {
      const text = li.getAttribute('data-value').toLowerCase();
      const match = text.includes(q);
      li.style.display = match ? '' : 'none';
      if (match) visibleCount++;
    });
    listEmpty.style.display = visibleCount === 0 ? 'block' : 'none';
  }

  document.getElementById('search-input').addEventListener('input', function () {
    filterList(this.value.trim());
  });

  //  10. ACTIVITY CARDS
  const selectedList = document.getElementById('selected-list');
  const selectedEmpty = document.getElementById('selected-empty');
  const selectedItems = new Set();

  document.querySelectorAll('.btn-card').forEach(btn => {
    btn.addEventListener('click', function () {
      const activity = this.getAttribute('data-activity');

      // Add to workout list
      activityList.appendChild(createListItem(activity));
      document.getElementById('search-input').value = '';
      filterList('');
      checkEmpty();

      // Add to selected section
      if (!selectedItems.has(activity)) {
        selectedItems.add(activity);
        selectedEmpty.style.display = 'none';

        const tag = document.createElement('span');
        tag.className = 'selected-tag';
        tag.innerHTML = activity + ' <button title="Remove">✕</button>';
        tag.querySelector('button').addEventListener('click', function () {
          tag.remove();
          selectedItems.delete(activity);
          if (selectedItems.size === 0) selectedEmpty.style.display = 'inline';
        });
        selectedList.appendChild(tag);
      }

      // Mark button as added, then reset after 2 seconds
 
      const clickedBtn = this;
      clickedBtn.textContent = '✓ Added';
      clickedBtn.classList.add('added');
      clickedBtn.disabled = true;
      setTimeout(() => {
        clickedBtn.textContent = '+ Add to List';
        clickedBtn.classList.remove('added');
        clickedBtn.disabled = false;
    }, 2000);

showToast(activity + ' added to your list!');
    });
  });

  //  HERO BUTTONS
  document.getElementById('hero-start-btn').addEventListener('click', function () {
    document.getElementById('goal-input').focus();
    document.querySelector('main section:nth-child(3)').scrollIntoView({ behavior: 'smooth' });
  });

  document.getElementById('hero-explore-btn').addEventListener('click', function () {
    document.getElementById('cards-grid').scrollIntoView({ behavior: 'smooth' });
  });