import {
    Rule,
    SchematicContext,
    Tree,
    apply,
    url,
    template,
    move,
    mergeWith,
    chain,
    SchematicsException
} from '@angular-devkit/schematics';
import { strings, normalize } from '@angular-devkit/core';
import { Schema } from './schema';

export function crudBase(options: Schema): Rule {
    return (_tree: Tree, context: SchematicContext) => {
        // Validações
        if (!options.name) {
            throw new SchematicsException('O parâmetro --name é obrigatório');
        }

        // Normalizar o path
        const normalizedPath = options.path ? normalize(options.path) : normalize('src/app');

        // Preparar variáveis para os templates
        const templateOptions = {
            ...options,
            ...strings,
            name: strings.dasherize(options.name),
            className: strings.classify(options.name)
        };

        context.logger.info(`✨ Gerando componente CRUD: ${options.name}`);
        context.logger.info(`📁 Caminho: ${normalizedPath}/${strings.dasherize(options.name)}`);

        // Criar arquivos a partir dos templates
        const templateSource = apply(url('./files'), [
            template(templateOptions),
            move(normalize(`${normalizedPath}/${strings.dasherize(options.name)}`))
        ]);

        return chain([
            mergeWith(templateSource)
        ]);
    };
}
