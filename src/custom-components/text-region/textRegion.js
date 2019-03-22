// @flow
import * as React from 'react';

type Props = {
  texts: string[],
  x: number,
};
const TextRegion = (props: Props) => {
  const { texts, x } = props;
  return (
    <React.Fragment>
      {texts.map((text, idx) => (
        // eslint-disable-next-line react/no-array-index-key
        <text x={x} y={(idx + 1) * 20} key={idx} fill="red">{text}</text>
      ))}
    </React.Fragment>
  );
};
export default TextRegion;