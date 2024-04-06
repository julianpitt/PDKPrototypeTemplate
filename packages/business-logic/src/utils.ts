export const omit = <T extends Record<string, unknown>>(obj: T, props: (keyof T)[]) => {
  const clone = (obj = { ...obj });
  props.forEach((prop) => delete clone[prop]);
  return clone;
};
