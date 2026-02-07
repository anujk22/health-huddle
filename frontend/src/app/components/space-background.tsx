import { useEffect, useRef } from 'react';

export function SpaceBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      // Reinitialize stars when canvas resizes
      initStars();
    };
    
    // Create stars
    const stars: { x: number; y: number; size: number; speed: number; opacity: number }[] = [];
    const numStars = 200;

    const initStars = () => {
      stars.length = 0;
      for (let i = 0; i < numStars; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 2,
          speed: Math.random() * 0.5 + 0.1,
          opacity: Math.random() * 0.5 + 0.5
        });
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Animation loop
    let animationId: number;
    const animate = () => {
      // Fully clear canvas with solid black
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      stars.forEach((star) => {
        // Update position
        star.y += star.speed;
        if (star.y > canvas.height) {
          star.y = 0;
          star.x = Math.random() * canvas.width;
        }

        // Draw star
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
        ctx.fill();

        // Add glow for larger stars
        if (star.size > 1) {
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.size * 2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity * 0.2})`;
          ctx.fill();
        }
      });

      animationId = requestAnimationFrame(animate);
    };

    // Start animation immediately
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}

// Aurora/mist overlay component for colorful fog effects
export function AuroraOverlay() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 1 }}>
      {/* Cyan aurora top */}
      <div
        className="absolute -top-1/2 left-1/4 w-[800px] h-[800px] rounded-full opacity-20 blur-3xl animate-pulse"
        style={{
          background: 'radial-gradient(circle, rgba(0, 255, 255, 0.4) 0%, transparent 70%)',
          animation: 'float 20s ease-in-out infinite',
        }}
      />
      
      {/* Magenta aurora right */}
      <div
        className="absolute top-1/4 -right-1/4 w-[1000px] h-[1000px] rounded-full opacity-15 blur-3xl"
        style={{
          background: 'radial-gradient(circle, rgba(255, 0, 255, 0.3) 0%, transparent 70%)',
          animation: 'float 25s ease-in-out infinite reverse',
        }}
      />
      
      {/* Green aurora bottom left */}
      <div
        className="absolute -bottom-1/3 -left-1/4 w-[900px] h-[900px] rounded-full opacity-15 blur-3xl"
        style={{
          background: 'radial-gradient(circle, rgba(0, 255, 136, 0.3) 0%, transparent 70%)',
          animation: 'float 30s ease-in-out infinite',
        }}
      />
      
      {/* Yellow aurora center-right */}
      <div
        className="absolute top-1/2 right-1/3 w-[700px] h-[700px] rounded-full opacity-10 blur-3xl"
        style={{
          background: 'radial-gradient(circle, rgba(255, 255, 0, 0.2) 0%, transparent 70%)',
          animation: 'float 22s ease-in-out infinite reverse',
        }}
      />

      <style>{`
        @keyframes float {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(50px, -50px) scale(1.1); }
          50% { transform: translate(-30px, -100px) scale(0.9); }
          75% { transform: translate(-50px, 50px) scale(1.05); }
        }
      `}</style>
    </div>
  );
}

// Grid overlay component for sci-fi feel
export function GridOverlay() {
  return (
    <div className="fixed inset-0 pointer-events-none opacity-10" style={{ zIndex: 1 }}>
      <div
        className="w-full h-full"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0, 255, 255, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 255, 255, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}
      />
    </div>
  );
}