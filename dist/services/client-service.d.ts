export = Instance;
declare class Instance {
    constructor(options: any);
    instance: import("axios").AxiosInstance;
    /**
     * @returns {{status: number, data: string}}
     */
    request(options: any): {
        status: number;
        data: string;
    };
}
