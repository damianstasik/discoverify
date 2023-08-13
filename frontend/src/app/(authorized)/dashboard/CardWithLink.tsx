import Link from "next/link";
import { Button } from "../../../components/Button";
import { Card } from "./Card";

interface Props {
  title: string;
  children: React.ReactNode;
  linkTo: string;
  linkLabel: string;
}

export function CardWithLink({ title, children, linkTo, linkLabel }: Props) {
  return (
    <Card title={title}>
      {children}

      <Button
        component={Link}
        variant="outlined"
        href={linkTo}
        className="mt-3"
      >
        {linkLabel}
      </Button>
    </Card>
  );
}
