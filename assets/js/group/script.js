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
      end: "+=200%",
      scrub: 1,
      pin: true,
      pinSpacing: false
      // markers: true
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
      end: "+=85%",
      scrub: true,
      pinSpacing: false,
      // markers: true,
      onUpdate: (self) => {
        let progress = self.progress;
        gsap.to(heroVideo, { opacity: progress == 1 ? 0 : 1, duration: 0.3 });

        gsap.to(heroContent, {
          opacity: progress > 0.05 ? 0 : 1,
          duration: 0.3
        });
      }
    }
  });

  gsap.fromTo(
    ".hero-wrapper__bg",
    { opacity: 0 },
    {
      opacity: 1,
      ease: "none",
      scrollTrigger: {
        trigger: heroVideo, // Cùng trigger với heroVideo
        start: "top top",
        end: "+=100%",
        scrub: true
        // markers: true,
      }
    }
  );

  gsap.to(".hero", {
    backgroundColor: "rgb(213 213 213)",
    ease: "none",
    scrollTrigger: {
      trigger: heroVideo, // Cùng trigger với heroVideo
      start: "top top",
      end: "+=100%",
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

        const video = document.querySelector(".hero-wrapper__video video");
        if (video) {
          video
            .play()
            .catch((err) => console.error("Không thể phát video:", err));
        }
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
      duration: 4,
      scrollTrigger: {
        trigger: heroVideo,
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
          header.classList.toggle("header--fixed", progress >= 0.7);
          document
            .querySelector(".hero-switcher")
            .classList.toggle("active", self.progress == 1);
          document
            .querySelector(".hero-gradient")
            .classList.toggle("active", self.progress == 1);
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
  function updateActiveItem(clickedItem) {
    // Nếu item đã active thì không làm gì
    if (clickedItem.classList.contains("active")) return;

    // Xóa class active từ tất cả items
    itemSwitcher.forEach((item) => item.classList.remove("active"));

    // Thêm class active cho item được click
    clickedItem.classList.add("active");

    // Lấy data-media-persona và tạo biến CSS
    const data = clickedItem.getAttribute("data-media-persona");
    const itemColor = `--${data}-color`;

    // Cập nhật backgroundColor cho .hero-gradient
    const heroGradient = document.querySelector(".hero-gradient");
    if (heroGradient) {
      heroGradient.style.backgroundColor = `var(${itemColor})`;
    }

    const bgItems = document.querySelectorAll(".hero-wrapper__bg .bg-item");
    bgItems.forEach((item) => item.classList.remove("active")); // Xóa active từ tất cả

    let matchingBgItem = document.querySelector(
      `.hero-wrapper__bg .bg-item[data-media-persona="${data}"]`
    );
    if (matchingBgItem) {
      matchingBgItem.classList.add("active"); // Thêm active cho item khớp
    }
  }

  // Thêm event listener cho từng item
  itemSwitcher.forEach((item) => {
    item.addEventListener("click", function () {
      updateActiveItem(this);
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

// slider drag
gsap.registerPlugin(Draggable);

gsap.defaults({ ease: "none" });

var picker = document.querySelector(".picker");
var cells = document.querySelectorAll(".cell");
var proxy = document.createElement("div");

var cellWidth = window.innerWidth / 2.3;
var numCells = cells.length;
var cellStep = 1 / numCells;
var wrapWidth = cellWidth * numCells;

var baseTl = gsap.timeline({ paused: true });
var wrapProgress = gsap.utils.wrap(0, 1);

gsap.set(picker, {
  width: wrapWidth - cellWidth
});

for (var i = 0; i < cells.length; i++) {
  initCell(cells[i], i);
}

var animation = gsap
  .timeline({ repeat: -1, paused: true })
  .add(baseTl.tweenFromTo(1, 2, { immediateRender: true }));

var draggable = new Draggable(proxy, {
  type: "x",
  trigger: picker,
  onDrag: updateProgress,
  onThrowUpdate: updateProgress,
  snap: {
    x: snapX
  },
  onRelease: function () {
    console.log("onRelease");
  }
});

function snapX(x) {
  return Math.round(x / cellWidth) * cellWidth;
}

function updateProgress() {
  animation.progress(wrapProgress(this.x / wrapWidth));
}

function initCell(element, index) {
  gsap.set(element, {
    width: cellWidth,
    scale: 0.6,
    x: -cellWidth,
    y: 150
  });

  var tl = gsap
    .timeline({ repeat: 1 })
    .to(element, 1, { x: "+=" + wrapWidth }, 0)
    .to(
      element,
      cellStep,
      { color: "#009688", scale: 1, repeat: 1, y: 0, yoyo: true },
      0.5 - cellStep
    );
  baseTl.add(tl, i * -cellStep);
}
// end slider drag

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
    const cursorRect = customCursor.getBoundingClientRect();
    const cursorWidth = cursorRect.width;
    const cursorHeight = cursorRect.height;
    const mouseX = e.clientX;
    const mouseY = e.clientY;

    customCursor.style.transform = `translate(${mouseX - cursorWidth / 2}px, ${
      mouseY - cursorHeight / 2
    }px)`;

    // Phần parallax giữ nguyên
    const containerRect = container.getBoundingClientRect();
    const relativeX = mouseX - containerRect.left;
    const relativeY = mouseY - containerRect.top;
    const centerX = container.offsetWidth / 2;
    const centerY = container.offsetHeight / 2;

    const parallaxX = (relativeX - centerX) * 0.025;
    const parallaxY = (relativeY - centerY) * 0.05;

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
        transform: "translateX(0.5ex)"
      },
      {
        ease: "none",
        transform: "translateX(0)",
        opacity: 1,
        stagger: 0.05,
        scrollTrigger: {
          trigger: title,
          start: "top 70%",
          end: "top 70%"
          // scrub: true,
          // markers: true,
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
function introduce() {
  gsap.registerPlugin(ScrollTrigger);
  const slides = gsap.utils.toArray(".slide");
  // const activeSlideImages = gsap.utils.toArray(".active-slide img");

  function getInitialTranslateZ(slide) {
    const style = window.getComputedStyle(slide);
    const matrix = style.transform.match(/matrix3d\((.+)\)/);

    if (matrix) {
      const value = matrix[1].split(", ");

      return parseFloat(value[14] || 0);
    }
    return 0;
  }

  function mapRange(value, inMin, inMax, outMin, outMax) {
    return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
  }

  slides.forEach((slide, index) => {
    const initialZ = getInitialTranslateZ(slide);

    ScrollTrigger.create({
      trigger: ".slider",
      start: "top 20%",
      end: "bottom 90%",
      scrub: 5,
      // markers: true,
      pinSpacing: true,
      onUpdate: (self) => {
        const progress = self.progress;
        const zIncrement = progress * 5000;
        const currentZ = initialZ + zIncrement;
        let opacity;
        console.log(initialZ);
        if (currentZ > -2500) {
          opacity = mapRange(currentZ, -2500, 0, 0.5, 1);
        } else {
          opacity = mapRange(currentZ, -5000, -2500, 0, 0.5);
        }
        slide.style.opacity = opacity;
        slide.style.transform = `translate3d(-50%,-50%,${currentZ}px)`;
      }
    });
  });
}
const init = () => {
  initLenis();
  hero();
  hoverIcon();
  testimonial();
  animationText();
  introduce();
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
