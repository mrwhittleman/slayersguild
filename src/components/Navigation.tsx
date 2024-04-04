import { useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBook } from "@fortawesome/free-solid-svg-icons";
import Wallet from "@/components/Wallet";
import logo from "@/assets/logo-test.png";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";

type Link = {
  name: string;
  path: string;
  options?: { target: string; rel: string };
  icon?: JSX.Element;
}[];

const links: Link = [
  { name: "Home", path: "/" },
  { name: "My Slayers", path: "/my-slayer" },
  { name: "Slayer Gallery", path: "/gallery" },
  { name: "Altar of Sacrifice", path: "/altar" },
  { name: "About", path: "/about" },
  {
    name: "Documentation",
    icon: <FontAwesomeIcon icon={faBook} />,
    path: "https://docs.slayersguild.io/",
    options: { target: "_blank", rel: "noreferrer" },
  },
];

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <nav className="flex w-full px-4 lg:px-12 py-4 bg-accent border-b border-tertiary">
        <div className="flex lg:hidden items-center w-1/4">
          <Sheet onOpenChange={() => setIsOpen((prevIsOpen) => !prevIsOpen)}>
            <SheetTrigger>
              <div className="flex flex-col gap-1">
                <span
                  className={`block w-6 h-0.5 bg-tertiary transform transition-transform duration-500 ${
                    isOpen ? "rotate-45 translate-y-2" : ""
                  }`}
                ></span>
                <span
                  className={`block w-6 h-0.5 bg-tertiary transform transition-transform duration-300 ${
                    isOpen ? "opacity-0" : ""
                  }`}
                ></span>
                <span
                  className={`block w-6 h-0.5 bg-tertiary transform transition-transform duration-500 ${
                    isOpen ? "-rotate-45 -translate-y-1" : ""
                  }`}
                ></span>
              </div>
            </SheetTrigger>
            <SheetContent side="top" className="w-full h-full">
              <SheetHeader>
                <SheetTitle className="flex w-full items-center justify-center">
                  <Link to={"/"}>
                    <img src={logo} alt="Slayers Guild Logo" className="w-12" />
                  </Link>
                </SheetTitle>
              </SheetHeader>
              <div className="flex flex-col w-full h-full items-center justify-center pb-24 pt-12">
                <ul className="flex flex-col w-full h-full items-center justify-around">
                  {links.map((link) => (
                    <li key={link.name}>
                      <SheetClose asChild>
                        <Link
                          {...link.options}
                          to={link.path}
                          className="text-2xl"
                        >
                          {link.icon ? <>{link.icon}</> : <>{link.name}</>}
                        </Link>
                      </SheetClose>
                    </li>
                  ))}
                </ul>
              </div>
            </SheetContent>
          </Sheet>
        </div>
        <section className="flex lg:w-fit w-full justify-center lg:justify-start">
          <Link to={"/"} className="flex gap-4 items-center">
            <img src={logo} alt="Slayers Guild Logo" className="w-12" />
            <div className="hidden sm:flex flex-col">
              <h2 className="text-sm lg:text-sm font-thin tracking-widest">
                Vechain
              </h2>
              <h1 className="text-2xl md:text-3xl xl:text-5xl font-thin font-logo2">
                Slayers Guild
              </h1>
            </div>
          </Link>
        </section>
        <section className="flex flex-1 items-center justify-center">
          <ul className="gap-8 hidden lg:flex">
            {links.map((link) => (
              <li key={link.name}>
                <Link
                  {...link.options}
                  to={link.path}
                  className="relative text-md font-normal w-fit block after:block after:content-[''] after:absolute after:h-[5px] after:bg-tertiary after:w-full after:scale-x-0 after:hover:scale-x-100 after:transition after:duration-300 after:origin-center"
                >
                  {link.icon ? <>{link.icon}</> : <>{link.name}</>}
                </Link>
              </li>
            ))}
          </ul>
        </section>
        <section className="flex w-1/4 lg:w-fit items-center justify-end">
          <Wallet />
        </section>
      </nav>
    </>
  );
}
