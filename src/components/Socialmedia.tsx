import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTelegram, faXTwitter } from "@fortawesome/free-brands-svg-icons";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faBook } from "@fortawesome/free-solid-svg-icons";

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
      <a href="/" target="_blank" rel="noopener noreferrer">
        <FontAwesomeIcon icon={faTelegram as IconProp} className="text-2xl" />
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
