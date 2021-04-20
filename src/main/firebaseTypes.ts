export interface initUserType {
    userId?: string | undefined;
    email?: string | undefined;
    displayName?: string | undefined;
}

export interface projectDataType {
    todos?: boardType,
    users: string,
    name: string
}

export interface boardType {
    new?: { [id: string]: taskType } | null;
    doing?: { [id: string]: taskType | null };
    done?: { [id: string]: taskType | null };
}

export interface taskType {
    name: string;
    owner: string;
}