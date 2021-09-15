interface Props
  extends React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {
  forwardRef: React.LegacyRef<HTMLInputElement>;
}

const Input = (props: Props) => (
  <input ref={props.forwardRef} {...props}></input>
);

export default Input;
