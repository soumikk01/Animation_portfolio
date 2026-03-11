import { useRef, useEffect, useState, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './TechStack.scss';
import { 
  FaReact, 
  FaNode, 
  FaGitAlt, 
  FaDocker, 
  FaFigma,
  FaAws,
  FaInfinity
} from 'react-icons/fa';
import { 
  SiNextdotjs, 
  SiTypescript, 
  SiTailwindcss, 
  SiExpress, 
  SiMongodb, 
  SiPostgresql, 
  SiFirebase, 
  SiBlender, 
  SiWebgl,
  SiThreedotjs,
  SiGreensock,
  SiSpringboot,
  SiGithubactions,
  SiMysql,
  SiSqlite,
  SiNgrok
} from 'react-icons/si';

gsap.registerPlugin(ScrollTrigger);

const techData = [
  {
    category: 'Frontend',
    items: [
      { name: 'React', icon: FaReact },
      { name: 'Next.js', icon: SiNextdotjs },
      { name: 'TypeScript', icon: SiTypescript },
      { name: 'Tailwind CSS', icon: SiTailwindcss },
      { name: 'GSAP', icon: SiGreensock },
      { name: 'Three.js', icon: SiThreedotjs },
      { name: 'WebGL', icon: SiWebgl },
    ],
  },
  {
    category: 'Backend',
    items: [
      { name: 'Node.js', icon: FaNode },
      { name: 'Express', icon: SiExpress },
      { name: 'SpringBoot', icon: SiSpringboot },
    ],
  },
  {
    category: 'Database',
    items: [
      { name: 'PostgreSQL', icon: SiPostgresql },
      { name: 'MySQL', icon: SiMysql },
      { name: 'MongoDB', icon: SiMongodb },
      { name: 'SQLite', icon: SiSqlite },
    ],
  },
  {
    category: 'devops & cloud',
    items: [
      { name: 'AWS', icon: FaAws },
      { name: 'Firebase', icon: SiFirebase },
      { name: 'CI/CD (GitHub Actions)', icon: SiGithubactions },
      { name: 'Docker', icon: FaDocker },
    ],
  },
  {
    category: 'Tools',
    items: [
      { name: 'Git', icon: FaGitAlt },
      { name: 'Blender', icon: SiBlender },
      { name: 'ngrok', icon: SiNgrok },
    ],
  },
];

const TechStack = () => {
  const sectionRef = useRef(null);
  const containerRef = useRef(null);
  const [paths, setPaths] = useState([]);

  const calculatePaths = () => {
    if (!containerRef.current) return;
    const newPaths = [];
    const containerRect = containerRef.current.getBoundingClientRect();
    const categories = containerRef.current.querySelectorAll('.tech-category');

    categories.forEach((cat) => {
      const header = cat.querySelector('.category-header');
      const items = cat.querySelectorAll('.tech-item');
      if (!header || items.length === 0) return;

      const headerRect = header.getBoundingClientRect();
      const startX = headerRect.left + headerRect.width / 2 - containerRect.left;
      const startY = headerRect.bottom - containerRect.top + 5;

      items.forEach((item) => {
        const itemRect = item.getBoundingClientRect();
        const endX = itemRect.left + itemRect.width / 2 - containerRect.left;
        const endY = itemRect.top - containerRect.top;

        const distY = endY - startY;
        const cp1y = startY + distY * 0.4;
        const cp2y = endY - distY * 0.4;
        
        const pathData = `M ${startX} ${startY} C ${startX} ${cp1y}, ${endX} ${cp2y}, ${endX} ${endY}`;
        newPaths.push(pathData);
      });
    });

    setPaths(newPaths);
  };

  useLayoutEffect(() => {
    // Wrap initial call in requestAnimationFrame to avoid synchronous setState lint warning
    const rafId = requestAnimationFrame(() => {
      calculatePaths();
    });
    
    window.addEventListener('resize', calculatePaths);
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', calculatePaths);
    };
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    // Animate category headers
    gsap.fromTo(
      '.category-header',
      { x: -50, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 65%',
          once: true,
        },
      }
    );

    // Animate tech items
    gsap.fromTo(
      '.tech-item',
      { scale: 0, opacity: 0 },
      {
        scale: 1,
        opacity: 1,
        duration: 0.5,
        stagger: 0.05,
        ease: 'back.out(1.5)',
        scrollTrigger: {
          trigger: section,
          start: 'top 65%',
          once: true,
          onEnter: () => {
            document.querySelectorAll('.tech-category').forEach(cat => {
              cat.classList.add('active');
            });
            // Animate SVG paths
            gsap.fromTo('.curvy-path', 
              { strokeDashoffset: 1000, opacity: 0 },
              { 
                strokeDashoffset: 0, 
                opacity: 0.7, 
                duration: 2.5, 
                stagger: 0.03,
                ease: 'power2.inOut' 
              }
            );

          }
        },
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.trigger === section) {
          trigger.kill();
        }
      });
    };
  }, []);

  return (
    <section ref={sectionRef} id="tech-stack" className="tech-stack-premium">
      <div className="container" ref={containerRef} style={{ position: 'relative' }}>
        <h2 className="section-title">01 / Tech Stack</h2>

        {/* Dynamic Curvy Connections */}
        <svg className="tech-curves-svg" style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 0
        }}>
          {/* Individual Curves */}
          {paths.map((p, i) => (
            <path 
              key={i} 
              d={p} 
              className="curvy-path"
              fill="none" 
              stroke="var(--accent-color)" 
              strokeWidth="2.5"
              strokeDasharray="1000"
              strokeDashoffset="1000"
              style={{ opacity: 0 }}
            />
          ))}

        </svg>

        <div className="tech-stack-content">
          {techData.map((category, catIdx) => (
            <div key={catIdx} className="tech-category">
              <h3 className="category-header">{category.category}</h3>
              <div className="tech-items-row">
                {category.items.map((item, itemIdx) => {
                  const IconComponent = item.icon;
                  return (
                    <div key={itemIdx} className="tech-item">
                      <IconComponent className="tech-icon" />
                      <span className="item-label">{item.name}</span>
                      <div className="item-glow"></div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TechStack;
