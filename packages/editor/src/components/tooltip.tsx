import { MediaBundle } from "@nteract/commutable";
import { Media, RichMedia } from "@nteract/outputs";
import * as React from "react";
import styled, { StyledComponent } from "styled-components";

const TipButton: StyledComponent<"button", never> = styled.button`
  float: right;
  font-size: 11.5px;
  position: absolute;
  right: 0px;
  top: 0px;
`;

interface CursorCoords { top: number; left: number; bottom?: number }

interface TipProps {
  cursorCoords: CursorCoords;
}

const Tip: StyledComponent<"div", {}, TipProps> = styled.div`
  background-color: var(--theme-app-bg, #2b2b2b);
  box-shadow: 2px 2px 50px rgba(0, 0, 0, 0.2);
  float: right;
  height: auto;
  left: ${(props: TipProps) => props.cursorCoords.left}px;
  margin: 30px 20px 50px 20px;
  padding: 20px 20px 50px 20px;
  position: absolute;
  top: ${(props: TipProps) => props.cursorCoords.top}px;
  white-space: pre-wrap;
  width: auto;
  z-index: 9999999;
`;

interface Props {
  bundle: MediaBundle | null;
  cursorCoords: CursorCoords | null;
  deleteTip(): void;
}

export function Tooltip({ bundle, cursorCoords, deleteTip }: Props) {
  return bundle && cursorCoords ? (
    <Tip
      className="CodeMirror-hint"
      tabIndex={0}
      onKeyDown={e => {
        e.key === "Escape" ? deleteTip() : null;
      }}
      cursorCoords={cursorCoords}
    >
      <RichMedia data={bundle} metadata={{ expanded: true }}>
        <Media.Markdown />
        <Media.Plain />
      </RichMedia>
      <TipButton onClick={deleteTip}>{"\u2715"}</TipButton>
    </Tip>
  ) : null;
}
