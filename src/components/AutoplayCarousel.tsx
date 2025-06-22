
import React, { useEffect, useRef } from "react";
import { Carousel, CarouselContent, CarouselNext, CarouselPrevious, type CarouselApi } from "@/components/ui/carousel";

interface AutoplayCarouselProps {
  children: React.ReactNode;
  className?: string;
  interval?: number;
}

const AutoplayCarousel = ({ children, className, interval = 3000 }: AutoplayCarouselProps) => {
  const [api, setApi] = React.useState<CarouselApi>();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!api) return;

    const startAutoplay = () => {
      intervalRef.current = setInterval(() => {
        if (api.canScrollNext()) {
          api.scrollNext();
        } else {
          api.scrollTo(0);
        }
      }, interval);
    };

    const stopAutoplay = () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };

    startAutoplay();

    api.on("pointerDown", stopAutoplay);
    api.on("pointerUp", startAutoplay);

    return () => {
      stopAutoplay();
      api?.off("pointerDown", stopAutoplay);
      api?.off("pointerUp", startAutoplay);
    };
  }, [api, interval]);

  return (
    <Carousel
      setApi={setApi}
      className={className}
      opts={{
        align: "start",
        loop: true,
      }}
    >
      {children}
      <CarouselPrevious className="left-2" />
      <CarouselNext className="right-2" />
    </Carousel>
  );
};

export default AutoplayCarousel;
