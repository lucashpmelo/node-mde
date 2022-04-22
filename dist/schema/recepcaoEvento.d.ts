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
                attributes?: undefined;
            } | {
                type: string;
                name: string;
                attributes: {
                    versao: string;
                };
                elements: {
                    type: string;
                    name: string;
                    attributes: {
                        Id: any;
                    };
                    elements: ({
                        type: string;
                        name: string;
                        elements: {
                            type: string;
                            text: any;
                        }[];
                        attributes?: undefined;
                    } | {
                        type: string;
                        name: string;
                        attributes: {
                            versao: string;
                        };
                        elements: {
                            type: string;
                            name: string;
                            elements: {
                                type: string;
                                text: any;
                            }[];
                        }[];
                    })[];
                }[];
            })[];
        }[];
    }[];
};
