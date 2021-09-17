import React, { ReactNode } from 'react';
import classnames from 'classnames';

import './style.scss';

interface Props {
  children?: ReactNode;
  className?: string;
}

const Title = (props: Props) => (
  <h1 className={classnames('title', props.className)}>{props.children}</h1>
);

export default Title;
