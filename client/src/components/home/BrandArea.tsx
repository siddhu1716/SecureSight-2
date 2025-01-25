import { useEffect } from 'react'
import './BrandArea.css' // We'll create this file next

export default function BrandArea() {
  useEffect(() => {
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      addAnimation();
    }
  }, []);

  const addAnimation = () => {
    const scrollers = document.querySelectorAll(".scroller");
    scrollers.forEach((scroller) => {
      scroller.setAttribute("data-animated", "true");
      const scrollerInner = scroller.querySelector(".scroller__inner");
      if (!scrollerInner) return;

      const scrollerContent = Array.from(scrollerInner.children);
      // Double the items for seamless scrolling
      scrollerContent.forEach((item) => {
        const duplicatedItem = item.cloneNode(true) as HTMLElement;
        duplicatedItem.setAttribute("aria-hidden", "true");
        scrollerInner.appendChild(duplicatedItem);
      });
    });
  };

  return (
    <div className="brand-area">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <h2 className="text-center mb-4">Technologies We Work With</h2>
            <div className="scroller" data-speed="fast">
              <div className="scroller__inner">
                <div className="tech-item">
                  <h3>Python</h3>
                </div>
                <div className="tech-item">
                  <h3>AWS</h3>
                </div>
                <div className="tech-item">
                  <h3>React</h3>
                </div>
                <div className="tech-item">
                  <h3>Flask</h3>
                </div>
                <div className="tech-item">
                  <h3>Machine Learning</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
