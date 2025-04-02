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
  const heroContent = document.querySelector(".hero-wrapper__content");
  const header = document.getElementById("header");
  const heroHeight = hero.offsetHeight;

  gsap.to(".hero", {
    scrollTrigger: {
      trigger: ".hero",
      start: "top top",
      end: "+=200%",
      scrub: 1,
      pin: true,
      pinSpacing: false,
      markers: true,
    },
  });

  // Animation cho video wrapper
  gsap.to(heroVideo, {
    width: "80px",
    height: "40px",
    top: "calc(50% + 5px)",
    left: "50%",
    yPercent: 50,
    xPercent: -50,
    borderRadius: "40px",
    ease: "none",
    scrollTrigger: {
      trigger: heroVideo,
      start: "top top",
      end: "+=100%",
      scrub: true,
      pinSpacing: false,
      markers: true,
      onUpdate: (self) => {
        let progress = self.progress.toFixed(2);
        gsap.to(heroVideo, { opacity: progress == 1 ? 0 : 1, duration: 0.3 });

        gsap.to(heroContent, {
          opacity: progress > 0.05 ? 0 : 1,
          duration: 0.3,
        });
      },
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
        end: "+=100%",
        scrub: true,
        // markers: true,
      },
    }
  );

  gsap.to(".hero", {
    backgroundColor: "#B9BABA",
    ease: "none",
    scrollTrigger: {
      trigger: heroVideo, // Cùng trigger với heroVideo
      start: "top top",
      end: "+=100%",
      scrub: true,
    },
  });

  // loading
  gsap.to(".item-ovl", {
    width: "calc(100vw - 40px)",
    height: "calc(100vh - 140px)",
    duration: 0.8,
    delay: 1,
    zIndex: 2,
    top: "20px",
    yPercent: 0,
    ease: "none",
    onUpdate: function () {
      // Tính toán tiến trình từ thời gian
      const progress = this.progress();
      if (progress >= 0.01) {
        document.querySelector(".hero-switcher .list-item").style.opacity = 0;
      }

      if (progress >= 0.8) {
        gsap.to(".hero-switcher .item-ovl", {
          opacity: 0,
          duration: 0.5,
          ease: "none",
        });
      }

      if (progress >= 0.8) {
        // Khi tiến trình đạt 80%, thực hiện hành động
        document.querySelector("#header").classList.remove("loading");

        document.querySelector(".hero-switcher .list-item").style.opacity = 1;
      }

      if (progress == 1) {
        document.querySelector(".hero-switcher").classList.remove("loading");
        document.querySelector(".hero").classList.remove("loading");
      }
    },
  });

  // loading
  gsap.to(".item-ovl", {
    width: "calc(100vw - 40px)",
    height: "calc(100vh - 140px)",
    duration: 0.8,
    delay: 1,
    zIndex: 2,
    top: "20px",
    yPercent: 0,
    ease: "none",
    onUpdate: function () {
      // Tính toán tiến trình từ thời gian
      const progress = this.progress();
      console.log(progress);

      if (progress >= 0.01) {
        document.querySelector(".hero-switcher .list-item").style.opacity = 0;
      }

      if (progress >= 0.8) {
        // Khi tiến trình đạt 80%, thực hiện hành động
        document.querySelector("#header").classList.remove("loading");
      }

      if (progress == 1) {
        document.querySelector(".hero-switcher").classList.remove("loading");
        document.querySelector(".hero").classList.remove("loading");

        setTimeout(() => {
          document.querySelector(".hero-switcher .list-item").style.opacity = 1;
        }, 0.3);
      }
    },
  });

  // Animation cho header
  gsap.registerPlugin(ScrollTrigger);

  // Animation cho #header khi cuộn
  gsap.fromTo(
    "#header",
    { top: "100%", yPercent: -100, opacity: 1 },
    {
      top: 0,
      yPercent: 0,
      ease: "none",
      duration: 4,
      scrollTrigger: {
        trigger: "#header",
        start: "top top",
        end: "bottom top",
        scrub: true,
        pinSpacing: false,
        scroller: "body",
        onUpdate: (self) => {
          let progress = self.progress.toFixed(2);
          let header = document.getElementById("header");

          // Xử lý opacity theo progress
          let opacity =
            progress < 0.1
              ? 1
              : progress <= 0.2
              ? 1 - (progress - 0.1) * 10
              : progress < 0.99
              ? 0
              : 1;

          gsap.to(header, { opacity: opacity });

          // Thêm/Xóa class dựa trên progress
          header.classList.toggle("header--fixed", progress >= 0.9);
          document
            .querySelector(".hero-switcher")
            .classList.toggle("active", progress == 1);
          document
            .querySelector(".hero-gradient")
            .classList.toggle("active", progress == 1);
        },
      },
    }
  );

  // Timeline cho hiệu ứng mở rộng item-ovl
  let tl = gsap.timeline({
    scrollTrigger: {
      trigger: ".item-ovl",
      start: "top center",
      toggleActions: "play none none none",
      onUpdate: (self) => {
        if (self.progress >= 0.8) {
          document.querySelector("#header").classList.remove("loading");
          document.querySelector(".hero-switcher").classList.remove("loading");
        }
      },
    },
  });

  tl.to(".item-ovl", {
    width: "calc(100vw - 40px)",
    height: "calc(100vh - 140px)",
    duration: 0.8,
    delay: 1,
    top: "20px",
    yPercent: 0,
    ease: "none",
  }).to(
    ".item-ovl",
    {
      opacity: 0,
      duration: 0.3,
      ease: "none",
    },
    "-=0.24"
  );

  const itemSwitcher = document.querySelectorAll(".hero-switcher .item");
  itemSwitcher.forEach((item) => {
    item.addEventListener("click", function () {
      if (this.classList.contains("active")) return;

      itemSwitcher.forEach((i) => i.classList.remove("active"));

      this.classList.add("active");
    });
  });

  gsap.to(personas, {
    scale: 0.52,
    ease: "none",
    scrollTrigger: {
      trigger: heroVideo,
      start: "top top",
      end: "+=100%",
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
  const items = document.querySelectorAll(".hero-switcher .list-item .item");
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
function testimonial() {
  const wrapper = document.querySelector(".testimonial__scroll-wrapper");
  const container = document.querySelector(".testimonial__container");
  const customCursor = document.querySelector(".custom-cursor");
  const cursorText = customCursor.querySelector("span");
  let scrollAmount = 0;
  let isHovering = false;

  function handleScroll(e) {
    if (!isHovering) return;

    const containerWidth = container.offsetWidth;
    const wrapperWidth = wrapper.scrollWidth;
    const maxScroll = wrapperWidth - containerWidth;

    const rect = container.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;

    const triggerZone = 200;
    if (mouseX >= containerWidth - triggerZone) {
      scrollAmount = -maxScroll;
    } else {
      const adjustedWidth = containerWidth - triggerZone;
      const adjustedRatio = mouseX / adjustedWidth;
      scrollAmount = Math.min(0, adjustedRatio * maxScroll * -1);
    }

    scrollAmount = Math.max(-maxScroll, Math.min(0, scrollAmount));
    wrapper.style.transform = `translateX(${scrollAmount}px)`;
  }

  // Di chuyển customCursor và áp dụng parallax cho span
  function moveCursor(e) {
    const cursorWidth = customCursor.offsetWidth;
    const cursorHeight = customCursor.offsetHeight;
    const mouseX = e.clientX;
    const mouseY = e.clientY;

    // Đặt customCursor vào chính giữa con trỏ chuột
    customCursor.style.transform = `translate(${mouseX - cursorWidth / 2}px, ${
      mouseY - cursorHeight / 2
    }px)`;

    // Tính parallax cho span
    const containerRect = container.getBoundingClientRect();
    const relativeX = mouseX - containerRect.left;
    const relativeY = mouseY - containerRect.top;
    const centerX = container.offsetWidth / 2;
    const centerY = container.offsetHeight / 2;

    // Hiệu ứng parallax nhẹ nhàng
    const parallaxX = (relativeX - centerX) * 0.025;
    const parallaxY = (relativeY - centerY) * 0.05;

    // Áp dụng transform cho span (hiệu ứng parallax)
    cursorText.style.transform = `translate(${parallaxX}px, ${parallaxY}px)`;
  }

  // Sự kiện chuột
  container.addEventListener("mouseenter", () => {
    isHovering = true;
    customCursor.style.opacity = "1";
  });

  container.addEventListener("mouseleave", () => {
    isHovering = false;
    wrapper.style.transform = `translateX(0px)`;
    customCursor.style.opacity = "0";
  });

  container.addEventListener("mousemove", (e) => {
    handleScroll(e);
    moveCursor(e);
  });
}

function animationText() {
  const fxTitle = document.querySelectorAll("[data-splitting]");
  const button = document.querySelector(".btn-large");
  fxTitle.forEach((title) => {
    gsap.fromTo(
      title.querySelectorAll(".char"),
      {
        "will-change": "opacity",
        opacity: 0,
        transform: "translateX(0.5ex)",
      },
      {
        ease: "none",
        transform: "translateX(0)",
        opacity: 1,
        stagger: 0.05,
        scrollTrigger: {
          trigger: title,
          start: "top 70%",
          end: "top 70%",
          // scrub: true,
          // markers: true,
        },
      }
    );
  });
  // const tl = gsap.timeline({ paused: true });
  // fxTitle.forEach((title) => {
  //   tl.fromTo(
  //     title.querySelectorAll(".char"),
  //     {
  //       "will-change": "opacity",
  //       opacity: 0,
  //     },
  //     {
  //       ease: "none",
  //       opacity: 1,
  //       stagger: 0.05,
  //     }
  //   );
  // });
  // const toggleAnimation = () => {
  //   if (tl.paused()) {
  //     tl.play(); // Nếu đang tạm dừng, chạy animation
  //   } else {
  //     tl.reverse(); // Nếu đang chạy, tạm dừng animation
  //   }
  // };
  // button.addEventListener("click", toggleAnimation);
}
const init = () => {
  initLenis();
  hero();
  hoverIcon();
  testimonial();
  animationText();
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
