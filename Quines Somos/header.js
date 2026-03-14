document.addEventListener('alpine:init', () => {
  // Componente Alpine mínimo para el header
  Alpine.data('uqHeader', () => ({
    isScrolled: false,
    isMenuOpen: false,
    init() {
      const onScroll = () => {
        this.isScrolled = window.pageYOffset > 50;
      };
      onScroll();
      window.addEventListener('scroll', onScroll, { passive: true });
    }
  }));
});
