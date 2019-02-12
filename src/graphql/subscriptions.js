// eslint-disable
// this is an auto generated file. This will be overwritten

export const onCreateRecipe = `subscription OnCreateRecipe(
  $id: ID
  $title: String
  $byline: String
  $ingredients: String
  $method: String
) {
  onCreateRecipe(
    id: $id
    title: $title
    byline: $byline
    ingredients: $ingredients
    method: $method
  ) {
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
export const onUpdateRecipe = `subscription OnUpdateRecipe(
  $id: ID
  $title: String
  $byline: String
  $ingredients: String
  $method: String
) {
  onUpdateRecipe(
    id: $id
    title: $title
    byline: $byline
    ingredients: $ingredients
    method: $method
  ) {
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
export const onDeleteRecipe = `subscription OnDeleteRecipe(
  $id: ID
  $title: String
  $byline: String
  $ingredients: String
  $method: String
) {
  onDeleteRecipe(
    id: $id
    title: $title
    byline: $byline
    ingredients: $ingredients
    method: $method
  ) {
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
