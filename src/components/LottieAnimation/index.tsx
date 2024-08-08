import { useRef, useEffect } from "react";
import lottie, { AnimationItem } from "lottie-web";

interface ILottieAnimationProps {
  className?: string;
  style?: React.CSSProperties;
  animationData: object;
  loop?: boolean;
  autoplay?: boolean;
  renderer?: "svg" | "canvas" | "html";
}

const LottieAnimation: React.FC<ILottieAnimationProps> = ({
  className,
  style,
  animationData,
  loop = true,
  autoplay = true,
  renderer = "svg",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const animation = useRef<AnimationItem | null>(null);

  useEffect(() => {
    if (!animation.current) {
      animation.current = lottie.loadAnimation({
        container: containerRef.current!,
        renderer,
        loop,
        autoplay,
        animationData,
      });
    }
    return () => {
      if (animation.current) {
        animation.current.stop();
        animation.current.destroy();
        animation.current = null;
      }
    };
  }, [animationData, loop, autoplay, renderer]);

  return <div className={className} style={style} ref={containerRef} />;
};

export default LottieAnimation;
