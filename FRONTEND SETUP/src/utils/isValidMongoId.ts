export const isValidMongoId = (id: string) => {
  return /^[a-f\d]{24}$/i.test(id);
};