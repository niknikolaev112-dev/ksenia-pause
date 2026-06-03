/* ============================================================
   Pause — JS логика
   ============================================================ */

(function () {
  'use strict';

  /* --------------------------------------------------------
     1. Шапка: тень и более плотный фон при скролле
     -------------------------------------------------------- */
  const header = document.getElementById('header');

  if (header) {
    const SCROLL_THRESHOLD = 8;

    const updateHeader = () => {
      if (window.scrollY > SCROLL_THRESHOLD) {
        header.classList.add('is-scrolled');
      } else {
        header.classList.remove('is-scrolled');
      }
    };

    updateHeader();
    window.addEventListener('scroll', updateHeader, { passive: true });
  }

  /* --------------------------------------------------------
     2. Мобильное меню
     -------------------------------------------------------- */
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');

  if (hamburger && mobileMenu) {
    const closeMenu = () => {
      hamburger.setAttribute('aria-expanded', 'false');
      hamburger.setAttribute('aria-label', 'Открыть меню');
      mobileMenu.hidden = true;
    };

    const openMenu = () => {
      hamburger.setAttribute('aria-expanded', 'true');
      hamburger.setAttribute('aria-label', 'Закрыть меню');
      mobileMenu.hidden = false;
    };

    hamburger.addEventListener('click', () => {
      const isOpen = hamburger.getAttribute('aria-expanded') === 'true';
      if (isOpen) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    // Закрываем меню при клике по ссылке
    mobileMenu.addEventListener('click', (event) => {
      if (event.target.matches('a')) {
        closeMenu();
      }
    });

    // Escape закрывает меню
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' &&
          hamburger.getAttribute('aria-expanded') === 'true') {
        closeMenu();
        hamburger.focus();
      }
    });

    // Закрываем мобильное меню при ресайзе на планшет/десктоп
    const tabletQuery = window.matchMedia('(min-width: 768px)');
    const handleTabletChange = (event) => {
      if (event.matches) closeMenu();
    };

    if (tabletQuery.addEventListener) {
      tabletQuery.addEventListener('change', handleTabletChange);
    } else {
      // fallback для старых браузеров
      tabletQuery.addListener(handleTabletChange);
    }
  }

  /* --------------------------------------------------------
     3. Табы: переключение и клавиатурная навигация
     -------------------------------------------------------- */
  const tabsContainer = document.querySelector('.tabs');

  if (tabsContainer) {
    const tabs = Array.from(tabsContainer.querySelectorAll('[role="tab"]'));
    const panels = Array.from(tabsContainer.querySelectorAll('[role="tabpanel"]'));

    const activateTab = (tab, setFocus = false) => {
      const panelId = tab.getAttribute('aria-controls');
      const panel = document.getElementById(panelId);
      if (!panel) return;

      // Сброс всех табов
      tabs.forEach((t) => {
        t.setAttribute('aria-selected', 'false');
        t.setAttribute('tabindex', '-1');
      });

      // Сброс всех панелей
      panels.forEach((p) => {
        p.hidden = true;
      });

      // Активация выбранного
      tab.setAttribute('aria-selected', 'true');
      tab.setAttribute('tabindex', '0');
      panel.hidden = false;

      if (setFocus) tab.focus();
    };

    const handleTabKeydown = (event) => {
      const currentTab = event.target;
      const currentIndex = tabs.indexOf(currentTab);
      if (currentIndex === -1) return;

      let newIndex;

      switch (event.key) {
        case 'ArrowRight':
        case 'ArrowDown':
          newIndex = (currentIndex + 1) % tabs.length;
          break;
        case 'ArrowLeft':
        case 'ArrowUp':
          newIndex = (currentIndex - 1 + tabs.length) % tabs.length;
          break;
        case 'Home':
          newIndex = 0;
          break;
        case 'End':
          newIndex = tabs.length - 1;
          break;
        default:
          return;
      }

      event.preventDefault();
      activateTab(tabs[newIndex], true);
    };

    tabs.forEach((tab) => {
      tab.addEventListener('click', () => activateTab(tab));
      tab.addEventListener('keydown', handleTabKeydown);
    });
  }
})();
