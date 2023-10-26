import { useHalogen } from "./useHalogen";
import { defer } from "./utils";
import { match } from "ts-pattern";
import { ActionHandler } from "./useHalogen";

type State = {
  count: number;
  isLoading: boolean;
};

const initialState: State = {
  count: 0,
  isLoading: false,
};

type Action =
  | { kind: "increment" }
  | { kind: "decrement" }
  | { kind: "incrementBy"; amount: number }
  | { kind: "updateFromRemote" };

const fetchRemoteCount = () =>
  new Promise<number>((resolve) =>
    setTimeout(() => resolve(Math.floor(Math.random() * 100)), 2000)
  );

const handleAction: ActionHandler<State, Action> = (setState) => (action) =>
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

export const App = () => {
  const { state, invoke } = useHalogen(initialState, handleAction);
  const doInvoke = defer(invoke);

  return (
    <div>
      <button onClick={doInvoke({ kind: "decrement" })}>-</button>
      <p>{state.count}</p>
      <button onClick={doInvoke({ kind: "increment" })}>+</button>
      <button onClick={doInvoke({ kind: "incrementBy", amount: 5 })}>+5</button>
      <button onClick={doInvoke({ kind: "updateFromRemote" })}>
        Fetch Remote
      </button>
      <p>{state.isLoading ? "Loading..." : "Idle"}</p>
    </div>
  );
};
