const noAs = {
  create(context) {
    return {
      TSAsExpression(node) {
        const variableName =
          node.parent && node.parent.id
            ? node.parent.id.name
            : node.expression.type

        const typeName =
          node.typeAnnotation.typeName != null &&
          node.typeAnnotation.typeName.name != null
            ? node.typeAnnotation.typeName.name
            : node.typeAnnotation.type

        context.report({
          node,
          message: `Do not coerce "${variableName}" into type "${displayTypeName(
            typeName,
          )}" using "as".\nUse decoders to ensure type safety or return unknown if you do not need to know the type.`,
        })
      },
    }
  },
}

const noIs = {
  create(context) {
    return {
      "FunctionDeclaration, FunctionExpression, ArrowFunctionExpression, TSFunctionType"(
        node,
      ) {
        // Check if the node has a return type and if that return type is a TSTypePredicate
        // https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates
        if (
          node.returnType &&
          node.returnType.typeAnnotation.type === "TSTypePredicate"
        ) {
          context.report({
            node,
            message: `Do not use "is" as type guard because it is a form of coercion.`,
          })
        }
      },
    }
  },
}

module.exports = { rules: { "no-as": noAs, "no-is": noIs } }

// HELPER
function displayTypeName(typeName) {
  // https://open-rpc.github.io/typings/globals.html#tstype
  switch (typeName) {
    case "TSAnyKeyword":
      return "Any"
    case "TSBooleanKeyword":
      return "Boolean"
    case "TSBigIntKeyword":
      return "BigInt"
    case "TSNeverKeyword":
      return "Never"
    case "TSNullKeyword":
      return "Null"
    case "TSNumberKeyword":
      return "Number"
    case "TSObjectKeyword":
      return "Object"
    case "TSStringKeyword":
      return "String"
    case "TSSymbolKeyword":
      return "Symbol"
    case "TSUndefinedKeyword":
      return "Undefined"
    case "TSUnknownKeyword":
      return "Unknown"
    case "TSVoidKeyword":
      return "Void"
    case "TSThisType":
      return "This"
    case "TSFunctionType":
      return "Function"
    case "TSConstructorType":
      return "Constructor"
    case "TSTypeReference":
      return "Type"
    case "TSTypePredicate":
      return "TypePredicate"
    case "TSTypeQuery":
      return "TypeQuery"
    case "TSTypeLiteral":
      return "TypeLiteral"
    case "TSArrayType":
      return "Array"
    case "TSTupleType":
      return "Tuple"
    case "TSOptionalType":
      return "Optional"
    case "TSRestType":
      return "Rest"
    case "TSUnionType":
      return "Union"
    case "TSIntersectionType":
      return "Intersection"
    case "TSConditionalType":
      return "Conditional"
    case "TSInferType":
      return "Infer"
    case "TSParenthesizedType":
      return "Parenthesized"
    case "TSTypeOperator":
      return "TypeOperator"
    case "TSIndexedAccessType":
      return "IndexedAccess"
    case "TSMappedType":
      return "Mapped"
    case "TSLiteralType":
      return "Literal"
    case "TSExpressionWithTypeArguments":
      return "ExpressionWithTypeArguments"
    case "TSImportType":
      return "ImportType"
    default:
      return typeName
  }
}
