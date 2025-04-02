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
  const heroContent = document.querySelector(".hero-wrapper__content");
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
      markers: true
    }
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
      end: "+=150%",
      scrub: true,
      pinSpacing: false,
      onUpdate: (self) => {
        let progress = self.progress.toFixed(2);
        gsap.to(heroVideo, { opacity: progress == 1 ? 0 : 1, duration: 0.3 });

        gsap.to(heroContent, {
          opacity: progress > 0.05 ? 0 : 1,
          duration: 0.3
        });
      }
    }
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
        scrub: true
      }
    }
  );

  gsap.to(".hero", {
    backgroundColor: "#B9BABA",
    ease: "none",
    scrollTrigger: {
      trigger: heroVideo, // Cùng trigger với heroVideo
      start: "top top",
      end: "+=150%",
      scrub: true
    }
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
          ease: "none"
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
    }
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
    }
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
      scrollTrigger: {
        trigger: "body",
        start: "top top",
        end: "50% top",
        scrub: true,
        pinSpacing: false,
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
        }
      }
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
      }
    }
  });

  tl.to(".item-ovl", {
    width: "calc(100vw - 40px)",
    height: "calc(100vh - 140px)",
    duration: 0.8,
    delay: 1,
    top: "20px",
    yPercent: 0,
    ease: "none"
  }).to(
    ".item-ovl",
    {
      opacity: 0,
      duration: 0.3,
      ease: "none"
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
      }
    }
  });
  ScrollTrigger.refresh();

  // canvas personas
  // Tạo EventEmitter cơ bản nếu không dùng thư viện events
  const imagesSequenceEmitter = {
    listeners: {},
    on(event, fn) {
      if (!this.listeners[event]) {
        this.listeners[event] = [];
      }
      this.listeners[event].push(fn);
    },
    emit(event) {
      if (this.listeners[event]) {
        this.listeners[event].forEach((fn) => fn());
      }
    }
  };

  let loadedImages = [];

  function loadSequenceImages() {
    const imageGroups = [
      Array.from(
        { length: 24 },
        (_, i) => `./assets/morphing/1-2/1-2${String(i).padStart(2, "0")}.png`
      ),
      Array.from(
        { length: 24 },
        (_, i) => `./assets/morphing/2-3/2-3${String(i).padStart(2, "0")}.png`
      ),
      Array.from(
        { length: 24 },
        (_, i) => `./assets/morphing/3-4/3-4${String(i).padStart(2, "0")}.png`
      ),
      Array.from(
        { length: 24 },
        (_, i) => `./assets/morphing/4-5/4-5${String(i).padStart(2, "0")}.png`
      ),
      Array.from(
        { length: 24 },
        (_, i) => `./assets/morphing/5-1/5-1${String(i).padStart(2, "0")}.png`
      )
    ];

    const images = imageGroups.flat();

    const imagePromises = images.map((src) => {
      return new Promise((resolve) => {
        const img = new Image();
        img.src = src;
        img.onload = () => resolve(img);
        img.onerror = () => resolve(null);
      });
    });

    Promise.all(imagePromises).then((imagesLoaded) => {
      loadedImages = imagesLoaded;
      imagesSequenceEmitter.emit("sequence-loaded");
    });
  }

  const canvas = document.querySelector(".hero-personas canvas");
  canvas.width = 800;
  canvas.height = 800;
  const ctx = canvas.getContext("2d");

  let currentIndex = -1;
  let progress = 1;

  function normalize(value, min, max) {
    return Math.max(0, Math.min(1, (value - min) / (max - min)));
  }

  function render() {
    const index = Math.round(
      normalize(progress, 1, 5) * (loadedImages.length - 1)
    );

    if (index !== currentIndex && ctx) {
      currentIndex = index;

      // Xóa canvas trước khi vẽ ảnh mới
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Kiểm tra đối tượng ảnh trước khi vẽ lên canvas
      const img = loadedImages[index];
      if (img instanceof HTMLImageElement) {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      } else {
        console.error("Loaded image is not an HTMLImageElement", img);
      }
    }

    requestAnimationFrame(render);
  }

  imagesSequenceEmitter.on("sequence-loaded", function () {
    document.body.classList.remove("loading");
    requestAnimationFrame(render);
  });

  loadSequenceImages();

  let animation = null;
  let startTime = null;
  let startValue = 1;
  let targetValue = 1;

  function animate(timestamp) {
    if (!startTime) startTime = timestamp;

    const elapsed = timestamp - startTime;
    const duration = 1000;

    if (elapsed < duration) {
      const animProgress = elapsed / duration;
      const diff = targetValue - startValue;
      progress = startValue + diff * animProgress;
      animation = requestAnimationFrame(animate);
    } else {
      progress = targetValue;
      animation = null;
      startTime = null;
    }
  }

  function onClick(target) {
    if (animation) cancelAnimationFrame(animation);

    startTime = null;
    startValue = progress;
    targetValue = target;
    animation = requestAnimationFrame(animate);
  }

  const buttons = document.querySelectorAll(".hero-switcher .item");
  for (let i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener("click", function (e) {
      const value = parseInt(this.getAttribute("data-state"));
      onClick(value);
    });
  }
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
    ease: "power2.out"
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
        ease: "power2.out"
      });
      const img = item.querySelector("img");
      if (img) {
        gsap.to(img, {
          duration: 0.3,
          x: 0,
          y: 0,
          scale: 1,
          ease: "power2.out"
        });
      }
    });

    item.addEventListener("mouseenter", () => {
      const img = item.querySelector("img");
      if (img) {
        gsap.to(img, {
          duration: 0.3,
          scale: 0.9,
          ease: "power2.out"
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
        ease: "power2.out"
      });
      const span = button.querySelector("span");
      if (span) {
        gsap.to(span, {
          duration: 0.3,
          x: 0,
          y: 0,
          scale: 1,
          ease: "power2.out"
        });
      }
    });

    button.addEventListener("mouseenter", () => {
      const span = button.querySelector("span");
      if (span) {
        gsap.to(span, {
          duration: 0.3,
          scale: 0.9,
          ease: "power2.out"
        });
      }
    });
  });
}
function testimonial() {
  const wrapper = document.querySelector(".testimonial__scroll-wrapper");
  const container = document.querySelector(".testimonial__container");
  let scrollAmount = 0;
  let isHovering = false;
  function handleScroll(e) {
    if (!isHovering) return; // Chỉ chạy khi chuột trong section

    const containerWidth = container.offsetWidth;
    const wrapperWidth = wrapper.scrollWidth;
    const maxScroll = wrapperWidth - containerWidth;

    // Tính vị trí chuột tương đối trong container
    const rect = container.getBoundingClientRect();
    const mouseX = e.clientX - rect.left; // Vị trí X trong container
    const scrollRatio = mouseX / containerWidth;

    // Tính toán vị trí scroll mới
    scrollAmount = scrollRatio * maxScroll * -1;
    wrapper.style.transform = `translateX(${scrollAmount}px)`;
  }

  // Bật/tắt hiệu ứng khi chuột vào/ra section
  container.addEventListener("mouseenter", () => {
    isHovering = true;
  });

  container.addEventListener("mouseleave", () => {
    isHovering = false;
    // Tùy chọn: Reset vị trí khi rời khỏi
    wrapper.style.transform = `translateX(0px)`;
  });

  // Theo dõi chuyển động chuột
  container.addEventListener("mousemove", handleScroll);
}
function animationText() {
  const fxTitle = document.querySelectorAll("[data-splitting]");
  const button = document.querySelector(".btn-large");
  fxTitle.forEach((title) => {
    gsap.fromTo(
      title.querySelectorAll(".char"),
      {
        "will-change": "opacity",
        opacity: 0
      },
      {
        ease: "none",
        opacity: 1,
        stagger: 0.05,
        scrollTrigger: {
          trigger: title,
          start: "top 70%",
          end: "top 70%",
          // scrub: true,
          markers: true
        }
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
