"use client";

import { useFormStatus } from "react-dom";
import { Button } from "../../../components/Button";

export function LoginButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" loading={pending}>
      Login with Spotify
    </Button>
  );
}
