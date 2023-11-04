import { IconButton } from "./IconButton";
import mdiHeart from "@slimr/mdi-paths/Heart";
import mdiHeartOutline from "@slimr/mdi-paths/HeartOutline";
import { useCallback, useTransition } from "react";
import { saveTrack } from "../api/saveTrack";
import { unsaveTrack } from "../api/unsaveTrack";
import { useFormState } from "react-dom";

interface Props {
  trackId: string;
  isSaved: boolean;
  className?: string;
}

export function SaveTrackButton({ trackId, isSaved, className }: Props) {
  const [isSaving, startTransition] = useTransition();

  const [state, formAction] = useFormState(
    (is) => (is ? unsaveTrack(trackId) : saveTrack(trackId)),
    isSaved,
  );

  const handleSave = useCallback(
    () => startTransition(formAction),
    [formAction],
  );

  return (
    <IconButton
      icon={state ? mdiHeart : mdiHeartOutline}
      onClick={handleSave}
      disabled={isSaving}
      className={className}
    />
  );
}
