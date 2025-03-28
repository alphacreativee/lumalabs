import { preloadImages } from "../../libs/utils.js";
let lenis;
Splitting();

function initLenis() {
  lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smooth: true
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }

  requestAnimationFrame(raf);

  // Đồng bộ Lenis với ScrollTrigger
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
}

function hero() {
  const hero = document.querySelector(".hero");
  const personas = document.querySelector(".hero-personas");
  const heroVideo = document.querySelector(".hero-wrapper__video");
  const header = document.getElementById("header");
  const heroHeight = hero.offsetHeight;

  gsap.to(".hero", {
    scrollTrigger: {
      trigger: ".hero",
      start: "top top",
      end: "+=300%",
      scrub: 1,
      pin: true,
      pinSpacing: false
      // markers: true,
    }
  });

  // Animation cho video wrapper
  gsap.to(heroVideo, {
    width: "100px",
    height: "60px",
    top: "50%",
    left: "50%",
    yPercent: 50,
    xPercent: -50,
    borderRadius: "40px",
    ease: "none",
    scrollTrigger: {
      trigger: heroVideo,
      start: "top top",
      end: "+=150%",
      scrub: true,
      pinSpacing: false,
      markers: true
    }
  });

  // Animation cho header
  gsap.fromTo(
    "#header",
    { top: "100%", yPercent: -100 },
    {
      top: 0,
      yPercent: 0,
      ease: "none",
      scrollTrigger: {
        trigger: "body",
        start: "top top",
        end: "50% top",
        scrub: true,
        // markers: true,

        pinSpacing: false
      }
    }
  );

  gsap.to(personas, {
    scale: 0.52,
    ease: "none",
    scrollTrigger: {
      trigger: heroVideo,
      start: "top top",
      end: "+=150%",
      scrub: true,
      pinSpacing: false
      // markers: true
    }
  });

  // Làm mới ScrollTrigger sau khi thiết lập
  ScrollTrigger.refresh();
}

const init = () => {
  initLenis();
  hero();

  // Thêm listener để làm mới khi resize
  window.addEventListener("resize", () => {
    ScrollTrigger.refresh();
  });
};

preloadImages("img").then(() => {
  document.body.classList.remove("loading");
  init();
});

$(window).on("beforeunload", function () {
  $(window).scrollTop(0);
});
