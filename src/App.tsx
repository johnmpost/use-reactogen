import { useHalogen } from "./useHalogen";
import { handleAction, initialState } from "./counterHalogen";
import { defer } from "./utils";

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
