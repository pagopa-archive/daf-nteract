import { shallow } from "enzyme";
import toJson from "enzyme-to-json";
import * as React from "react";

import { Entry, Icon, LastSaved, Listing, Name } from "../src";

describe("Listing", () => {
  it("accepts props and renders entries in directory in a table", () => {
    const component = shallow(
      <Listing>
        <Entry>
          <Icon fileType={"directory"} />
          <Name>{"linky"}</Name>
          <LastSaved lastModified={new Date("2018-06-22 00:15:55 GMT")} />
        </Entry>
      </Listing>
    );
    expect(toJson(component)).toMatchSnapshot();
  });
});

describe("Entry", () => {
  it("accepts props and renders entries in directory", () => {
    const component = shallow(
      <Entry>
        <Icon fileType={"directory"} />
        <Name>{"linky jr"}</Name>
        <LastSaved lastModified={new Date("2018-06-22 00:15:55 GMT")} />
      </Entry>
    );
    expect(toJson(component)).toMatchSnapshot();
  });
});
