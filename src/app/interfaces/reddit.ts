export interface ISubmission {
    id: string;
    title: string;
    link_flair_text: string;
}

export interface IComment {
    author: string;
    body: string;
    replies: CommentNode
}

export interface IRedditPost {
    [0]: SubmissionNode,
    [1]: CommentNode
}
type SubmissionNode = {
    data: {
        children: {
            kind: "t3",
            data: ISubmission
        }[]
    },
    kind: string
}
type CommentNode = {
    data: {
        children: {
            kind: "t1",
            data: IComment
        }[]
    },
    kind: string
}
export type Node = {
    kind: "t1",
    data: IComment
} | {
    kind: "t3",
    data: ISubmission
}