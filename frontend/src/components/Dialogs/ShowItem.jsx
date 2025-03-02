import React, { useState } from "react";

const ShowItem = ({ imageSrc, itemComponent: ItemComponent, onFinish }) => {
  const [showItem, setShowItem] = useState(false);

  const handleClick = () => {
    setShowItem(!showItem);
    if (showItem && onFinish) onFinish();
  };

  return (
    <div className="relative">
      <img
        src={imageSrc}
        onClick={handleClick}
        className="cursor-pointer w-14"
        alt="Show Item Icon"
      />
      {showItem && (
        <div className="absolute top-0 left-8 mt-4">
          <ItemComponent
            onFinish={() => {
              setShowItem(false);
              if (onFinish) onFinish();
            }}
            handleClick={handleClick} // Pass handleClick to the ItemComponent
          />
        </div>
      )}
    </div>
  );
};

export default ShowItem;
