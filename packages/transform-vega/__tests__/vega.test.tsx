import { mount } from "enzyme";
import * as React from "react";

import {
  Vega2, Vega3, Vega4, Vega5,
  VegaLite1, VegaLite2, VegaLite3,
  VegaOptions,
} from "../src/";

const vlSpec = {
  description: "A scatterplot showing horsepower and miles per gallons.",
  data: {
    values: require("../data/cars.json"),
  },
  mark: "point",
  encoding: {
    x: { field: "Horsepower", type: "quantitative" },
    y: { field: "Miles_per_Gallon", type: "quantitative" },
    color: { field: "Origin", type: "nominal" },
    shape: { field: "Origin", type: "nominal" }
  }
};
const vgSpec = {
  "width": 200,
  "height": 200,
  "padding": 5,

  "data": [
    {
      "name": "source",
      "values": require("../data/cars.json"),
      "transform": [
        {
          "type": "filter",
          // tslint:disable-next-line:max-line-length
          "expr": "datum['Horsepower'] != null && datum['Miles_per_Gallon'] != null && datum['Acceleration'] != null"
        }
      ]
    }
  ],

  "scales": [
    {
      "name": "x",
      "type": "linear",
      "round": true,
      "nice": true,
      "zero": true,
      "domain": {"data": "source", "field": "Horsepower"},
      "range": "width"
    },
    {
      "name": "y",
      "type": "linear",
      "round": true,
      "nice": true,
      "zero": true,
      "domain": {"data": "source", "field": "Miles_per_Gallon"},
      "range": "height"
    },
    {
      "name": "size",
      "type": "linear",
      "round": true,
      "nice": false,
      "zero": true,
      "domain": {"data": "source", "field": "Acceleration"},
      "range": [4,361]
    }
  ],

  "axes": [
    {
      "scale": "x",
      "grid": true,
      "domain": false,
      "orient": "bottom",
      "tickCount": 5,
      "title": "Horsepower"
    },
    {
      "scale": "y",
      "grid": true,
      "domain": false,
      "orient": "left",
      "titlePadding": 5,
      "title": "Miles_per_Gallon"
    }
  ],

  "legends": [
    {
      "size": "size",
      "title": "Acceleration",
      "format": "s",
      "encode": {
        "symbols": {
          "update": {
            "strokeWidth": {"value": 2},
            "opacity": {"value": 0.5},
            "stroke": {"value": "#4682b4"},
            "shape": {"value": "circle"}
          }
        }
      }
    }
  ],

  "marks": [
    {
      "name": "marks",
      "type": "symbol",
      "from": {"data": "source"},
      "encode": {
        "update": {
          "x": {"scale": "x", "field": "Horsepower"},
          "y": {"scale": "y", "field": "Miles_per_Gallon"},
          "size": {"scale": "size", "field": "Acceleration"},
          "shape": {"value": "circle"},
          "strokeWidth": {"value": 2},
          "opacity": {"value": 0.5},
          "stroke": {"value": "#4682b4"},
          "fill": {"value": "transparent"}
        }
      }
    }
  ]
};

const handleError = (error: Error) => { throw error };
const options: VegaOptions = {renderer: "svg"};

describe("VegaLite1", () => {
  it("has the correct media type", () => {
    expect(VegaLite1.MIMETYPE).toBe("application/vnd.vegalite.v1+json");
  });

  // VegaLite1 still uses canvas to measure text, even in SVG mode, so can't
  // check contents here :(
});

describe("VegaLite2", () => {
  it("has the correct media type", () => {
    expect(VegaLite2.MIMETYPE).toBe("application/vnd.vegalite.v2+json");
  });

  it("renders the spec as SVG properly", (done) => {
    const handleResult = () => {
      expect(wrapper.render()).toMatchSnapshot();
      done();
    };
    const wrapper = mount(
      <VegaLite2
        data={vlSpec}
        options={options}
        onResult={handleResult}
        onError={handleError}
      />
    );
  });
});

describe("VegaLite3", () => {
  it("has the correct media type", () => {
    expect(VegaLite3.MIMETYPE).toBe("application/vnd.vegalite.v3+json");
  });

  it("renders the spec as SVG properly", (done) => {
    const handleResult = () => {
      expect(wrapper.render()).toMatchSnapshot();
      done();
    };
    const wrapper = mount(
      <VegaLite3
        data={vlSpec}
        options={options}
        onResult={handleResult}
        onError={handleError}
      />
    );
  });
});

describe("Vega2", () => {
  it("has the correct media type", () => {
    expect(Vega2.MIMETYPE).toBe("application/vnd.vega.v2+json");
  });

  // Vega2 still uses canvas to measure text, even in SVG mode, so can't
  // check contents here :(
});

describe("Vega3", () => {
  it("has the correct media type", () => {
    expect(Vega3.MIMETYPE).toBe("application/vnd.vega.v3+json");
  });

  it("renders the spec as SVG properly", (done) => {
    const handleResult = () => {
      expect(wrapper.render()).toMatchSnapshot();
      done();
    };
    const wrapper = mount(
      <Vega3
        data={vgSpec}
        options={options}
        onResult={handleResult}
        onError={handleError}
      />
    );
  });
});

describe("Vega4", () => {
  it("has the correct media type", () => {
    expect(Vega4.MIMETYPE).toBe("application/vnd.vega.v4+json");
  });

  it("renders the spec as SVG properly", (done) => {
    const handleResult = () => {
      expect(wrapper.render()).toMatchSnapshot();
      done();
    };
    const wrapper = mount(
      <Vega4
        data={vgSpec}
        options={options}
        onResult={handleResult}
        onError={handleError}
      />
    );
  });
});

describe("Vega5", () => {
  it("has the correct media type", () => {
    expect(Vega5.MIMETYPE).toBe("application/vnd.vega.v5+json");
  });

  it("renders the spec as SVG properly", (done) => {
    const handleResult = () => {
      expect(wrapper.render()).toMatchSnapshot();
      done();
    };
    const wrapper = mount(
      <Vega5
        data={vgSpec}
        options={options}
        onResult={handleResult}
        onError={handleError}
      />
    );
  });
});
