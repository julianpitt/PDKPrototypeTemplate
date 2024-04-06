import { monorepo as PDKMonorepo } from '@aws/pdk';
import { CloudscapeReactTsWebsiteProject } from '@aws/pdk/cloudscape-react-ts-website';
import { InfrastructureTsProject } from '@aws/pdk/infrastructure';
import {
  DocumentationFormat,
  Language,
  Library,
  ModelLanguage,
  TypeSafeApiProject,
  TypeScriptProjectOptions,
} from '@aws/pdk/type-safe-api';
import { NodePackageManager } from 'projen/lib/javascript';
import { TypeScriptProject } from 'projen/lib/typescript';

const namespace = '@prototype-demo';

const commonProjectOptions = {
  defaultReleaseBranch: 'main',
  packageManager: NodePackageManager.PNPM,
  prettier: true,
  eslint: true,
  prettierOptions: {
    settings: {
      printWidth: 120,
      singleQuote: true,
    },
  },
  tsconfig: {
    compilerOptions: {
      lib: ['es2019', 'dom'],
      skipLibCheck: true,
    },
  },
} satisfies Partial<TypeScriptProjectOptions>;

const monorepo = new PDKMonorepo.MonorepoTsProject({
  devDeps: ['@aws/pdk'],
  name: 'PrototypingDemo',
  projenrcTs: true,
  ...commonProjectOptions,
});
monorepo.tsconfigDev.addInclude('**/*.ts');
monorepo.tsconfigDev.addInclude('.projenrc.ts');
monorepo.tsconfig!.addInclude('**/*.ts');
monorepo.tsconfig!.addInclude('.projenrc.ts');

const dataLayer = new TypeScriptProject({
  parent: monorepo,
  outdir: 'packages/data-layer',
  name: `${namespace}/data-layer`,
  sampleCode: false,
  ...commonProjectOptions,
  devDeps: ['@types/uuid'],
  deps: ['@aws-sdk/client-dynamodb', '@aws-sdk/lib-dynamodb', 'uuid'],
});

const businessLogicLayer = new TypeScriptProject({
  parent: monorepo,
  outdir: 'packages/business-logic',
  name: `${namespace}/business-logic`,
  sampleCode: false,
  ...commonProjectOptions,
  deps: [dataLayer.package.packageName, '@aws-sdk/client-dynamodb', '@aws-sdk/lib-dynamodb'],
});

const api = new TypeSafeApiProject({
  parent: monorepo,
  outdir: 'packages/api',
  name: 'TestApi',
  infrastructure: {
    language: Language.TYPESCRIPT,
  },
  model: {
    language: ModelLanguage.SMITHY,
    options: {
      smithy: {
        serviceName: {
          namespace: 'com.aws',
          serviceName: 'TestApi',
        },
      },
    },
  },
  runtime: {
    languages: [Language.TYPESCRIPT],
  },
  documentation: {
    formats: [DocumentationFormat.HTML_REDOC],
  },
  library: {
    libraries: [Library.TYPESCRIPT_REACT_QUERY_HOOKS],
  },
  handlers: {
    languages: [Language.TYPESCRIPT],
  },
});

api.handlers.typescript?.addDeps(
  businessLogicLayer.package.packageName,
  '@aws-sdk/client-dynamodb',
  '@aws-sdk/lib-dynamodb',
);

const website = new CloudscapeReactTsWebsiteProject({
  name: 'website',
  parent: monorepo,
  outdir: 'packages/website',
  typeSafeApis: [api],
  ...commonProjectOptions,
  deps: ['@cloudscape-design/collection-hooks', '@uidotdev/usehooks', '@tanstack/react-query'],
});

monorepo.addImplicitDependency(website, api.documentation.htmlRedoc!);

const infra = new InfrastructureTsProject({
  parent: monorepo,
  outdir: 'packages/infra',
  name: 'infra',
  sampleCode: false,
  typeSafeApis: [api],
  ...commonProjectOptions,
});

infra.addTask('bootstrap', {
  exec: 'cdk bootstrap',
});

const deploySandboxTask = infra.addTask('deploy:sandbox', {
  receiveArgs: true,
});
deploySandboxTask.exec('cdk synth', { receiveArgs: true });
deploySandboxTask.exec('cdk deploy -a cdk.out/assembly-Sandbox --require-approval never', { receiveArgs: true });

monorepo.addScripts({
  bootstrap: 'nx run infra:bootstrap',
  'deploy:sandbox': 'nx run infra:deploy:sandbox --all',
  'deploy:all': 'nx run infra:deploy --all',
  serve: 'nx run website:dev',
});

monorepo.addImplicitDependency(infra, website);

monorepo.synth();
