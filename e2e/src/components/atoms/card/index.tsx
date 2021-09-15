import React, { ReactNode } from 'react';
import classnames from 'classnames';

import './style.scss';

interface Props {
  children?: ReactNode;
  className?: string;
}

const Card = (props: Props) => (
  <div className={classnames('card', props.className)}>{props.children}</div>
);

export default Card;
