import type { PropsWithChildren } from "react";
import styled from "@emotion/styled";

const Root = styled.div`
  position: absolute;
  top: 0;
  left: 0;
`;

export default function InfiniteCanvasItem({ children }: PropsWithChildren) {
  return (
    <Root>
      <p>Title</p>
      {children}
    </Root>
  );
}
