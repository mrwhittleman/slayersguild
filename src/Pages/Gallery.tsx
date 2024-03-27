import { useEffect, useState } from "react";

import Details from "@/components/Details";
import Imageview from "@/components/Imageview";
import Stats from "@/components/Stats";

const GalleryPage = () => {
  const [isOpen, setIsOpen] = useState(false);

  function handleClick() {
    setIsOpen(!isOpen);
  }

  return (
    <section className="flex w-full gap-4">
      <div className="flex flex-col basis-full gap-4">
        {isOpen && <Details />}
        <Imageview />
      </div>
      {isOpen && <Stats />}
    </section>
  );
};

export default GalleryPage;
