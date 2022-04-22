export = DistribuicaoDFe;
declare class DistribuicaoDFe {
    /**
     * @param {Object} opts
     * @param {Buffer} opts.pfx
     * @param {string} opts.passphrase
     * @param {string} opts.cert
     * @param {string} opts.key
     * @param {string} opts.cUFAutor
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
        cUFAutor: string;
        cnpj: string;
        tpAmb: string;
        options: {
            requestOptions: any;
            httpsOptions: any;
        };
    });
    opts: {
        cUFAutor: string;
        cnpj: string;
        tpAmb: string;
        cert: string;
        key: string;
        requestOpt: any;
        httpsOpt: any;
    };
    /**
     * @param {string} ultNSU
     */
    consultaPorUltNSU(ultNSU: string): Promise<{
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
    /**
     * @param {string} chNFe
     */
    consultaPorChaveNFe(chNFe: string): Promise<{
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
    /**
     * @param {string} nsu
     */
    consultaPorNSU(nsu: string): Promise<{
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
}
