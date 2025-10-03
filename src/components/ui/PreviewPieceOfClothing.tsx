import { cn } from "@/lib/utils";
import { TPreviewClothingPiece } from "@/types/clothes";
import { FC, useState } from "react";

const PreviewPieceOfCothing: FC<{data: TPreviewClothingPiece, className?:string}> = (props) => {
  const [imgActive, setImgactive] = useState<string>(props.data.colors[0].img);
  const [isHover, setHover] = useState<boolean>(false);
  const style ="flex flex-col items-center gap-4 " 
  return (
    <div className={cn(style,props.className)}>
      {imgActive === props.data.colors[0].img ? (
        isHover ? (
          <img
            onMouseLeave={() => setHover(false)}
            src={props.data.hoverImg}
            alt=""
          />
        ) : (
          <img onMouseEnter={() => setHover(true)} src={imgActive} alt="" />
        )
      ) : (
        <img src={imgActive} alt="" />
      )}
      <p className="text-black">
        <strong>{props.data.name}</strong>
      </p>
      <p className="text-black">${props.data.price}</p>
      <div className="flex gap-4">
        {props.data.colors.map((curr, index) => (
          <div
            style={{ background: curr.color }}
            className={
              "w-5 h-5 rounded-full cursor-pointer " +
              (curr.img === imgActive
                ? "border-2 border-solid border-gray-700"
                : "")
            }
            key={index}
            onClick={() =>
              setImgactive(
                props.data.colors.find((value) => value.color === curr.color)!.img
              )
            }
          ></div>
        ))}
      </div>
    </div>
  );
};

export default PreviewPieceOfCothing