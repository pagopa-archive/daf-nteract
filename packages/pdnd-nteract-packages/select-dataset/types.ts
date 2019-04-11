interface IDatasetItem {
  id: string;
  modified?: string;
  name: string;
  notes?: string;
  owner_org?: { name: string };
  privatex?: boolean;
  theme?: string;
  title: string;
}

interface ISelectDatasetProps {
  isUserLogged: boolean;
}

export { IDatasetItem, ISelectDatasetProps };
