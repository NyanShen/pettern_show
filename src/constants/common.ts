export interface INewsProps {
    type: string,
    title?: string
}

export interface INewsParam {
    currentPage: number
}

export const INIT_NEWS_PARAM: INewsParam = {
    currentPage: 1
}