import { useEffect, useRef } from "react";

function StarField({ isDark = false }) {
  const containerRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;

    if (!container || !isDark) {
      return;
    }

    const starCount = 95;
    const stars = [];

    container.innerHTML = "";

    for (let index = 0; index < starCount; index += 1) {
      const random = Math.random();

      const isHeroStar = random < 0.06;
      const isLargeStar =
        random >= 0.06 && random < 0.32;

      const size = isHeroStar
        ? Math.random() * 2.5 + 4
        : isLargeStar
        ? Math.random() * 1.8 + 2
        : Math.random() * 1.3 + 0.8;

      const x = Math.random() * 100;
      const y = Math.random() * 100;

      const moveSpeed =
        Math.random() * 0.0007 + 0.00025;

      const moveRadius =
        Math.random() * 9 + 3;

      const twinkleSpeed =
        Math.random() * 0.002 + 0.0007;

      const phase =
        Math.random() * Math.PI * 2;

      const depth =
        Math.random() * 0.75 + 0.25;

      const star = document.createElement("div");

      star.style.position = "absolute";
      star.style.left = `${x}%`;
      star.style.top = `${y}%`;
      star.style.width = `${size}px`;
      star.style.height = `${size}px`;
      star.style.borderRadius = "50%";
      star.style.pointerEvents = "none";
      star.style.willChange =
        "transform, opacity";

      /* =====================================================
         STAR COLORS
         ===================================================== */

      if (isHeroStar) {
        star.style.background =
          "rgba(255,255,255,1)";

        star.style.boxShadow =
          "0 0 8px rgba(255,255,255,1), " +
          "0 0 18px rgba(199,210,254,0.95), " +
          "0 0 34px rgba(129,140,248,0.8), " +
          "0 0 50px rgba(99,102,241,0.4)";
      } else if (isLargeStar) {
        star.style.background =
          "rgba(248,250,252,0.98)";

        star.style.boxShadow =
          "0 0 6px rgba(255,255,255,0.9), " +
          "0 0 14px rgba(165,180,252,0.75), " +
          "0 0 26px rgba(129,140,248,0.45)";
      } else {
        star.style.background =
          "rgba(224,231,255,0.9)";

        star.style.boxShadow =
          "0 0 4px rgba(255,255,255,0.6), " +
          "0 0 9px rgba(129,140,248,0.35)";
      }

      container.appendChild(star);

      stars.push({
        element: star,
        depth,
        moveSpeed,
        moveRadius,
        twinkleSpeed,
        phase,
        isLargeStar,
        isHeroStar,
      });
    }

    /* =====================================================
       STAR ANIMATION
       
       IMPORTANT:
       No mouse tracking.
       No cursor movement.
       No parallax.
       The background stays fixed relative to the page.
       Only the stars themselves gently move and twinkle.
       ===================================================== */

    const animate = (time) => {
      stars.forEach((star) => {
        const naturalX =
          Math.sin(
            time * star.moveSpeed +
              star.phase
          ) *
          star.moveRadius;

        const naturalY =
          Math.cos(
            time *
              star.moveSpeed *
              0.75 +
              star.phase
          ) *
          star.moveRadius;

        const pulse =
          Math.sin(
            time *
              star.twinkleSpeed +
              star.phase
          );

        const baseOpacity =
          star.isHeroStar
            ? 0.95
            : star.isLargeStar
            ? 0.75
            : 0.45;

        const opacity =
          baseOpacity +
          pulse * 0.2;

        const scale =
          1 +
          (pulse + 1) * 0.09;

        star.element.style.transform =
          `translate3d(${naturalX}px, ${naturalY}px, 0) scale(${scale})`;

        star.element.style.opacity =
          Math.min(
            1,
            Math.max(0.1, opacity)
          );
      });

      animationRef.current =
        requestAnimationFrame(animate);
    };

    animationRef.current =
      requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(
        animationRef.current
      );

      container.innerHTML = "";
    };
  }, [isDark]);

  if (!isDark) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 overflow-hidden"
      style={{
        zIndex: 1,
      }}
    />
  );
}

export default StarField;