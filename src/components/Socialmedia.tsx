import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXTwitter } from "@fortawesome/free-brands-svg-icons";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faBook, faCartShopping } from "@fortawesome/free-solid-svg-icons";

const Socialmedia = () => {
  return (
    <div className="sticky top-0 flex w-full p-4 justify-center gap-16 z-50">
      <a
        href="https://twitter.com/VeChainSlayers"
        target="_blank"
        rel="noopener noreferrer"
      >
        <FontAwesomeIcon icon={faXTwitter as IconProp} className="text-2xl" />
      </a>
      <a
        href="https://worldofv.art/collection/Slayers"
        target="_blank"
        rel="noopener noreferrer"
      >
        <FontAwesomeIcon
          icon={faCartShopping as IconProp}
          className="text-2xl"
        />
      </a>
      <a
        href="https://docs.slayersguild.io/"
        target="_blank"
        rel="noopener noreferrer"
      >
        <FontAwesomeIcon icon={faBook as IconProp} className="text-2xl" />
      </a>
    </div>
  );
};

export default Socialmedia;
