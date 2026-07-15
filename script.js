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
document.querySelectorAll('.servico-card, .stat-card, .credencial-item, .zoomable, .atendimento-item-card').forEach(function (el) {
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
const wrapper = document.querySelector('.depoimentos-wrapper');

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

  // Função para ajustar a altura do wrapper dinamicamente conforme o depoimento ativo
  function ajustarAlturaWrapper() {
    if (wrapper && cards[indiceAtual]) {
      const activeCardHeight = cards[indiceAtual].offsetHeight;
      wrapper.style.height = activeCardHeight + 'px';
    }
  }

  // Ir para um depoimento específico
  function irParaDepoimento(indice) {
    indiceAtual = indice;
    track.style.transform = 'translateX(-' + (indiceAtual * 100) + '%)';

    // Atualiza pontos
    dotsContainer.querySelectorAll('.dep-dot').forEach(function (dot, i) {
      dot.classList.toggle('active', i === indiceAtual);
    });

    ajustarAlturaWrapper();
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

  // Ajusta a altura no redimensionamento da tela e após carregar
  window.addEventListener('resize', ajustarAlturaWrapper);
  setTimeout(ajustarAlturaWrapper, 150);
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


// ----------------------------------------------------------------
// FOTOS ZOOM LIGHTBOX
// ----------------------------------------------------------------
const zoomableImages = document.querySelectorAll('.zoomable');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxCaption = document.getElementById('lightbox-caption');
const lightboxClose = document.querySelector('.lightbox-close');

if (zoomableImages.length > 0 && lightbox) {
  zoomableImages.forEach(function (img) {
    img.addEventListener('click', function () {
      lightbox.style.display = 'flex';
      lightboxImg.src = img.src;
      lightboxCaption.textContent = img.alt ? img.alt : 'Foto da Dra. Eduarda Goes';
      document.body.style.overflow = 'hidden'; // bloqueia o scroll da página
    });
  });

  const fecharLightbox = function () {
    lightbox.style.display = 'none';
    document.body.style.overflow = 'auto'; // restaura o scroll da página
  };

  if (lightboxClose) {
    lightboxClose.addEventListener('click', fecharLightbox);
  }
  
  lightbox.addEventListener('click', function (e) {
    // Fecha se clicar no fundo do modal (fora da imagem de fato)
    if (e.target === lightbox || e.target.classList.contains('lightbox-close') || e.target === lightboxImg || e.target.classList.contains('lightbox-content')) {
      if (e.target !== lightboxImg) {
        fecharLightbox();
      }
    }
  });

  // Fecha ao apertar a tecla Esc
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && lightbox.style.display === 'flex') {
      fecharLightbox();
    }
  });
}
