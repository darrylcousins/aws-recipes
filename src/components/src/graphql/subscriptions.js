// eslint-disable
// this is an auto generated file. This will be overwritten

export const onCreateGlossaryEntry = `subscription OnCreateGlossaryEntry(
  $id: ID
  $title: String
  $byline: String
  $content: String
) {
  onCreateGlossaryEntry(
    id: $id
    title: $title
    byline: $byline
    content: $content
  ) {
    id
    title
    byline
    content
    ctime
    mtime
  }
}
`;
export const onUpdateGlossaryEntry = `subscription OnUpdateGlossaryEntry(
  $id: ID
  $title: String
  $byline: String
  $content: String
) {
  onUpdateGlossaryEntry(
    id: $id
    title: $title
    byline: $byline
    content: $content
  ) {
    id
    title
    byline
    content
    ctime
    mtime
  }
}
`;
export const onDeleteGlossaryEntry = `subscription OnDeleteGlossaryEntry(
  $id: ID
  $title: String
  $byline: String
  $content: String
) {
  onDeleteGlossaryEntry(
    id: $id
    title: $title
    byline: $byline
    content: $content
  ) {
    id
    title
    byline
    content
    ctime
    mtime
  }
}
`;
export const onCreateRecipe = `subscription OnCreateRecipe(
  $id: ID
  $title: String
  $byline: String
  $ingredients: [String]
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
    ctime
    mtime
  }
}
`;
export const onUpdateRecipe = `subscription OnUpdateRecipe(
  $id: ID
  $title: String
  $byline: String
  $ingredients: [String]
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
    ctime
    mtime
  }
}
`;
export const onDeleteRecipe = `subscription OnDeleteRecipe(
  $id: ID
  $title: String
  $byline: String
  $ingredients: [String]
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
    ctime
    mtime
  }
}
`;
