// Splash Screen Animation - fragmented logo assemble
window.addEventListener("DOMContentLoaded", function () {
  const splashScreen = document.getElementById("splashScreen");
  const fragmentsContainer = document.getElementById("fragmentsContainer");
  const mainContent = document.getElementById("mainContent");

  if (!splashScreen || !fragmentsContainer) return;

  const logoSrc = "assets/images/logo_animate.svg";
  const img = new Image();
  img.src = logoSrc;

  img.onload = () => {
    const naturalW = img.naturalWidth || 600;
    const naturalH = img.naturalHeight || 180;

    // target display size for assembled logo (keeps it responsive)
    const maxTargetW = Math.min(460, Math.round(window.innerWidth * 0.45));
    const aspect = naturalW / naturalH || 3;
    const targetWidth = maxTargetW;
    const targetHeight = Math.round(targetWidth / aspect);

    fragmentsContainer.style.setProperty("--logo-width", targetWidth + "px");
    fragmentsContainer.style.setProperty("--logo-height", targetHeight + "px");
    fragmentsContainer.style.width = targetWidth + "px";
    fragmentsContainer.style.height = targetHeight + "px";

    // Grid density (more pieces on larger screens)
    let cols = 12;
    if (window.innerWidth > 1400) cols = 18;
    else if (window.innerWidth < 600) cols = 10;
    const rows = Math.max(6, Math.round((cols * targetHeight) / targetWidth));

    const pieceW = Math.ceil(targetWidth / cols);
    const pieceH = Math.ceil(targetHeight / rows);

    const pieces = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const piece = document.createElement("div");
        piece.className = "fragment-piece";
        piece.style.width = pieceW + "px";
        piece.style.height = pieceH + "px";
        piece.style.left = c * pieceW + "px";
        piece.style.top = r * pieceH + "px";
        piece.style.backgroundPosition = `-${c * pieceW}px -${r * pieceH}px`;
        piece.style.backgroundSize = `${targetWidth}px ${targetHeight}px`;

        // scattered initial transform
        const randX = (Math.random() - 0.5) * window.innerWidth * 1.2;
        const randY = (Math.random() - 0.5) * window.innerHeight * 1.0;
        const rot = (Math.random() - 0.5) * 720;
        const scl = 0.6 + Math.random() * 0.8;
        piece.style.transform = `translate(${randX}px, ${randY}px) rotate(${rot}deg) scale(${scl})`;
        piece.style.opacity = "0";

        fragmentsContainer.appendChild(piece);
        pieces.push(piece);
      }
    }

    // force reflow
    void fragmentsContainer.offsetWidth;

    // animate pieces into place with a stagger
    pieces.forEach((p, i) => {
      const delay = 120 + i * 12 + Math.random() * 180;
      setTimeout(() => {
        p.style.transform = "translate(0px, 0px) rotate(0deg) scale(1)";
        p.style.opacity = "1";
      }, delay);
    });

    // After assembled, keep briefly then hide splash and show page
    const totalDelay = 120 + pieces.length * 12 + 900;
    setTimeout(() => {
      splashScreen.style.transition = "opacity 600ms ease-out";
      splashScreen.style.opacity = "0";
      setTimeout(() => {
        splashScreen.style.display = "none";
        if (mainContent) mainContent.classList.add("show");
        document.body.classList.add("content-loaded");
        document.body.classList.remove("splash-active");
      }, 650);
    }, totalDelay);
  };

  // Fallback if image doesn't load quickly
  setTimeout(() => {
    if (!document.body.classList.contains("content-loaded")) {
      splashScreen.style.display = "none";
      if (mainContent) mainContent.classList.add("show");
      document.body.classList.add("content-loaded");
      document.body.classList.remove("splash-active");
    }
  }, 7000);
});

// Sticky header
window.addEventListener("scroll", function () {
  const header = document.querySelector(".header");
  if (!header) return;

  if (window.scrollY > 150) {
    header.classList.add("sticky");
  } else {
    header.classList.remove("sticky");
  }
});

// Home slider
if (document.querySelector(".home-slider")) {
  $(document).ready(function () {
    $(".home-slider").slick({
      dots: true,
      arrows: true,
      autoplay: false,
      autoplaySpeed: 5000,
      prevArrow: $(".prev"),
      nextArrow: $(".next"),
      breakpoints: {
        576: {
          prevArrow: false,
        }
      }
    });
  });
}

//Scroll animation
document.addEventListener("DOMContentLoaded", function () {
  if (document.querySelector(".card-animate")) {
    ScrollOut({
      threshold: 0.8,
      cssProps: { visibleY: true },
    });
  }
});



// AOS
window.addEventListener("load", function () {
  AOS.init({
    once: false,
    duration: 1200,
    easing: "ease-out",
    mirror: true,
  });

  if (document.querySelector(".home-slider")) {
    $(".home-slider").on("setPosition", function () {
      AOS.refresh();
    });
  }
});

// Single project page slider
if (document.querySelector(".project-slider")) {
  $(document).ready(function () {
    const $slider = $(".project-slider");

    $slider.slick({
      infinite: true,
      slidesToShow: 1,
      slidesToScroll: 1,
      speed: 500,
      arrows: true,
      autoplay: false,
      centerMode: true,
      centerPadding: "25%",
      prevArrow: $(".prevBtn"),
      nextArrow: $(".nextBtn"),
        responsive: [
    {
      breakpoint: 576,
      settings: {
        slidesToShow: 1,
        centerMode: true,
        centerPadding: '10%',
        prevArrow:'',
        nextArrow:'',
      }
    }
  ]

    });

    $slider.on(
      "beforeChange",
      function (event, slick, currentSlide, nextSlide) {
        if (currentSlide !== nextSlide) {
          document
            .querySelectorAll(".slick-center + .slick-cloned")
            .forEach((next) => {
              setTimeout(() =>
                next.classList.add("slick-current", "slick-center")
              );
            });
        }
      }
    );
  });
}

// Projects page - expandable cards with slider
document.addEventListener("DOMContentLoaded", function () {
  const projectCards = document.querySelectorAll(".projects-grid .project-card");
  let currentExpandedCard = null;
  let currentSwiper = null;

  // Generate slider data from images (add text slides between images)
  function generateSliderData(images) {
    const sliderData = [];
    const textContent = "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ratione id nemo tempora ducimus nostrum fugiat laboriosam asperiores incidunt a eos ipsum quis reprehenderit alias debitis officia enim quibusdam, architecto dolores?";
    
    images.forEach((imageSrc, index) => {
      // Add image slide
      sliderData.push({
        type: "image",
        src: imageSrc
      });
      
      // Add text slide after each image (except the last one)
      if (index < images.length - 1) {
        sliderData.push({
          type: "text",
          content: textContent
        });
      }
    });
    
    return sliderData;
  }

  // Create Swiper slider
  function createSlider(card, sliderData) {
    const sliderContainer = document.createElement("div");
    sliderContainer.className = "project-slider-container";

    const swiperWrapper = document.createElement("div");
    swiperWrapper.className = "swiper project-expanded-slider";

    const swiperContainer = document.createElement("div");
    swiperContainer.className = "swiper-wrapper";

    // Create slides (alternating image-text)
    sliderData.forEach((slideData) => {
      const slide = document.createElement("div");
      slide.className = `swiper-slide ${slideData.type === "image" ? "image-slide" : "text-slide"}`;

      if (slideData.type === "image") {
        const img = document.createElement("img");
        img.src = slideData.src;
        img.alt = "Project slide";
        slide.appendChild(img);
      } else {
        const p = document.createElement("p");
        p.textContent = slideData.content;
        slide.appendChild(p);
      }

      swiperContainer.appendChild(slide);
    });

    swiperWrapper.appendChild(swiperContainer);
    
    // Create navigation buttons
    const prevBtn = document.createElement("button");
    prevBtn.className = "project-slider-prev";
    prevBtn.innerHTML = '<img src="assets/images/Arrow_left.svg" alt="Previous" />';
    prevBtn.type = "button";
    
    const nextBtn = document.createElement("button");
    nextBtn.className = "project-slider-next";
    nextBtn.innerHTML = '<img src="assets/images/Arrow_right.svg" alt="Next" />';
    nextBtn.type = "button";
    
    swiperWrapper.appendChild(prevBtn);
    swiperWrapper.appendChild(nextBtn);
    
    sliderContainer.appendChild(swiperWrapper);

    return { container: sliderContainer, swiperWrapper: swiperWrapper, prevBtn: prevBtn, nextBtn: nextBtn };
  }

  // Expand card
  function expandCard(card) {
    // Close previously expanded card if any
    if (currentExpandedCard && currentExpandedCard !== card) {
      closeExpandedCard(currentExpandedCard);
    }

    // Get slider data
    const image = card.querySelector(".project-image");
    let sliderData;
    
    // Check if data-slider-data exists (new format)
    const sliderDataAttr = image.getAttribute("data-slider-data");
    if (sliderDataAttr) {
      sliderData = JSON.parse(sliderDataAttr);
    } else {
      // Fallback to old format - generate from images
      const sliderImagesJson = image.getAttribute("data-slider-images");
      if (sliderImagesJson) {
        const sliderImages = JSON.parse(sliderImagesJson);
        sliderData = generateSliderData(sliderImages);
      } else {
        return;
      }
    }

    // Add expanded class to trigger width animation
    card.classList.add("expanded");

    // Create and append slider
    const { container, swiperWrapper, prevBtn, nextBtn } = createSlider(card, sliderData);
    card.insertBefore(container, card.querySelector(".project-link"));

    // Initialize Swiper after a short delay to ensure DOM is ready
    setTimeout(() => {
      currentSwiper = new Swiper(swiperWrapper, {
        slidesPerView: "auto",
        spaceBetween: 20,
        freeMode: {
          enabled: true,
          sticky: false,
        },
        grabCursor: true,
        navigation: {
          prevEl: prevBtn,
          nextEl: nextBtn,
        },
        breakpoints: {
          768: {
            spaceBetween: 30,
          },
          1024: {
            spaceBetween: 40,
          }
        }
      });
    }, 100);

    // Fade in slider after expansion animation
    setTimeout(() => {
      container.style.transition = "opacity 0.5s ease-in-out";
      container.style.opacity = "1";
    }, 350);

    // Scroll to card - center it on screen
    card.scrollIntoView({ behavior: "smooth", block: "center" });

    currentExpandedCard = card;
  }

  // Close expanded card
  function closeExpandedCard(card) {
    // Destroy Swiper instance
    if (currentSwiper) {
      currentSwiper.destroy(true, true);
      currentSwiper = null;
    }

    card.classList.remove("expanded");
    
    // Remove slider container
    const sliderContainer = card.querySelector(".project-slider-container");
    
    if (sliderContainer) {
      sliderContainer.style.opacity = "0";
      setTimeout(() => {
        sliderContainer.remove();
      }, 300);
    }

    currentExpandedCard = null;
  }

  // Add click event to project cards
  projectCards.forEach((card) => {
    const image = card.querySelector(".project-image");
    
    if (image) {
      card.addEventListener("click", function (e) {
        // Mobile: navigate to singleProduct page
        if(window.innerWidth < 768){
          window.location.href = "singleProduct.html";
          return;
        }
        
        e.preventDefault();
        e.stopPropagation();
        
        // Desktop: expand card
        // If already expanded, close it
        if (card.classList.contains("expanded")) {
          closeExpandedCard(card);
        } else {
          expandCard(card);
        }
      });
    }
  });

  // Close on escape key
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && currentExpandedCard) {
      closeExpandedCard(currentExpandedCard);
    }
  });
});

