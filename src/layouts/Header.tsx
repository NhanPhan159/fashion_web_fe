import logo from "@/assets/images/logo-lino.avif";
import { TItemHeader } from "@/types/header";
import { Search, ShoppingBag, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

const dumpData: TItemHeader[] = [
  {
    name: "new in",
    topics: null,
  },
  {
    name: "Women",
    topics: [
      {
        topic: "ready to wear",
        caterogies: [
          {
            name: "dresses",
            path: "",
          },
          {
            name: "shirts",
            path: "",
          },
        ],
      },
      {
        topic: "ready to wear",
        caterogies: [
          {
            name: "dresses",
            path: "",
          },
          {
            name: "shirts",
            path: "",
          },
        ],
      },
    ],
  },
  {
    name: "Men",
    topics: [
      {
        topic: "ready to wear",
        caterogies: [
          {
            name: "dresses",
            path: "",
          },
          {
            name: "shirts",
            path: "",
          },
        ],
      },
      {
        topic: "ready to wear",
        caterogies: [
          {
            name: "dresses",
            path: "",
          },
          {
            name: "shirts",
            path: "",
          },
        ],
      },
    ],
  },
];

const Header = () => {
  const headerRef = useRef<HTMLDivElement>(document.createElement("div"));
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [heightHeader, setHeightHeader] = useState(0);
  useEffect(() => {
    setHeightHeader(headerRef.current.getBoundingClientRect().height);
  }, [headerRef.current]);
  return (
    <div
      ref={headerRef}
      id="header"
      className="pt-6 z-[100] sticky top-0 px-6 bg-orange-100 grid grid-cols-3 gap-6 w-full auto-rows-[1fr]"
    >
      <img src={logo} className="w-[30%] h-14 justify-center" alt="" />
      <div className="flex gap-6 justify-center">
        {dumpData.map((curr, key) => (
          <div
            key={key}
            onMouseEnter={() => setHoverIndex(key)}
            onMouseLeave={() => setHoverIndex(null)}
            className="cursor-pointer hover:underline hover:underline-offset-8 hover:decoration-black relative"
          >
            <span className=" text-xl uppercase">{curr.name}</span>
            {curr.topics !== null && hoverIndex === key && (
              <div
                className={`absolute bg-white flex gap-6 -left-3/4`}
                style={{ top: `${heightHeader - 24}px` }}
              >
                {curr.topics.map((curr, index) => (
                  <div className="flex flex-col gap-4 p-4" key={index}>
                    <h2 className="font-mono uppercase">{curr.topic}</h2>
                    {curr.caterogies?.map((category) => (
                      <Link
                        className="uppercase"
                        key={category.path}
                        to={category.path}
                      >
                        {category.name}
                      </Link>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="flex gap-7 justify-center">
        <Search />
        <User />
        <ShoppingBag />
      </div>
    </div>
  );
};
export default Header;
