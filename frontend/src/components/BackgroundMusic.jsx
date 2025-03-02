import React, { useEffect, useRef } from "react";

const BackgroundMusic = ({ audioFile, volume }) => {
  const audioRef = useRef(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume; // Adjust volume based on the prop
    }
  }, [volume]); // Ensure volume updates when prop changes

  return (
    <audio ref={audioRef} src={audioFile} loop autoPlay>
      Your browser does not support the audio element.
    </audio>
  );
};

export default BackgroundMusic;
