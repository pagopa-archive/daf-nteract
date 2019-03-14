import * as React from "react";
import styled, { StyledComponent } from "styled-components";
import { WrapperDiv } from "../../../../../packages/pdnd-nteract-packages/theme";

const NavUl: StyledComponent<"ul", any, {}, never> = styled.ul`
  display: flex;
  justify-content: space-between;
  padding: 10px 20px;
  margin: 0 auto;
  width: 100%;
`;

const NavLi: StyledComponent<"li", any, {}, never> = styled.li`
  display: flex;
  box-sizing: border-box;
  padding: 0px 0px;

  /*
   * When we have a nav section that ends up on the right,
   * reverse the padding order
   */
  :not(:first-child):last-child > :global(ul > li) {
    margin: 0px 0px 0px var(--nt-spacing-xl);
  }
`;

const NavSectionUl: StyledComponent<"ul", any, {}, never> = styled.ul`
  margin: 0 auto;
  padding: 0px 0px;
  display: flex;
  justify-content: space-between;
`;

const NavSectionLi: StyledComponent<"li", any, {}, never> = styled.li`
  display: flex;
  padding: 0px 0px;
  margin: 0px var(--nt-spacing-xl) 0px 0px;
`;

// const WrapperDiv: StyledComponent<"div", any, {}, never> = styled.div`
//   background-color: hsl(0, 0%, 94%);
//   box-sizing: border-box;
// `;

interface NavSectionProps {
  children: React.ReactNode;
}
export const NavSection = (props: NavSectionProps): JSX.Element => (
  <NavSectionUl>
    {React.Children.map(props.children, child => {
      if (child === null) {
        return null;
      }
      return <NavSectionLi className="nav-item">{child}</NavSectionLi>;
    })}
  </NavSectionUl>
);

type NavProps = NavSectionProps;
export const Nav = (props: NavProps): JSX.Element => (
  <WrapperDiv>
    <NavUl>
      {React.Children.map(props.children, child => {
        return <NavLi>{child}</NavLi>;
      })}
    </NavUl>
  </WrapperDiv>
);

export default Nav;
