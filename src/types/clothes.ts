export type TPreviewClothingPiece = {
    id: string,
    hoverImg: string,
    name: string,
    price: number,
    salePercent?: number,
    colors: TColorClothingPiece[]
}

export type TColorClothingPiece = {
    color: string,
    img: string
}