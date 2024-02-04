import { defer, doNothing } from "./utils";
import { ActionHandler, useReactogen } from "./useReactogen";

type State = {
  count: number;
  isLoading: boolean;
};

const initialState: State = {
  count: 0,
  isLoading: false,
};

type Action<P = void> = (deps: {
  setState: (update: (s: State) => State) => void;
  prevState: State;
}) => (x: P) => void;

const fetchRemoteCount = () =>
  new Promise<number>((resolve) =>
    setTimeout(() => resolve(Math.floor(Math.random() * 100)), 2000)
  );

const increment: Action =
  ({ setState }) =>
  () =>
    setState((s) => ({ ...s, count: s.count + 1 }));

const decrement: Action =
  ({ setState }) =>
  () =>
    setState((s) => ({ ...s, count: s.count - 1 }));

const incrementBy: Action<number> =
  ({ setState }) =>
  (amount) =>
    setState((s) => ({ ...s, count: s.count + amount }));

const updateFromRemote: Action =
  ({ setState, prevState }) =>
  () =>
    (prevState.isLoading
      ? doNothing
      : async () => {
          setState((s) => ({ ...s, isLoading: true }));
          const newCount = await fetchRemoteCount();
          setState((s) => ({ ...s, isLoading: false, count: newCount }));
        })();

export const SimpleApp = () => {
  const { state, invoke } = useReactogen(initialState, handleAction);
  const doInvoke = defer(invoke);

  return (
    <div>
      <button onClick={doInvoke({ kind: "decrement" })}>-</button>
      <p>{state.count}</p>
      <button onClick={doInvoke({ kind: "increment" })}>+</button>
      <button onClick={doInvoke({ kind: "incrementBy", amount: 5 })}>+5</button>
      <button
        disabled={state.isLoading}
        onClick={doInvoke({ kind: "updateFromRemote" })}
      >
        Fetch Remote
      </button>
      <p>{state.isLoading ? "Loading..." : "Idle"}</p>
    </div>
  );
};
