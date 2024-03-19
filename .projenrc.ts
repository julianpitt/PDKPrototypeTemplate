import { monorepo as PDKMonorepo } from "@aws/pdk";
import { CloudscapeReactTsWebsiteProject } from "@aws/pdk/cloudscape-react-ts-website";
import { InfrastructureTsProject } from "@aws/pdk/infrastructure";
import {
  DocumentationFormat,
  Language,
  Library,
  ModelLanguage,
  TypeSafeApiProject,
} from "@aws/pdk/type-safe-api";
import { javascript } from "projen";

const monorepo = new PDKMonorepo.MonorepoTsProject({
  devDeps: ["@aws/pdk"],
  name: "PrototypingDemo",
  packageManager: javascript.NodePackageManager.PNPM,
  projenrcTs: true,
});

const api = new TypeSafeApiProject({
  parent: monorepo,
  outdir: "packages/api",
  name: "TestApi",
  infrastructure: {
    language: Language.TYPESCRIPT,
  },
  model: {
    language: ModelLanguage.SMITHY,
    options: {
      smithy: {
        serviceName: {
          namespace: "com.aws",
          serviceName: "TestApi",
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

const website = new CloudscapeReactTsWebsiteProject({
  name: "website",
  parent: monorepo,
  outdir: "packages/website",
  typeSafeApis: [api],
});

const infra = new InfrastructureTsProject({
  parent: monorepo,
  outdir: "packages/infra",
  name: "infra",
  cloudscapeReactTsWebsites: [website],
  typeSafeApis: [api],
});

infra.addScripts({
  bootstrap: "cdk bootstrap",
});

monorepo.addScripts({
  "deploy:dev": "nx run infra:deploy:dev",
  serve: "nx run website:dev",
});

monorepo.synth();
