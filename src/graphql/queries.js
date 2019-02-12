// eslint-disable
// this is an auto generated file. This will be overwritten

export const getRecipe = `query GetRecipe($id: ID!, $title: String!) {
  getRecipe(id: $id, title: $title) {
    id
    title
    byline
    ingredients
    method
    mtime
    ctime
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
      mtime
      ctime
    }
    nextToken
  }
}
`;
