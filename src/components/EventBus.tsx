import mitt, { Emitter } from "mitt";
import { createContext, useContext, useState } from "react";

type Events = {
  playPauseTrack: string;
};

type EventBusType = Emitter<Events>;

export const EventBusContext = createContext<EventBusType>(null);

export function EventBusProvider({ children }: { children: React.ReactNode }) {
  const [eventBus] = useState(() => mitt<Events>());
  return (
    <EventBusContext.Provider value={eventBus}>
      {children}
    </EventBusContext.Provider>
  );
}

export function useEventBus() {
  return useContext(EventBusContext);
}
