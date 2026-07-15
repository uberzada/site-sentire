/* ================================================================
   SCRIPT.JS — SITE DA PSICÓLOGA
   Funcionalidades: Menu, Carrossel de Depoimentos, Formulário
   ================================================================ */


// ----------------------------------------------------------------
// NAVBAR: Efeito de scroll e menu mobile
// ----------------------------------------------------------------
const navbar = document.getElementById('navbar');
const menuToggle = document.getElementById('menu-toggle');
const navLinks = document.getElementById('nav-links');

// Efeito ao rolar a página
window.addEventListener('scroll', function () {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }

  // Destaca o link ativo conforme a seção visível
  destacarLinkAtivo();
});

// Abre/fecha menu mobile
menuToggle.addEventListener('click', function () {
  navLinks.classList.toggle('open');
});

// Fecha o menu ao clicar em um link
navLinks.querySelectorAll('a').forEach(function (link) {
  link.addEventListener('click', function () {
    navLinks.classList.remove('open');
  });
});

// Destaca link de navegação da seção atual
function destacarLinkAtivo() {
  const secoes = document.querySelectorAll('section[id]');
  const links = navLinks.querySelectorAll('a');

  let secaoAtual = '';
  secoes.forEach(function (secao) {
    const topo = secao.offsetTop - 100;
    if (window.scrollY >= topo) {
      secaoAtual = secao.getAttribute('id');
    }
  });

  links.forEach(function (link) {
    link.classList.remove('active');
    if (link.getAttribute('href') === '#' + secaoAtual) {
      link.classList.add('active');
    }
  });
}


// ----------------------------------------------------------------
// ANIMAÇÃO DE ENTRADA: elementos aparecem ao rolar
// ----------------------------------------------------------------
const observer = new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.1 });

// Elementos que ganham animação de entrada
document.querySelectorAll('.servico-card, .stat-card, .credencial-item').forEach(function (el) {
  el.style.opacity = '0';
  el.style.transform = 'translateY(24px)';
  el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  observer.observe(el);
});


// ----------------------------------------------------------------
// CARROSSEL DE DEPOIMENTOS
// ----------------------------------------------------------------
const track = document.getElementById('depoimentos-track');
const cards = track ? track.querySelectorAll('.depoimento-card') : [];
const dotsContainer = document.getElementById('dep-dots');
const btnPrev = document.getElementById('dep-prev');
const btnNext = document.getElementById('dep-next');

let indiceAtual = 0;
let autoPlay; // variável do autoplay

if (cards.length > 0) {
  // Cria os pontos de navegação
  cards.forEach(function (_, i) {
    const dot = document.createElement('button');
    dot.className = 'dep-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', 'Depoimento ' + (i + 1));
    dot.addEventListener('click', function () {
      irParaDepoimento(i);
    });
    dotsContainer.appendChild(dot);
  });

  // Ir para um depoimento específico
  function irParaDepoimento(indice) {
    indiceAtual = indice;
    track.style.transform = 'translateX(-' + (indiceAtual * 100) + '%)';

    // Atualiza pontos
    dotsContainer.querySelectorAll('.dep-dot').forEach(function (dot, i) {
      dot.classList.toggle('active', i === indiceAtual);
    });
  }

  // Botão anterior
  btnPrev.addEventListener('click', function () {
    const novoIndice = (indiceAtual - 1 + cards.length) % cards.length;
    irParaDepoimento(novoIndice);
    reiniciarAutoPlay();
  });

  // Botão próximo
  btnNext.addEventListener('click', function () {
    const novoIndice = (indiceAtual + 1) % cards.length;
    irParaDepoimento(novoIndice);
    reiniciarAutoPlay();
  });

  // Autoplay: troca de depoimento a cada 6 segundos
  function iniciarAutoPlay() {
    autoPlay = setInterval(function () {
      const novoIndice = (indiceAtual + 1) % cards.length;
      irParaDepoimento(novoIndice);
    }, 6000);
  }

  function reiniciarAutoPlay() {
    clearInterval(autoPlay);
    iniciarAutoPlay();
  }

  iniciarAutoPlay();

  // Swipe (toque) para mobile
  let touchStart = 0;
  track.addEventListener('touchstart', function (e) {
    touchStart = e.changedTouches[0].screenX;
  });

  track.addEventListener('touchend', function (e) {
    const touchEnd = e.changedTouches[0].screenX;
    if (touchStart - touchEnd > 50) {
      // Deslizou para a esquerda → próximo
      const novoIndice = (indiceAtual + 1) % cards.length;
      irParaDepoimento(novoIndice);
    } else if (touchEnd - touchStart > 50) {
      // Deslizou para a direita → anterior
      const novoIndice = (indiceAtual - 1 + cards.length) % cards.length;
      irParaDepoimento(novoIndice);
    }
    reiniciarAutoPlay();
  });
}

// ----------------------------------------------------------------
// TOAST (NOTIFICAÇÃO FLUTUANTE)
// ----------------------------------------------------------------

function mostrarToast(mensagem) {
  // Remove toast existente se houver
  const toastExistente = document.querySelector('.toast');
  if (toastExistente) toastExistente.remove();

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = mensagem;
  document.body.appendChild(toast);

  // Mostra o toast
  setTimeout(function () { toast.classList.add('show'); }, 10);

  // Esconde após 4 segundos
  setTimeout(function () {
    toast.classList.remove('show');
    setTimeout(function () { toast.remove(); }, 400);
  }, 4000);
}
