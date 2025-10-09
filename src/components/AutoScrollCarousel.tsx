import { useEffect, useRef, useState } from "react";
import Image, { StaticImageData } from "next/image";
import { Poppins } from "next/font/google";

const poppins = Poppins({ subsets: ["latin"], weight: "400" });

interface PlatformFeature {
  image: StaticImageData | string;
  title: string;
  description: string;
}

interface AutoScrollCarouselProps {
  platformFeatures: PlatformFeature[];
}

const AutoScrollCarousel: React.FC<AutoScrollCarouselProps> = ({
  platformFeatures,
}) => {
  const [scrollPosition, setScrollPosition] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const speed = 0.5; // Adjust scroll speed (px per frame)
  const [singleSetWidth, setSingleSetWidth] = useState<number>(0);

  // Calculate width of one set of cards
  useEffect(() => {
    if (!containerRef.current) return;

    const resizeObserver = new ResizeObserver(() => {
      if (containerRef.current) {
        setSingleSetWidth(containerRef.current.scrollWidth / 2); // Width of first set (duplicate array)
      }
    });

    resizeObserver.observe(containerRef.current);

    return () => resizeObserver.disconnect();
  }, [platformFeatures]);

  // Animation loop
  useEffect(() => {
    if (singleSetWidth === 0) return;

    let animationFrameId: number;

    const animate = () => {
      setScrollPosition((prev) => {
        const next = prev + speed;
        return next >= singleSetWidth ? 0 : next; // Reset scroll for seamless loop
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => cancelAnimationFrame(animationFrameId);
  }, [singleSetWidth, speed]);

  return (
    <div className="w-full overflow-hidden mt-2">
      <div
        ref={containerRef}
        className="flex gap-4"
        style={{
          transform: `translateX(-${scrollPosition}px)`,
          width: "max-content",
        }}
      >
        {/* Duplicate cards once for seamless loop */}
        {Array(5)
          .fill(null)
          .flatMap(() => platformFeatures)
          .map((feature, index) => (
            <div key={index} className="flex-shrink-0 w-48 mt-2">
              <div className="bg-white rounded-4xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="relative h-40">
                  <Image
                    src={feature.image}
                    alt={feature.title}
                    fill
                    className="object-center rounded-b-4xl"
                  />
                </div>
                <div className="px-2 py-2 h-25">
                  <h4
                    className={`${poppins.className} font-semibold text-md text-black mb-1`}
                  >
                    {feature.title}
                  </h4>
                  <p
                    className={`${poppins.className} text-sm text-slate-800 leading-relaxed`}
                  >
                    {feature.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default AutoScrollCarousel;
