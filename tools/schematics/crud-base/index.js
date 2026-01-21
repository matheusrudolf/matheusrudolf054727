"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.crudBase = crudBase;
const schematics_1 = require("@angular-devkit/schematics");
const core_1 = require("@angular-devkit/core");
function crudBase(options) {
    return (_tree, context) => {
        // Validações
        if (!options.name) {
            throw new schematics_1.SchematicsException('O parâmetro --name é obrigatório');
        }
        // Normalizar o path
        const normalizedPath = options.path ? (0, core_1.normalize)(options.path) : (0, core_1.normalize)('src/app');
        // Preparar variáveis para os templates
        const templateOptions = {
            ...options,
            ...core_1.strings,
            name: core_1.strings.dasherize(options.name),
            className: core_1.strings.classify(options.name)
        };
        context.logger.info(`✨ Gerando componente CRUD: ${options.name}`);
        context.logger.info(`📁 Caminho: ${normalizedPath}/${core_1.strings.dasherize(options.name)}`);
        // Criar arquivos a partir dos templates
        const templateSource = (0, schematics_1.apply)((0, schematics_1.url)('./files'), [
            (0, schematics_1.template)(templateOptions),
            (0, schematics_1.move)((0, core_1.normalize)(`${normalizedPath}/${core_1.strings.dasherize(options.name)}`))
        ]);
        return (0, schematics_1.chain)([
            (0, schematics_1.mergeWith)(templateSource)
        ]);
    };
}
//# sourceMappingURL=index.js.map