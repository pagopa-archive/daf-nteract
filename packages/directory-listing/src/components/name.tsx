import styled from "styled-components";

export const Name = styled.span`
  vertical-align: middle;

  a {
    text-decoration: none;
  }

  a:hover {
    text-decoration: underline;
    outline-width: 0;
  }
`;

Name.displayName = "Name";

export default Name;
