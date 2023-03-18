export function Icon(props: {
  path: string;
  className?: string;
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className={props.className}
    >
      <path d={props.path} fill="currentColor" />
    </svg>
  );
}
