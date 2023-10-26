import { useState } from "react";

export type ActionHandler<State, Action> = (
  setState: (update: (state: State) => State) => void
) => (action: Action) => void;

export const useHalogen = <State, Action>(
  initialState: State,
  handleAction: ActionHandler<State, Action>
) => {
  const [state, setState] = useState(initialState);

  const invoke = handleAction(setState);

  return { state, invoke };
};
