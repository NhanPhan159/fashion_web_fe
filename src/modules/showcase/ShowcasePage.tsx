import { FC, useRef, useState } from "react";
import ads_video from "../../assets/ads_video.mp4";
import { Button } from "@/components/ui/button";
import ShopMenImg from "@/assets/images/shop-men.webp";
import ShopWomanImg from "@/assets/images/shop-women.webp";
import { cn } from "@/lib/utils";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { TPreviewClothingPiece } from "@/types/clothes";
import { ArrowLeft, ArrowRight } from "lucide-react";
import PreviewPieceOfCothing from "@/components/ui/PreviewPieceOfClothing";
import { useNavigate } from "react-router-dom";
import { Path } from "@/constants";

const dumpData: TPreviewClothingPiece[] = [
  {
    id: "1",
    hoverImg:
      "https://120percento.com/cdn/shop/files/32ELIW89SCG305000-000014_20__200320_1_c2c7a1a8ad5d46f9a938e87e4842e6f9.jpg?v=1757681884&width=480",
    name: "Relaxed jacket",
    price: 55500,
    colors: [
      {
        color: "#f7ebb1",
        img: "https://120percento.com/cdn/shop/files/32ELIW79HSG413700-700075_20__200819_4_2f8ad56f05664be9a2b3fcac5e99539c.jpg?v=1757425693&width=480",
      },
      {
        color: "#1578af",
        img: "https://120percento.com/cdn/shop/files/32ELIW39ERG377100-700096_20__200055_1_a5b4d56f203f401f85df550cea846468.jpg?v=1757675293&width=480",
      },
    ],
  },
  {
    id: "2",
    hoverImg:
      "https://120percento.com/cdn/shop/files/32ELIW89SCG305000-000014_20__200320_1_c2c7a1a8ad5d46f9a938e87e4842e6f9.jpg?v=1757681884&width=480",
    name: "Relaxed jacket",
    price: 55500,
    colors: [
      {
        color: "#e0ca91",
        img: "https://120percento.com/cdn/shop/files/32ELIW79HSG413700-700075_20__200819_4_2f8ad56f05664be9a2b3fcac5e99539c.jpg?v=1757425693&width=480",
      },
    ],
  },
  {
    id: "3",
    hoverImg:
      "https://120percento.com/cdn/shop/files/32ELIW89SCG305000-000014_20__200320_1_c2c7a1a8ad5d46f9a938e87e4842e6f9.jpg?v=1757681884&width=480",
    name: "Relaxed jacket",
    price: 55500,
    colors: [
      {
        color: "#e0ca91",
        img: "https://120percento.com/cdn/shop/files/32ELIW79HSG413700-700075_20__200819_4_2f8ad56f05664be9a2b3fcac5e99539c.jpg?v=1757425693&width=480",
      },
    ],
  },
  {
    id: "4",
    hoverImg:
      "https://120percento.com/cdn/shop/files/32ELIW89SCG305000-000014_20__200320_1_c2c7a1a8ad5d46f9a938e87e4842e6f9.jpg?v=1757681884&width=480",
    name: "Relaxed jacket",
    price: 55500,
    colors: [
      {
        color: "#e0ca91",
        img: "https://120percento.com/cdn/shop/files/32ELIW79HSG413700-700075_20__200819_4_2f8ad56f05664be9a2b3fcac5e99539c.jpg?v=1757425693&width=480",
      },
    ],
  },
  {
    id: "5",
    hoverImg:
      "https://120percento.com/cdn/shop/files/32ELIW89SCG305000-000014_20__200320_1_c2c7a1a8ad5d46f9a938e87e4842e6f9.jpg?v=1757681884&width=480",
    name: "Relaxed jacket",
    price: 55500,
    colors: [
      {
        color: "#e0ca91",
        img: "https://120percento.com/cdn/shop/files/32ELIW79HSG413700-700075_20__200819_4_2f8ad56f05664be9a2b3fcac5e99539c.jpg?v=1757425693&width=480",
      },
    ],
  },
];

const ShowcasePage = () => {
  const video = useRef<HTMLVideoElement>(document.createElement("video"));
  const [api, setApi] = useState<CarouselApi>();
  const [api2, setApi2] = useState<CarouselApi>();
  const navigator = useNavigate()
  
  return (
    <div>
      <video
        ref={video}
        className="w-full h-screen object-cover relative"
        loop={true}
        muted={true}
        autoPlay={true}
        playsInline={true}
      >
        <source type="video/mp4" src={ads_video}></source>
      </video>

      {/* ------- section 1 ------ */}
      <div className="absolute top-[30%] left-1/3 w-1/3 flex flex-col items-center text-center">
        <h1 className="uppercase">dicover the fall/ winter collecttion</h1>
        <p>Embracving textures and deep shades.</p>
        <p>
          The new FE25 arrivals celebrate the cold season wothfone knitwear and
          innivative fabrics
        </p>
        <ButtonShowcase text={"Discover the collecttion"} />
      </div>

      <div className="w-full flex gap-4 mt-8">
        <div className="grow relative">
          <img
            src={ShopWomanImg}
            className="h-full w-full object-cover"
            alt=""
          />
          <ButtonShowcase
            text={"Shop Woman"}
            className={"absolute top-1/2 left-1/2 -translate-x-1/2 px-20 py-8 uppercase"}
            onClick = {()=>navigator(Path["Clothes"])}
          />
        </div>

        <div className="grow relative">
          <img src={ShopMenImg} className="h-full w-full object-cover" alt="" />
          <ButtonShowcase
            text={"Shop Men"}
            className={"absolute top-1/2 left-1/2 -translate-x-1/2 px-20 py-8 uppercase"}
            onClick = {()=>navigator(Path["Clothes"])}
          />
        </div>
      </div>
      <Carousel
        setApi={setApi}
        className="mt-8 w-full px-20"
        opts={{ loop: true }}
      >
        <CarouselContent>
          {dumpData.map((curr) => (
            <CarouselItem key={curr.id} className="md:basis-1/2 lg:basis-1/3">
              <PreviewPieceOfCothing data={curr} />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
      <div className="mb-20 mt-4 flex gap-4 items-center justify-center">
        <ArrowLeft onClick={() => api?.scrollPrev()} />
        <ArrowRight onClick={() => api?.scrollNext()} />
      </div>

      {/* ------- section 2 ------ */}
      <div className="w-full flex mt-8 px-20 h-[95vh]">
        <div className="basis-1/2">
          <img
            src="https://120percento.com/cdn/shop/files/EUFORIA_CAMPAGNA_1080x1620_2_fc85beca-93b4-4131-8bfe-e1944de265bb.jpg?v=1757688496&width=720"
            className="h-full w-full object-fit"
            alt=""
          />
        </div>

        <div className="basis-1/2 bg-blue-100 text-center  box-border px-20">
          <h1 className="text-black pt-44">
            SS25 Collection, Made to Be Lived In
          </h1>
          <p className="text-black pt-4 mb-8">
            Essential lines, airy volumes and refined details come together in a
            collection that moves through the season with lightness. Linen
            garments designed to follow every moment, from daily life to travel,
            from cityscapes to nature. Timeless elegance for those who seek
            comfort, beauty and authenticity.
          </p>
          <ButtonShowcase
            text={"Shop the collection"}
            className={"px-20 py-8 uppercase text-black border-black"}
          />
        </div>
      </div>

      {/* ------- section 3 ------ */}
      <Carousel
        setApi={setApi2}
        className="mt-8 w-full px-20"
        opts={{ loop: true }}
      >
        <CarouselContent>
          {dumpData.map((curr) => (
            <CarouselItem key={curr.id} className="md:basis-1/2 lg:basis-1/3">
              <PreviewPieceOfCothing data={curr} />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
      <div className="mb-16 mt-10 flex gap-4 items-center justify-center">
        <ArrowLeft onClick={() => api2?.scrollPrev()} />
        <ArrowRight onClick={() => api2?.scrollNext()} />
      </div>
      {/* ------- section 4 ------ */}
      <div className="w-full flex mt-8 px-20 h-[95vh]">
        <div className="basis-1/2">
          <img
            src="https://120percento.com/cdn/shop/files/EUFORIA_CAMPAGNA_1080x1620_3_1.jpg?v=1757692589&width=720"
            className="h-full w-full object-fit"
            alt=""
          />
        </div>

        <div className="basis-1/2 bg-blue-100 text-center  box-border px-20">
          <h1 className="text-black pt-44">
            Italian Linen Luxury Clothes
          </h1>
          <p className="text-black pt-4 mb-8">
            Donning linen clothing offers a unique and delightful sensory experience, enveloping the wearer in the natural opulence of this exquisite fabric. Choose your favorite pants, shirt or linen dress and immerse yourself in the refined world of luxury fashion, entirely made in Italy.
          </p>
          <ButtonShowcase
            text={"Our story"}
            className={"px-20 py-8 uppercase text-black border-black"}
          />
        </div>
      </div>
    </div>
  );
};
export default ShowcasePage;

const ButtonShowcase: FC<{ text: string; className?: string; onClick?: ()=>void }> = (props) => {
  const style =
    "mt-4 px-8 py-6 bg-transparent hover:bg-white hover:text-black rounded-none border-2 border-solid border-white";
  return (
    <Button variant={"default"} className={cn(style, props.className)} onClick={props.onClick}>
      {props.text}
    </Button>
  );
};

