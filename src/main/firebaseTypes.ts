export interface initUserType {
    userId?: string | undefined;
    email?: string | undefined;
    displayName?: string | undefined;
}

export interface projectDataType {
    columns: columnMeta,
    users: string,
    name: string,
}

interface Icolumn {
    id: string;
    title: string;
    taskIds: string[];
}

interface columnMeta {
    [key: string]: Icolumn | string[];
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