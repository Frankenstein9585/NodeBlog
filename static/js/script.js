document.addEventListener('DOMContentLoaded', () => {
   const allButtons = document.querySelectorAll('.searchBtn');
   console.log(allButtons);
   const searchBar = document.querySelector('.searchBar');
   const searchInput = document.getElementById('searchInput');
   const closeBtn = document.getElementById('searchClose');

    for (let i = 0; i < allButtons.length; i++) {
        allButtons[i].addEventListener('click', (e) => {
            searchBar.style.visibility = 'visible';
            searchBar.classList.add('open');
            e.target.setAttribute('aria-expanded', 'true');
            searchInput.focus();
        });

        closeBtn.addEventListener('click', (e) => {
            searchBar.style.visibility = 'hidden';
            searchBar.classList.remove('open');
            e.target.setAttribute('aria-expanded', 'false');
        });
    }


});