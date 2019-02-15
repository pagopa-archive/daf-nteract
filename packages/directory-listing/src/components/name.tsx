import styled from "styled-components";

export const Name = styled.td`
  vertical-align: middle;
  font-size: 0.9em;
  padding: 8px;

  a {
    text-decoration: none;
  }

  a:hover {
    text-decoration: underline;
    outline-width: 0;
  }
`;

Name.displayName = "Name";
