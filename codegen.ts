import { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
    schema: 'https://trawler.poseidon.ac',
    documents: ['app/**/*.{ts,tsx}', 'components/**/*.{ts,tsx}', 'screens/**/*.{ts,tsx}', 'lib/**/*.{ts,tsx}', 'utils/**/*.{ts,tsx}'],
    generates: {
        './__generated__/': {
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