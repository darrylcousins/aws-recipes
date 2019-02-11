// eslint-disable
// this is an auto generated file. This will be overwritten

export const getGlossaryEntry = `query GetGlossaryEntry($id: ID!) {
  getGlossaryEntry(id: $id) {
    id
    title
    byline
    content
    ctime
    mtime
  }
}
`;
export const listGlossaryEntries = `query ListGlossaryEntries(
  $filter: TableGlossaryEntryFilterInput
  $limit: Int
  $nextToken: String
) {
  listGlossaryEntries(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      title
      byline
      content
      ctime
      mtime
    }
    nextToken
  }
}
`;
export const getRecipe = `query GetRecipe($id: ID!) {
  getRecipe(id: $id) {
    id
    title
    byline
    ingredients
    method
    ctime
    mtime
  }
}
`;
export const listRecipes = `query ListRecipes(
  $filter: TableRecipeFilterInput
  $limit: Int
  $nextToken: String
) {
  listRecipes(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      title
      byline
      ingredients
      method
      ctime
      mtime
    }
    nextToken
  }
}
`;
export const queryRecipesByIdTitleIndex = `query QueryRecipesByIdTitleIndex($title: String!, $first: Int, $after: String) {
  queryRecipesByIdTitleIndex(title: $title, first: $first, after: $after) {
    items {
      id
      title
      byline
      ingredients
      method
      ctime
      mtime
    }
    nextToken
  }
}
`;
