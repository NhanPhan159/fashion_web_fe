export type TItemHeader = {
    name: string,
    topics: TTopic[] | null
}

export type TTopic = {
    topic: string
    caterogies: TCaterogy[] | null
}

export type TCaterogy = {
    name: string,
    path: string
}