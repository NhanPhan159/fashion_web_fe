import PreviewPieceOfCothing from "@/components/ui/PreviewPieceOfClothing";
import { TPreviewClothingPiece } from "@/types/clothes";

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

const Clothes = () => {
  return (
    <div>
      <div className="text-center w-2/3 mx-auto bg-[#fbfaf4] mb-10">
        <h1 className="text-black py-5 font-mono">Linen Skirts For Women</h1>
      </div>
      <span className="text-center ">
        Perfect for any occasion, our linen skirts are designed to be
        comfortable, stylish, and easy to mix and match with your favorite tops
        and accessories.
      </span>
      <div className="mt-10 grid grid-cols-3 gap-y-6">
        {dumpData.map((curr) => (
          <PreviewPieceOfCothing data={curr} />
        ))}
      </div>
    </div>
  );
};

export default Clothes;
