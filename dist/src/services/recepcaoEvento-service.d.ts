export = RecepcaoEvento;
declare class RecepcaoEvento {
    /**
     * @param {Object} opts
     * @param {Buffer} opts.pfx
     * @param {string} opts.passphrase
     * @param {string} opts.cert
     * @param {string} opts.key
     * @param {string} opts.chNFe
     * @param {string} opts.cnpj
     * @param {string} opts.tpAmb
     * @param {Object} opts.options
     * @param {Object} opts.options.requestOptions
     * @param {Object} opts.options.httpsOptions
     */
    constructor(opts: {
        pfx: Buffer;
        passphrase: string;
        cert: string;
        key: string;
        chNFe: string;
        cnpj: string;
        tpAmb: string;
        options: {
            requestOptions: any;
            httpsOptions: any;
        };
    });
    opts: {
        chNFe: string;
        cnpj: string;
        tpAmb: string;
        idLote: any;
        nSeqEvento: any;
        cOrgao: any;
        timezone: any;
        cert: string;
        key: string;
        requestOpt: any;
        httpsOpt: any;
    };
    /**
     * @param {Object} evento
     * @param {number} evento.tipoEvento
     * @param {string} evento.justificativa
     */
    enviarEvento(evento: {
        tipoEvento: number;
        justificativa: string;
    }): Promise<{
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
}
