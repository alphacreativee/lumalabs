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
  const heroVideo = document.querySelector(".hero-wrapper__video");
  const header = document.getElementById("header");
  const heroHeight = hero.offsetHeight; // Chiều cao của hero

  // Đảm bảo video và header bắt đầu từ trạng thái ban đầu trong CSS
  gsap.set(heroVideo, {
    clearProps: "width,height,left,top"
  });
  gsap.set(header, {
    clearProps: "top"
  });

  gsap.to(".hero", {
    scrollTrigger: {
      trigger: ".hero",
      start: "top top",
      end: () => `+=300%`,
      scrub: 1,
      pin: true,
      pinSpacing: false
      // markers: true,
    }
  });

  // Animation cho video wrapper
  gsap.fromTo(
    heroVideo,
    {
      width: "calc(100% - 80px)",
      height: "calc(100dvh - 140px)",
      left: "50%",
      top: "0",
      xPercent: -50
    },
    {
      width: "60px",
      height: "90px",
      top: "50%",
      xPercent: -50,
      yPercent: -50,
      ease: "none",
      scrollTrigger: {
        trigger: hero,
        start: "top top",
        end: "+=150%",
        scrub: true
        // markers: true
      }
    }
  );

  // Animation cho header
  gsap.from("#header", {
    top: "0", // Trạng thái cuối tại scroll 150%
    ease: "none",
    scrollTrigger: {
      trigger: "body",
      start: "top top", // Rõ ràng bắt đầu tại scroll 0%
      end: `+=150%`, // Kết thúc tại scroll 150%
      scrub: true,
      markers: true
    }
  });

  console.log(window.innerHeight * 1.5 - header.offsetHeight);

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
