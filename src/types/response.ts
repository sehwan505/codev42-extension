export interface GitInfo {
    branch: string;
    repository?: string;
    commitInfo?: string[];
}

export interface Plan {
    plan: string;
}

export interface BackendResponse {
    status: 'success' | 'error';
    data?: any;
    error?: string;
}