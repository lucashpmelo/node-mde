export function enviar(opts: any): Promise<{
    data: {
        retDistDFeInt: {
            tpAmb: string;
            verAplic: string;
            cStat: string;
            xMotivo: string;
            dhResp: string;
            ultNSU: string;
            maxNSU: string;
        };
        docZip: [{
            xml: string;
            nsu: string;
        }];
    } | {
        error: string;
    };
    xml: string;
    status: number;
}>;
