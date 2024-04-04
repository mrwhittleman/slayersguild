import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBook, faRightToBracket } from "@fortawesome/free-solid-svg-icons";
import Wallet from "@/components/Wallet";
import Logo from "@/assets/VSG-LOGO_1.png";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/useIsMobile";

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
];

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useIsMobile();

  return (
    <>
      <nav className="relative flex flex-col w-full px-4 lg:px-12 py-4 bg-accent border-b border-tertiary">
        <div className="flex">
          {/* LOGO */}
          <div className="flex basis-2/5 lg:basis-1/2 shrink">
            <Link to={"/"} className="flex items-center gap-2 lg:gap-4">
              <img
                src={Logo}
                alt="Slayers Guild Logo"
                height={64}
                className="h-16"
              />
              <div className="hidden sm:flex flex-col self-end">
                <h2 className="text-sm font-thin tracking-widest">Vechain</h2>
                <h1 className="text-2xl xl:text-4xl 2xl:text-5xl font-thin font-logo2">
                  Slayers Guild
                </h1>
              </div>
            </Link>
          </div>
          {/* MOBILE NAVIGATION */}
          {isMobile && (
            <div className="flex basis-1/5 items-center justify-center">
              <Sheet
                onOpenChange={() => setIsOpen((prevIsOpen) => !prevIsOpen)}
              >
                <SheetTrigger>
                  {/* Hamburger Button */}
                  <div className="flex flex-col gap-2">
                    <span
                      className={`block w-10 h-0.5 rounded-full bg-tertiary-foreground transform transition-transform duration-500 ${
                        isOpen ? "rotate-45 translate-y-2" : ""
                      }`}
                    ></span>
                    <span
                      className={`block w-10 h-0.5 rounded-full bg-tertiary-foreground transition-transform duration-300 ${
                        isOpen ? "opacity-0" : ""
                      }`}
                    ></span>
                    <span
                      className={`block w-10 h-0.5 rounded-full bg-tertiary-foreground transition-transform duration-500 ${
                        isOpen ? "-rotate-45 -translate-y-1" : ""
                      }`}
                    ></span>
                  </div>
                </SheetTrigger>
                <SheetContent side="top" className="w-full h-full">
                  <SheetHeader className="h-1/6 items-center justify-center">
                    <SheetTitle>
                      {/* MOBILE LOGO */}
                      <Link to={"/"}>
                        <img
                          src={Logo}
                          alt="Slayers Guild Logo"
                          height={64}
                          className="h-16"
                        />
                      </Link>
                    </SheetTitle>
                  </SheetHeader>
                  {/* MOBILE NAVIGATION LINKS */}
                  <ul className="flex flex-col w-full h-5/6 items-center justify-around">
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
                </SheetContent>
              </Sheet>
            </div>
          )}
          {/* WALLET */}
          <div className="flex basis-2/5 lg:basis-1/2 shrink justify-end items-center">
            <Wallet mobile={isMobile}>
              <FontAwesomeIcon icon={faRightToBracket} />
              <span className="hidden sm:flex ml-2">Connect</span>
            </Wallet>
          </div>
        </div>
        {/* DESKTOP NAVIGATION */}
        <div className="hidden absolute bottom-2 lg:flex transform -translate-x-1/2 left-1/2">
          <ul className="gap-8 flex">
            {links.map((link) => (
              <li key={link.name}>
                <Link
                  {...link.options}
                  to={link.path}
                  className="relative text-md font-normal w-fit block after:block after:content-[''] after:absolute after:translate-y-1 after:h-[5px] after:bg-tertiary after:w-full after:scale-x-0 after:hover:scale-x-100 after:transition after:duration-300 after:origin-center"
                >
                  {link.icon ? <>{link.icon}</> : <>{link.name}</>}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </>
  );
}
