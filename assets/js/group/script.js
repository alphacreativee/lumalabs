import { preloadImages } from "../../libs/utils.js";
let lenis;
Splitting();

function initLenis() {
  lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smooth: true,
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
      pinSpacing: false,
      // markers: true,
    },
  });

  // Animation cho video wrapper
  gsap.to(heroVideo, {
    width: "100px",
    height: "60px",
    top: "calc(50% - 11px)",
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
      // markers: true
    },
  });

  gsap.fromTo(
    ".hero-wrapper__bg .bg-item.active",
    { opacity: 0 },
    {
      opacity: 1,
      ease: "none",
      scrollTrigger: {
        trigger: heroVideo, // Cùng trigger với heroVideo
        start: "top top",
        end: "+=150%",
        scrub: true,
      },
    }
  );

  gsap.to(".hero", {
    backgroundColor: "#B9BABA",
    ease: "none",
    scrollTrigger: {
      trigger: heroVideo, // Cùng trigger với heroVideo
      start: "top top",
      end: "+=150%",
      scrub: true,
    },
  });

  // Animation cho header
  gsap.fromTo(
    "#header",
    { top: "100%", yPercent: -100, opacity: 1 }, // Ban đầu không mờ
    {
      top: 0,
      yPercent: 0,
      ease: "none",
      scrollTrigger: {
        trigger: "body",
        start: "top top",
        end: "50% top",
        scrub: true,
        pinSpacing: false,
        onUpdate: (self) => {
          let progress = self.progress.toFixed(2);

          let opacity;
          if (progress < 0.1) {
            opacity = 1; // Ban đầu hiển thị hoàn toàn
          } else if (progress >= 0.1 && progress <= 0.2) {
            opacity = 1 - (progress - 0.1) * 10; // Giảm dần từ 1 đến 0
          } else if (progress > 0.2 && progress < 0.99) {
            opacity = 0; // Ẩn hoàn toàn từ 0.2 đến 0.8
          } else {
            opacity = 1; // Khi vượt 0.9, hiển thị hoàn toàn
          }

          if (progress >= 0.9) {
            document.getElementById("header").classList.add("header--fixed");
          } else {
            document.getElementById("header").classList.remove("header--fixed");
          }

          if (progress == 1) {
            document.querySelector(".hero-switcher").classList.add("active");
          } else {
            document.querySelector(".hero-switcher").classList.remove("active");
          }

          gsap.to("#header", { opacity: opacity });
        },
      },
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
      pinSpacing: false,
      // markers: true
      onUpdate: (self) => {
        let progress = self.progress.toFixed(2);

        if (progress == 1) {
          document.querySelector(".hero").classList.add("done-video");
        } else {
          document.querySelector(".hero").classList.remove("done-video");
        }
      },
    },
  });

  // Làm mới ScrollTrigger sau khi thiết lập
  ScrollTrigger.refresh();
}
function parallaxIt(e, target, movement) {
  var $this = $(target);

  var relX = e.pageX - $this.offset().left; // Tính vị trí tương đối X
  var relY = e.pageY - $this.offset().top; // Tính vị trí tương đối Y

  var parallaxX = (relX / $this.width() - 0.5) * movement; // -0.5 để căn giữa
  var parallaxY = (relY / $this.height() - 0.5) * movement;

  TweenMax.to($this, 0.3, {
    x: parallaxX,
    y: parallaxY,
    ease: Power2.easeOut,
  });
}

function callParallax(e) {
  var $item = $(e.currentTarget); // Lấy item
  var $img = $item.find("img"); // Lấy img trong item

  parallaxIt(e, $img, 20); // Img di chuyển mạnh hơn
  parallaxIt(e, $item, 5); // I
}

function hoverIcon() {
  $(".list-item .item").mousemove(function (e) {
    callParallax(e);
  });

  $(".list-item .item").mouseleave(function (e) {
    TweenMax.to(this, 0.3, {
      height: 60,
      width: 100,
      x: 0,
      y: 0,
      ease: Power2.easeOut,
    });
    TweenMax.to($(this).find("img"), 0.3, {
      x: 0,
      y: 0,
      scale: 1,
      ease: Power2.easeOut,
    });
  });

  $(".list-item .item").mouseenter(function (e) {
    TweenMax.to($(this).find("img"), 0.3, {
      scale: 0.9,
    });
  });
}
const init = () => {
  initLenis();
  hero();
  hoverIcon();
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
