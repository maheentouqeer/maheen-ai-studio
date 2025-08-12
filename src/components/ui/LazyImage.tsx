import { useState } from "react";

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackSrc?: string;
}

const LazyImage = ({ src, alt, fallbackSrc = "/placeholder.svg", className = "", ...rest }: LazyImageProps) => {
  const [error, setError] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const source = error ? fallbackSrc : src;

  return (
    <div className={`relative overflow-hidden rounded-lg ring-1 ring-border bg-secondary/40 ${className}`}>
      {!loaded && (
        <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-primary/10 to-primary/5" aria-hidden />
      )}
      {/* eslint-disable-next-line jsx-a11y/img-redundant-alt */}
      <img
        src={source}
        alt={alt}
        loading="lazy"
        onError={() => setError(true)}
        onLoad={() => setLoaded(true)}
        className={`block w-full h-full object-cover transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0'}`}
        {...rest}
      />
    </div>
  );
};

export default LazyImage;
