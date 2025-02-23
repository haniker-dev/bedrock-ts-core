# A Type-First approach for Typescript project

## Introduction
This repo is a template for a Typescript project that follows a Type-First approach.
Core repo contains Type-1 (App types) and Type-3 (API Contracts) definitions and functions (FTFC).
All code in the repo is meant to be imported by other repo such as bedrock-ts-admin or bedrock-ts-api
so there should *NOT* have any npm packages that depends on NodeJS/browser/environment.

## Type Specifications
TypeSpec is a specification for defining types in Typescript for the entire application (web/api/database/etc).
It has 5 levels of specifications:
Type-1: The core types that are used in the application such as User in all platforms (eg. web/api/database)
Type-2: The database types that represents the table in the database (eg. UserRow => user db table)
Type-3: The API types (aka API contract) that represents the request/response of the API 
Type-4: The frontend state types
Type-5: The frontend action types

## File Structure
As this repo is meant to be imported for other repo, there is no `/src` folder.
`/Api`: Contains all Type-3 (API Contracts) definitions and functions
`/App`: Contains all Type-1 (App types) definitions and functions
`/Data`: Contains all Type-1 common data types and functions
`/spec`: Test cases

## TypeFirst Principles and Conventions
- Fully typed 
  - Absolutely NO `any` type and no usage of `as` and `is` type
  - No coercion of types (eg. `const user = unknownJson as User`)
  - unknown types are ALWAYS decoded using (decoders)[https://github.com/nvie/decoders]
  - Use `string | null` typing to reflect that something can be missing. Do not default!
  - Learn all about Typescript here: https://www.typescriptlang.org/docs/handbook/intro.html

- Adopt functional programming style 
  - No OOP, classes, attaching methods to object
  - Use common functional data types such as `Either` in `contract/data/*`
  - Use `/data` folder to hold types with functions such as `User` or `Post`
    - This will eliminates many helper functions while making functions discovery intuitive

- FTFC: Function follows Type, Type follows File, File follows Context
  - This is a functional programming convention to build a common and intuitive file/folder structure which promotes function discovery
  - (Type follows File): A file is usually named after the Type it is defined in or the context it works in
    - Eg: `type Timestamp = number` will be found in a file called `timestamp.ts`
    - Eg: `src/database.ts` is the file to serve database
  - (Function follows Type): Any functions that focuses on a Type will be found in that type file
    - Eg: `function addDays(t: Timestamp, n: number): Timestamp` will be found in `timestamp.ts`
  - (File follows Context): A file can be nested within directories and each directory represents the context of that file.
    Context is generally about usage or feature or SRP (Single Responsibility Principle) boundaries.
    - Eg: `timestamp.ts` which holds the type `Timestamp` can be placed in `/src/data/timestamp.ts`
    - Eg: `admins.ts` which holds the type `AdminRow` representing a database row in the database can be placed in `/src/database/admins.ts`
    - Eg: `/src/contract/jobGrade.ts` holds functions that do transformations targeting the type `JobGrade` in `/contract/api/data/jobGrade.ts`

- Error handling
  - Use `Either` type if we want to handle the error (most common)
  - Use `Maybe` type if we don't want to handle the error (most common)
  - Only use `throw new Error()` if we don't want to handle the exception (rare)
    - Never use in frontend
    - Only used in backend where the error is not recoverable
    - Exception Example: Database connection failure is an exception which no one can handle
    - Error Example: Transforming a string to int may fail which can be handled 
      so we should return `Either<string, number>` or `number | null`

