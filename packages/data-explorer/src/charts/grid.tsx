import { Button, InputGroup, Tooltip } from "@blueprintjs/core";
import * as React from "react";
import ReactTable from "react-table";
import withFixedColumns from "react-table-hoc-fixed-columns";

import * as Dx from "../types";

import styled from "styled-components";

const ReactTableFixedColumns = withFixedColumns(ReactTable);

const switchMode = (currentMode: string) => {
  const nextMode: Dx.JSONObject = {
    "=": ">",
    ">": "<",
    "<": "="
  };
  return nextMode[currentMode];
};

type OnChangeProps = (input: number | string) => void;

type FilterIndexSignature = "integer" | "number" | "string";

interface NumberFilterProps {
  onChange: OnChangeProps;
  filterState: { [key: string]: string };
  filterName: string;
  updateFunction: (input: Dx.JSONObject) => void;
}

const GridWrapper = styled.div`
  width: calc(100vw - 150px);
`;

const NumberFilter = (props: NumberFilterProps) => {
  const { filterState, filterName, updateFunction, onChange } = props;
  const mode = filterState[filterName] || "=";
  const lockButton = (
    <Tooltip content={`Switch to ${switchMode(mode)}`}>
      <Button
        minimal
        onClick={() => {
          updateFunction({ [filterName]: switchMode(mode) });
        }}
      >
        {mode}
      </Button>
    </Tooltip>
  );

  return (
    <InputGroup
      //      allowNumericCharactersOnly={true}
      large
      placeholder="number"
      rightElement={lockButton}
      small={false}
      type={"text"}
      onChange={(event: React.FormEvent<HTMLInputElement>) => {
        onChange(event.currentTarget.value);
      }}
    />
  );
};

const stringFilter = () => ({ onChange }: { onChange: OnChangeProps }) => (
  <InputGroup
    large
    placeholder="string"
    type={"text"}
    onChange={(event: React.FormEvent<HTMLInputElement>) => {
      onChange(event.currentTarget.value);
    }}
  />
);

const numberFilterWrapper = (
  filterState: NumberFilterProps["filterState"],
  filterName: NumberFilterProps["filterName"],
  updateFunction: NumberFilterProps["updateFunction"]
) => ({ onChange }: { onChange: OnChangeProps }) => (
  <NumberFilter
    onChange={onChange}
    filterState={filterState}
    filterName={filterName}
    updateFunction={updateFunction}
  />
);

const filterNumbers = (mode = "=") => (
  filter: FilterObject,
  row: NumberRowObject
) => {
  const filterValue = Number(filter.value);
  if (mode === "=") {
    return row[filter.id] === filterValue;
  } else if (mode === "<") {
    return row[filter.id] < filterValue;
  } else if (mode === ">") {
    return row[filter.id] > filterValue;
  }
  return row[filter.id];
};

const filterStrings = () => (filter: FilterObject, row: StringRowObject) => {
  return (
    row[filter.id].toLowerCase().indexOf(filter.value.toLowerCase()) !== -1
  );
};

type FilterMethodType = { [index in FilterIndexSignature]: Function };

const columnFilters: FilterMethodType = {
  integer: numberFilterWrapper,
  number: numberFilterWrapper,
  string: stringFilter
};

const filterMethod: FilterMethodType = {
  integer: filterNumbers,
  number: filterNumbers,
  string: filterStrings
};

interface FilterObject {
  id: string;
  value: string;
}

interface StringRowObject {
  [key: string]: string;
}

interface NumberRowObject {
  [key: string]: number;
}

interface State {
  filters: { [key: string]: Function };
  showFilters: boolean;
}

interface Props {
  data: { data: Dx.Datapoint[]; schema: Dx.Schema };
  height: number;
}

class DataResourceTransformGrid extends React.PureComponent<Props, State> {
  static defaultProps = {
    metadata: {},
    height: 500
  };

  constructor(props: Props) {
    super(props);
    this.state = {
      filters: {},
      showFilters: false
    };
  }

  render() {
    const {
      data: { data, schema },
      height
    } = this.props;

    const { filters, showFilters } = this.state;

    const tableColumns = schema.fields.map((field: Dx.Field) => {
      if (
        field.type === "string" ||
        field.type === "number" ||
        field.type === "integer"
      ) {
        return {
          Header: field.name,
          accessor: field.name,
          fixed: schema.primaryKey.indexOf(field.name) !== -1 && "left",
          filterMethod: (filter: Dx.JSONObject, row: Dx.JSONObject) => {
            if (
              field.type === "string" ||
              field.type === "number" ||
              field.type === "integer"
            ) {
              return filterMethod[field.type](filters[field.name])(filter, row);
            }
          },
          // If we don't have a filter defined for this field type, pass an empty div
          Filter: columnFilters[field.type](
            filters,
            field.name,
            (newFilter: { [key: string]: Function }) => {
              this.setState({ filters: { ...filters, ...newFilter } });
            }
          )
        };
      } else {
        return {
          Header: field.name,
          accessor: field.name,
          fixed: schema.primaryKey.indexOf(field.name) !== -1 && "left"
        };
      }
    });

    return (
      <GridWrapper>
        <Button
          icon="filter"
          onClick={() => this.setState({ showFilters: !showFilters })}
        >
          {showFilters ? "Hide" : "Show"} Filters
        </Button>
        <ReactTableFixedColumns
          data={data}
          columns={tableColumns}
          style={{
            height: `${height}px`
          }}
          className="-striped -highlight"
          filterable={showFilters}
        />
      </GridWrapper>
    );
  }
}

export default DataResourceTransformGrid;
