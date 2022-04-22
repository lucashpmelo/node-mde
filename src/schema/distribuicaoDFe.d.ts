export function schema(options: any): {
    elements: {
        type: string;
        name: string;
        attributes: {
            xmlns: string;
        };
        elements: {
            type: string;
            name: string;
            elements: {
                type: string;
                name: string;
                attributes: {
                    xmlns: string;
                    versao: string;
                };
                elements: ({
                    type: string;
                    name: string;
                    elements: {
                        type: string;
                        text: any;
                    }[];
                } | {
                    type: string;
                    name: any;
                    elements: {
                        type: string;
                        name: any;
                        elements: {
                            type: string;
                            text: any;
                        }[];
                    }[];
                })[];
            }[];
        }[];
    }[];
};
