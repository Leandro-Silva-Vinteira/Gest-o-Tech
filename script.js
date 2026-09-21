// ==========================================================================
// LS Vinteira · Gestão & Tech — interações
// ==========================================================================
document.addEventListener('DOMContentLoaded', function () {

  /* ---- Menu mobile ---- */
  var toggle = document.querySelector('.botao-menu');
  var navList = document.querySelector('.lista-menu');

  if (toggle && navList) {
    toggle.addEventListener('click', function () {
      var isOpen = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!isOpen));
      navList.classList.toggle('aberto', !isOpen);
      document.body.style.overflow = !isOpen ? 'hidden' : '';
    });
    navList.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        toggle.setAttribute('aria-expanded', 'false');
        navList.classList.remove('aberto');
        document.body.style.overflow = '';
      });
    });
  }

  /* ---- Header: sombra sutil ao rolar ---- */
  var header = document.querySelector('.cabecalho');
  if (header) {
    var onScroll = function () {
      header.style.boxShadow = window.scrollY > 8 ? '0 1px 0 rgba(11,37,69,0.08)' : 'none';
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---- Reveal ao rolar ---- */
  var revealEls = document.querySelectorAll('.revelar');
  if ('IntersectionObserver' in window && revealEls.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visivel');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('visivel'); });
  }

  /* ---- Acordeão de FAQ ---- */
  document.querySelectorAll('.item-faq').forEach(function (item) {
    var q = item.querySelector('.pergunta-faq');
    var a = item.querySelector('.resposta-faq');
    if (!q || !a) return;
    q.addEventListener('click', function () {
      var isOpen = item.getAttribute('data-open') === 'true';
      item.parentElement.querySelectorAll('.item-faq').forEach(function (other) {
        other.setAttribute('data-open', 'false');
        other.querySelector('.resposta-faq').style.maxHeight = null;
      });
      if (!isOpen) {
        item.setAttribute('data-open', 'true');
        a.style.maxHeight = a.scrollHeight + 'px';
      }
    });
  });

  /* ---- Formulário de contato (Netlify Forms, com feedback sem reload) ---- */
  var form = document.querySelector('.formulario-contato');
  if (form) {
    var msg = form.querySelector('.mensagem-formulario');

    var showMsg = function (text, type) {
      if (!msg) return;
      msg.textContent = text;
      msg.classList.remove('sucesso', 'erro');
      msg.classList.add(type, 'visivel');
    };

    form.addEventListener('submit', function (e) {
      if (!window.fetch) return; // deixa o submit padrão do Netlify acontecer

      e.preventDefault();
      var submitBtn = form.querySelector('button[type="submit"]');
      var originalLabel = submitBtn ? submitBtn.textContent : '';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Enviando...';
      }

      var data = new URLSearchParams(new FormData(form)).toString();

      fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: data,
      })
        .then(function () {
          showMsg('Mensagem enviada com sucesso. Retornaremos em breve.', 'sucesso');
          form.reset();
        })
        .catch(function () {
          showMsg('Não foi possível enviar agora. Tente novamente ou fale no WhatsApp.', 'erro');
        })
        .finally(function () {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = originalLabel;
          }
        });
    });
  }

  /* ---- Ano atual no rodapé ---- */
  var yearEl = document.querySelector('[data-year]');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});
