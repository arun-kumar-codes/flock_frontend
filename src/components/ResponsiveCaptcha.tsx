"use client";

import { useEffect, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";

type ResponsiveCaptchaProps = {
  onChange: (token: string | null) => void;
  recaptchaRef: React.RefObject<ReCAPTCHA | null>;
  siteKey: string;
};

export const ResponsiveCaptcha: React.FC<ResponsiveCaptchaProps> = ({
  onChange,
  recaptchaRef,
  siteKey,
}) => {
  const [scale, setScale] = useState<number>(1);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 400) setScale(0.7);
      else if (width < 640) setScale(0.8);
      else if (width < 1024) setScale(0.9);
      else setScale(1);
    };

    handleResize(); // run on mount
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex justify-center w-full">
      <div
        className="origin-top"
        style={{
          transform: `scale(${scale * 0.8})`, // 🔹 reduce overall size by 20%
        transformOrigin: "top center",
        height: `${78 * scale * 0.8}px`,
        }}
      >
        <ReCAPTCHA
          ref={recaptchaRef}
          sitekey={siteKey}
          onChange={onChange}
          theme="light"
        />
      </div>
    </div>
  );
};
