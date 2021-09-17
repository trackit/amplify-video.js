import { MouseEventHandler, ReactNode } from 'react';
import classnames from 'classnames';

import './style.scss';

export enum ButtonType {
  BUTTON = 'button',
  RESET = 'reset',
  SUBMIT = 'submit',
}

export enum ButtonTheme {
  DEFAULT = 'default',
  ROUNDED = 'rounded',
}

export enum ButtonSize {
  SMALL = 'small',
  MEDIUM = 'medium',
  LARGE = 'large',
}

type Props = {
  type: ButtonType;
  theme: ButtonTheme;
  size: ButtonSize;
  onClick: MouseEventHandler<HTMLButtonElement>;
  children: ReactNode;
  className: string;
  disabled: boolean;
};

const Button = (props: Props) => {
  const { type, onClick, children, theme, size, className, disabled } = props;
  const classProps: string = classnames(
    'button',
    theme,
    size,
    disabled,
    className,
  );

  return (
    <button
      data-cy="submit"
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={classProps}
    >
      {children}
    </button>
  );
};

Button.defaultProps = {
  type: ButtonType.BUTTON,
  theme: ButtonTheme.DEFAULT,
  size: ButtonSize.SMALL,
  onClick: () => {},
  className: '',
  disabled: false,
};

export default Button;
