import React, { MouseEventHandler, ReactNode } from 'react';

// import Card from '_components/atoms/card'
// import Button from '_components/atoms/button'
import Title from 'components/atoms/title';
import Card from 'components/atoms/card';
import Button from 'components/atoms/button';

interface Props {
  children?: ReactNode;
  className?: string;
  title: string;
  button?: string;
  onClick?: MouseEventHandler<HTMLElement>;
  dataCy: string;
  disabled?: boolean;
}

const Block = (props: Props) => (
  <Card className={props.className}>
    <Title>{props.title}</Title>
    {props.children}
    {props.button !== '' && (
      <Button dataCy={props.dataCy} disabled={props.disabled} onClick={props.onClick}>
        {props.button}
      </Button>
    )}
  </Card>
);

export default Block;
