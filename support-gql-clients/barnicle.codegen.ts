import { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
    schema: 'https://barnicle-new-staging.up.railway.app',
    documents: ['./support-gql-clients/queries/barnicle.ts'],
    generates: {
        './support-gql-clients/barnicle/__generated__/': {
            preset: 'client',
            plugins: [],
            presetConfig: {
                gqlTagName: 'barnicleGQL',
            }
        }
    },
    ignoreNoDocuments: true,
};

export default config;