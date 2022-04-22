export function enviar(opts: any): Promise<{
    data: {
        retEnvEvento: {
            idLote: string;
            tpAmb: string;
            verAplic: string;
            cOrgao: string;
            cStat: string;
            xMotivo: string;
        };
        infEvento: {
            tpAmb: string;
            verAplic: string;
            cOrgao: string;
            cStat: string;
            xMotivo: string;
            chNFe: string;
            tpEvento: string;
            xEvento: string;
            nSeqEvento: string;
            dhRegEvento: string;
        };
    } | {
        error: string;
    };
    xml: string;
    status: number;
}>;
