export interface NormalizedByName<T> {
  byName: {
    [name: string]: T;
  };
  allNames: string[];
}

export interface NormalizableByName {
  name: string;
}

export const initNormalizedByName = <T>(): NormalizedByName<T> => ({
  byName: {},

  allNames: [],
});

export const addToNormalizedSet = <T extends NormalizableByName>(
  { byName, allNames }: NormalizedByName<T>,
  data: T
) => {
  if (byName[data.name]) {
    throw Error("Duplicate entry to normalized set: " + data.name);
  }
  byName[data.name] = data;
  allNames.push(data.name);
};

export const toCollection = <T>({
  allNames,
  byName,
}: NormalizedByName<T>): T[] => allNames.map((name) => byName[name]);
