import { CodegenConfig } from '@graphql-codegen/cli';
import AppConfig from '../../config'

const config: CodegenConfig = {
    schema: AppConfig.HERMES_API_URL,
    documents: ['lib/hermes-client/**/*.{ts,tsx}'],
    generates: {
        './lib/hermes-client/__generated__/': {
            preset: 'client',
            plugins: [],
            presetConfig: {
                gqlTagName: 'gqlHermes',
            }
        }
    },
    ignoreNoDocuments: true,
};

export default config;