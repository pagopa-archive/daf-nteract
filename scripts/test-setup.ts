/**
 * Defines the React 16 Adapter for Enzyme.
 */
import { configure } from "enzyme";
import EnzymeAdapter from "enzyme-adapter-react-16";

configure({ adapter: new EnzymeAdapter() });
