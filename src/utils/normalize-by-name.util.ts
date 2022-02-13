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
  set: NormalizedByName<T>,
  data: T
) => {
  set.byName[data.name] = data;
  set.allNames.push(data.name);
};

export const toCollection = <T>({
  allNames,
  byName,
}: NormalizedByName<T>): T[] => allNames.map((name) => byName[name]);
