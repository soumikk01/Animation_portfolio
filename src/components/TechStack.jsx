import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './TechStack.css';

gsap.registerPlugin(ScrollTrigger);

const techData = [
  {
    category: 'Frontend',
    items: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'GSAP', 'Three.js'],
  },
  {
    category: 'Backend',
    items: ['Node.js', 'Express', 'MongoDB', 'PostgreSQL', 'Firebase'],
  },
  {
    category: 'Tools',
    items: ['Git', 'Docker', 'Figma', 'Blender', 'WebGL'],
  },
];

const TechStack = () => {
  const sectionRef = useRef(null);
  const svgRef = useRef(null);

  useEffect(() => {
    const paths = svgRef.current.querySelectorAll('.branch-path');

    paths.forEach((path) => {
      const length = path.getTotalLength();
      gsap.set(path, {
        strokeDasharray: length,
        strokeDashoffset: length,
        opacity: 0,
      });

      gsap.to(path, {
        strokeDashoffset: 0,
        opacity: 1,
        duration: 1,
        delay: 0.1 + path.getAttribute('data-index') * 0.03,
        ease: 'power2.inOut',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 65%',
          once: true, // Play animation only once
        },
      });
    });

    // Animate nodes
    gsap.fromTo(
      '.tech-node',
      { scale: 0, opacity: 0 },
      {
        scale: 1,
        opacity: 1,
        duration: 0.5,
        stagger: 0.04,
        ease: 'back.out(1.5)',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 65%',
          once: true, // Play animation only once
        },
      }
    );
  }, []);

  return (
    <section ref={sectionRef} id="tech-stack" className="tech-stack-premium">
      <div className="container">
        <h2 className="section-title">01 / Tech Stack</h2>

        <div className="tech-map-container">
          <svg
            ref={svgRef}
            className="connectivity-svg"
            viewBox="0 0 1100 1400"
            preserveAspectRatio="xMidYMid meet"
          >
            {/* Organic Branches (Tentacles) */}

            {/* 1. Vertical Spinal Trunk (Left) */}
            <path
              className="branch-path spinal-trunk"
              data-index="0"
              d={`M 15 230 L 15 1070`} // Centered margin (x=15)
              fill="none"
              stroke="url(#branch-gradient)"
              strokeWidth="3"
            />

            {techData.map((cat, catIdx) => {
              const baseTop = 200 + catIdx * 420; // Professional 420px step
              const categoryNodeCenterY = baseTop + 30;

              return (
                <path
                  key={`trunk-conn-${catIdx}`}
                  className="branch-path connection-trunk"
                  data-index="1"
                  d={`M 15 ${categoryNodeCenterY} L 30 ${categoryNodeCenterY}`} // Connection to x=30 (node start)
                  fill="none"
                  stroke="url(#branch-gradient)"
                  strokeWidth="3"
                />
              );
            })}

            {/* 2. Vertical Spinal Trunk (Right) */}
            <path
              className="branch-path spinal-trunk-right"
              data-index="100" // Animate after all items
              d={`M 1085 150 L 1085 1150`} // Centered margin (x=1085)
              fill="none"
              stroke="url(#branch-gradient)"
              strokeWidth="3"
            />

            {techData.map((cat, catIdx) =>
              cat.items.map((item, itemIdx) => {
                // Vertical spacing: 420px step per category
                const baseTop = 200 + catIdx * 420;

                // Category node: Left side
                const categoryNodeCenterY = baseTop + 30;
                const categoryNodeRightX = 30 + 180; // 30 (left) + 180 (width) = 210

                // Tech items: Right side
                const techItemGap = 65; // Professional balanced gap
                const totalItemsHeight = (cat.items.length - 1) * techItemGap;
                const startItemY = categoryNodeCenterY - totalItemsHeight / 2;

                const itemNodeCenterY = startItemY + itemIdx * techItemGap;
                const itemNodeLeftX = 850;
                const itemNodeRightX = itemNodeLeftX + 160;

                // Middle point for "bundling" effect
                const midX = (categoryNodeRightX + itemNodeLeftX) / 2;

                // Control points for organic "tentacle" curve
                const controlX1 = categoryNodeRightX + 150;
                const controlX2 = midX - 50;
                const controlX4 = itemNodeLeftX - 150;

                // Global index for stagger
                const globalIndex =
                  2 +
                  techData.slice(0, catIdx).reduce((acc, c) => acc + c.items.length, 0) +
                  itemIdx;

                return (
                  <>
                    <path
                      data-index={globalIndex}
                      className="branch-path"
                      d={`M ${categoryNodeRightX} ${categoryNodeCenterY} 
                                               C ${controlX1} ${categoryNodeCenterY}, ${controlX2} ${itemNodeCenterY}, ${midX} ${itemNodeCenterY}
                                               S ${controlX4} ${itemNodeCenterY}, ${itemNodeLeftX} ${itemNodeCenterY}`}
                      fill="none"
                      stroke="url(#branch-gradient)"
                      strokeWidth="2.5"
                    />
                    {/* Connection to Right Trunk */}
                    <path
                      data-index={globalIndex + 1}
                      className="branch-path connection-trunk-right"
                      d={`M ${itemNodeRightX} ${itemNodeCenterY} L 1085 ${itemNodeCenterY}`}
                      fill="none"
                      stroke="url(#branch-gradient)"
                      strokeWidth="2"
                    />
                  </>
                );
              })
            )}

            <defs>
              <linearGradient id="branch-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgba(168, 85, 247, 0.2)" />
                <stop offset="30%" stopColor="rgba(168, 85, 247, 0.8)" />
                <stop offset="70%" stopColor="rgba(168, 85, 247, 0.8)" />
                <stop offset="100%" stopColor="rgba(168, 85, 247, 0.2)" />
              </linearGradient>
            </defs>
          </svg>

          <div className="tech-nodes">
            {techData.map((cat, catIdx) => {
              const baseTop = 200 + catIdx * 420;
              const categoryNodeCenterY = baseTop + 30;
              const techItemGap = 65;
              const totalItemsHeight = (cat.items.length - 1) * techItemGap;
              const startItemY = categoryNodeCenterY - totalItemsHeight / 2;

              return (
                <div key={catIdx} className="tech-category-group">
                  <div
                    className="tech-node category-node"
                    style={{ top: `${baseTop}px`, left: '30px' }}
                  >
                    <span className="node-label">{cat.category}</span>
                    <div className="node-glow"></div>
                  </div>

                  {cat.items.map((item, itemIdx) => (
                    <div
                      key={itemIdx}
                      className="tech-node item-node"
                      style={{ top: `${startItemY + itemIdx * techItemGap - 20}px`, left: '850px' }}
                    >
                      <span className="node-label small">{item}</span>
                      <div className="node-glow small"></div>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TechStack;
