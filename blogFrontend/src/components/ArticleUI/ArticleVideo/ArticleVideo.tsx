import React from 'react';

interface ArticleVideoProps extends React.VideoHTMLAttributes<HTMLVideoElement> {
  className?: string;
}

const ArticleVideo: React.FC<ArticleVideoProps> = ({
  src,
  controls = true,
  poster,
  autoPlay = false,
  loop = false,
  muted = false,
  style,
  className = '',
  ...rest
}) => {
  return (
    <video
      src={src}
      controls={controls}
      poster={poster}
      autoPlay={autoPlay}
      loop={loop}
      muted={muted}
      className={className}
      style={{
        display: 'block',
        width: '80%',
        maxWidth: 700,
        margin: '1.2em auto',
        borderRadius: 8,
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        background: '#000',
        ...style,
      }}
      {...rest}
    />
  );
};

export default ArticleVideo; 