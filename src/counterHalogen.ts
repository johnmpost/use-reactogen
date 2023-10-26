import { match } from "ts-pattern";
import { ActionHandler } from "./useHalogen";

export type State = {
  count: number;
  isLoading: boolean;
};

export const initialState: State = {
  count: 0,
  isLoading: false,
};

export type Action =
  | { kind: "increment" }
  | { kind: "decrement" }
  | { kind: "incrementBy"; amount: number }
  | { kind: "updateFromRemote" };

const fetchRemoteCount = () =>
  new Promise<number>((resolve) =>
    setTimeout(() => resolve(Math.floor(Math.random() * 100)), 2000)
  );

export const handleAction: ActionHandler<State, Action> =
  (setState) => (action) =>
    match(action)
      .with(
        { kind: "increment" },
        () => () => setState((s) => ({ ...s, count: s.count + 1 }))
      )
      .with(
        { kind: "decrement" },
        () => () => setState((s) => ({ ...s, count: s.count - 1 }))
      )
      .with(
        { kind: "incrementBy" },
        ({ amount }) =>
          () =>
            setState((s) => ({ ...s, count: s.count + amount }))
      )
      .with({ kind: "updateFromRemote" }, () => async () => {
        setState((s) => ({ ...s, isLoading: true }));
        const newCount = await fetchRemoteCount();
        setState((s) => ({ ...s, isLoading: false, count: newCount }));
      })
      .exhaustive()();
