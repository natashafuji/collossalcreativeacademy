(function(){
  // Hamburger
  const btn = document.querySelector('.hamburger');
  const nav = document.getElementById('nav');
  if(btn && nav){
    btn.addEventListener('click', () => {
      const opened = nav.classList.toggle('open');
      btn.setAttribute('aria-expanded', opened ? 'true' : 'false');
    });
  }

  // Simple auto slider
  const track = document.querySelector('.slides');
  const dotsWrap = document.querySelector('.slider-dots');
  if(track && dotsWrap){
    const slides = Array.from(track.children);
    slides.forEach((_,i)=>{
      const b=document.createElement('button');
      if(i===0) b.classList.add('active');
      b.addEventListener('click',()=>go(i));
      dotsWrap.appendChild(b);
    });
    let idx = 0;
    function go(i){
      idx = i;
      const w = track.clientWidth;
      track.style.transform = `translateX(${(-w)*i}px)`;
      dotsWrap.querySelectorAll('button').forEach((d,j)=>d.classList.toggle('active', j===i));
    }
    function next(){ go((idx+1)%slides.length); }
    let timer = setInterval(next, 3500);
    // Pause on hover
    track.addEventListener('mouseenter', ()=>clearInterval(timer));
    track.addEventListener('mouseleave', ()=>timer=setInterval(next,3500));
    window.addEventListener('resize', ()=>go(idx));
  }
})();


/* Lazy-load slide backgrounds */
(function(){
  const slides = document.querySelectorAll('.hero-slider .slide[data-bg]');
  if(!slides.length) return;
  const gradient = "linear-gradient(135deg, rgba(248,250,252,.28), rgba(238,242,255,.28))";
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        const el = entry.target;
        const bg = el.dataset.bg;
        el.style.backgroundImage = `${gradient}, url('${bg}')`;
        el.style.backgroundPosition = 'center';
        el.style.backgroundSize = 'cover';
        el.style.backgroundRepeat = 'no-repeat';
        io.unobserve(el);
      }
    });
  });
  slides.forEach(s => io.observe(s));
})();


/* Rotating background for Sewing & Product Design slide */
(function(){
  const el = document.querySelector('.slide.sewing-rotator');
  if(!el) return;
  const imgs = [
    "sewing-offer-1.jpg",
    "sewing-offer-2.jpg",
    "sewing-offer-3.jpg"
  ];
  let i = 0;
  function setBg(idx){
    el.style.background = `linear-gradient(0deg, rgba(0,0,0,.15), rgba(0,0,0,.15)), url(${imgs[idx]}) center/cover no-repeat`;
  }
  setBg(i);
  setInterval(()=>{ i=(i+1)%imgs.length; setBg(i); }, 3500);
})();


/* overlay slider controls */
(function(){
  const slider = document.querySelector('.hero-slider');
  const track = slider && slider.querySelector('.slides');
  const dotsWrap = slider && slider.querySelector('.slider-dots');
  if(!slider || !track) return;
  const slides = Array.from(track.querySelectorAll('.slide'));
  // ensure dots
  if(dotsWrap && !dotsWrap.querySelector('button')){
    slides.forEach((_,i)=>{
      const b=document.createElement('button');
      if(i===0) b.classList.add('active');
      b.setAttribute('aria-label','Slide '+(i+1));
      b.addEventListener('click',()=>go(i));
      dotsWrap.appendChild(b);
    });
  }
  // ensure arrows
  if(!slider.querySelector('.nav-arrow.prev')){
    const prev=document.createElement('button'); prev.className='nav-arrow prev'; prev.innerHTML='‹';
    const next=document.createElement('button'); next.className='nav-arrow next'; next.innerHTML='›';
    slider.appendChild(prev); slider.appendChild(next);
    prev.addEventListener('click',()=>go(i-1));
    next.addEventListener('click',()=>go(i+1));
  }
  let dots = dotsWrap ? Array.from(dotsWrap.querySelectorAll('button')) : [];
  let i=0;
  function go(n){
    i=(n+slides.length)%slides.length;
    const w=slides[0].getBoundingClientRect().width;
    track.style.transform = `translateX(${(-w)*i}px)`;
    track.style.transition = 'transform .5s ease';
    dots.forEach((d,idx)=>d.classList.toggle('active', idx===i));
  }
  let t=setInterval(()=>go(i+1), 4000);
  slider.addEventListener('mouseenter',()=>clearInterval(t));
  slider.addEventListener('mouseleave',()=> t=setInterval(()=>go(i+1),4000));
  window.addEventListener('resize',()=>go(i));
  go(0);
})();
