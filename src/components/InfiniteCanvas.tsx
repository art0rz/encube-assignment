import { Children, type PropsWithChildren } from "react";
import InfiniteCanvasItem from "./InfiniteCanvasItem.tsx";
import styled from "@emotion/styled";

const Root = styled.div`
  background-image:
    linear-gradient(to right, white 9px, transparent 9px),
    linear-gradient(to bottom, white 9px, #666666 9px);
  background-size: 10px 10px;
  background-repeat: repeat;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
`;

export default function InfiniteCanvas({ children }: PropsWithChildren<{}>) {
  return (
    <Root>
      {Children.map(children, (child) => (
        <InfiniteCanvasItem>{child}</InfiniteCanvasItem>
      ))}
    </Root>
  );
}
