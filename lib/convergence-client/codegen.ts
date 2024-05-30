import { CodegenConfig } from '@graphql-codegen/cli';
import AppConfig from '../../config'

const config: CodegenConfig = {
    schema: AppConfig.CONVERGENCE_URL,
    documents: ['lib/convergence-client/**/*.{ts,tsx}'],
    generates: {
        './lib/convergence-client/__generated__/': {
            preset: 'client',
            plugins: [],
            presetConfig: {
                gqlTagName: 'gql',
            }
        }
    },
    ignoreNoDocuments: true,
};

export default config;