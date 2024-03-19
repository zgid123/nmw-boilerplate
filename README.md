Quick start your NestJS along with MikroORM and you can integrate whatever you want (e.g. React/Vue/Angular... for frontend).

Use `gRPC` for interservices when using microservices. And run unit test using `vitest` for better performance.

# Install

```sh
pnpm install
```

```sh
pnpm -w build
```

# Structure

```sh
├── _protos
├── @types
├── infrastructures
├── packages
│   ├── @cjs
│   │   ├── grpc-utils
│   │   └── mikro
│   ├── @config
│   ├── @core
│   │   └── utils
│   ├── @data
│   │   ├── dtos
│   │   └── grpc
│   └── @nest
│       ├── interceptors
│       └── test-utils
├── services
│   └── nestjs
│       └── auth-service
└── workspaces
    └── backend
        └── api-gateway
```

- \_protos: all proto files for gRPC
- @types: global types for whole project
- infrastructures: contains all infra configs
- packages: contains library packages for app/workspace/service
  - @cjs: all CommonJS packages
    - grpc-utils: contains all utilities for gRPC
    - mikro: contains all utilities for MikroORM
  - @config: tsconfig/eslint
  - @core: all packages for CommonJS and ESM
    - utils: contains all utilities for all mono projects
  - @data: all related to data types
    - dtos: DTO schema
    - grpc: Types for gRPC
  - @nest: all packages for NestJS
    - interceptors: all interceptors for NestJS
    - test-utils: all utilities to write unit test for NestJS
- services: all microservices
  - nestjs: microservices using NestJS
    - auth-service: service serves authentication and authorization
- workspaces
  - api-gateway: API Gateway

# Useful commands

- remove all folders includes nested folders inside monorepo

```sh
pnpm -w clear <folder_1> <folder_2> ...
```

- generate tls

```sh
openssl genrsa -out infrastructures/tls/tls.pem 3072

openssl req -config infrastructures/tls/tlsConfig.cnf -new -x509 -key infrastructures/tls/tls.pem -out infrastructures/tls/tls.crt

openssl pkcs12 -inkey infrastructures/tls/tls.pem -in infrastructures/tls/tls.crt -export -out infrastructures/tls/tls.pfx
```

# TODO

- integrate `zod` as validation for NestJS
