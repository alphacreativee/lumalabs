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
    width: "80px",
    height: "40px",
    top: "calc(50% + 10px)",
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
  const rect = target.getBoundingClientRect();

  // Tính vị trí tương đối của chuột so với target
  const relX = e.clientX - rect.left;
  const relY = e.clientY - rect.top;

  const parallaxX = (relX / rect.width - 0.5) * movement;
  const parallaxY = (relY / rect.height - 0.5) * movement;

  // Sử dụng GSAP thay vì TweenMax
  gsap.to(target, {
    duration: 0.3,
    x: parallaxX,
    y: parallaxY,
    ease: "power2.out",
  });
}

function callParallax(e) {
  const item = e.currentTarget; // Phần tử đang hover
  const img = item.querySelector("img"); // Img trong phần tử (nếu có)
  const span = item.querySelector("span"); // Span trong phần tử (nếu có)

  // Áp dụng parallax cho item
  parallaxIt(e, item, 10); // Item di chuyển nhẹ

  // Nếu có img thì áp dụng parallax
  if (img) {
    parallaxIt(e, img, 20); // Img di chuyển mạnh hơn
  }

  // Nếu có span thì áp dụng parallax
  if (span) {
    parallaxIt(e, span, 15); // Span di chuyển mức trung
  }
}

function hoverIcon() {
  // Lấy tất cả .list-item .item
  const items = document.querySelectorAll(".list-item .item");
  const buttons = document.querySelectorAll(".btn-large");

  // Xử lý cho .list-item .item
  items.forEach((item) => {
    item.addEventListener("mousemove", (e) => {
      callParallax(e);
    });

    item.addEventListener("mouseleave", () => {
      gsap.to(item, {
        duration: 0.3,
        height: 60,
        width: 100,
        x: 0,
        y: 0,
        ease: "power2.out",
      });
      const img = item.querySelector("img");
      if (img) {
        gsap.to(img, {
          duration: 0.3,
          x: 0,
          y: 0,
          scale: 1,
          ease: "power2.out",
        });
      }
    });

    item.addEventListener("mouseenter", () => {
      const img = item.querySelector("img");
      if (img) {
        gsap.to(img, {
          duration: 0.3,
          scale: 0.9,
          ease: "power2.out",
        });
      }
    });
  });

  // Xử lý cho .btn-large
  buttons.forEach((button) => {
    button.addEventListener("mousemove", (e) => {
      callParallax(e);
    });

    button.addEventListener("mouseleave", () => {
      gsap.to(button, {
        duration: 0.3,
        x: 0,
        y: 0,
        ease: "power2.out",
      });
      const span = button.querySelector("span");
      if (span) {
        gsap.to(span, {
          duration: 0.3,
          x: 0,
          y: 0,
          scale: 1,
          ease: "power2.out",
        });
      }
    });

    button.addEventListener("mouseenter", () => {
      const span = button.querySelector("span");
      if (span) {
        gsap.to(span, {
          duration: 0.3,
          scale: 0.9,
          ease: "power2.out",
        });
      }
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
