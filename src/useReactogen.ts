import { useState } from "react";

export type ActionHandler<State, Action> = (
  setState: (update: (previousState: State) => State) => void
) => (action: Action) => (previousState: State) => () => void;

export const useReactogen = <State, Action>(
  initialState: State,
  handleAction: ActionHandler<State, Action>
) => {
  const [state, setState] = useState(initialState);

  const invoke = (action: Action) => handleAction(setState)(action)(state)();

  return { state, invoke };
};
