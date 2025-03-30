import React, { useState } from 'react'
import { Image } from 'react-bootstrap'
import tinntenLogo from '../../assets/logo.png' // adjust the path as needed
import { LazyLoadImage } from 'react-lazy-load-image-component';

const LazyImage = ({ src, alt, width,height, onClick }) => {
    const [imgSrc, setImgSrc] = useState(src)
    const handleError = () => setImgSrc(tinntenLogo)

    return (
        <LazyLoadImage
            alt={alt}
            height={height}
            src={src} // use normal <img> attributes as props
            width={width}
            onClick={onClick}
            onError={handleError} />
    )
}

export default LazyImage


/**
 *  <Image
      loading="lazy"
      src={imgSrc}
      alt={alt}
      className={className}
      onClick={onClick}
      onError={handleError}
    />
 */