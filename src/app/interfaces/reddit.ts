export interface ISubmission {
    id: string;
    title: string;
}

export interface IComment {
    body: string;
}

export interface IRedditPost {
    [index:number]: {
        data: {
            children: Node[]
        },
        kind: string
    }
}

export type Node = {
    kind: "t1",
    data: IComment
} | {
    kind: "t3",
    data: ISubmission
}