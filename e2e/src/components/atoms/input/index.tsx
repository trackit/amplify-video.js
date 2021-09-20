interface Props
  extends React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {
  forwardref: React.LegacyRef<HTMLInputElement>;
}

const Input = (props: Props) => (
  <input ref={props.forwardref} {...props}></input>
);

export default Input;
