export interface INewsParam {
    type: string,
    title?: string,
    module: string,
    currentPage: number
}

export const INIT_NEWS_PARAM: INewsParam = {
    type: '',
    title: '',
    module: '',
    currentPage: 1,
}

export interface INewsProps {
    type?: string
    list: any[]
}