// eslint-disable
// this is an auto generated file. This will be overwritten

export const getRecipe = `query GetRecipe($id: ID!) {
  getRecipe(id: $id) {
    id
    title
    byline
    ingredients
    method
    user
    photos
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
      user
      photos
      ctime
      mtime
    }
    nextToken
  }
}
`;
