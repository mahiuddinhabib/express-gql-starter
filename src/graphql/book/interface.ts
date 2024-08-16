export type IBookFilter = {
    author?: string;
    publishedDate?: {
        gte?: Date;
        lte?: Date;
    };
};
