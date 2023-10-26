import { useHalogen } from "./useHalogen";
import { handleAction, initialState } from "./counterHalogen";

export const App = () => {
  const { state, invoke } = useHalogen(initialState, handleAction);

  return (
    <div>
      <button onClick={() => invoke({ kind: "decrement" })}>-</button>
      <p>{state.count}</p>
      <button onClick={() => invoke({ kind: "increment" })}>+</button>
      <button onClick={() => invoke({ kind: "incrementBy", amount: 5 })}>
        +5
      </button>
      <button onClick={() => invoke({ kind: "updateFromRemote" })}>
        Fetch Remote
      </button>
      <p>{state.isLoading ? "Loading..." : "Idle"}</p>
    </div>
  );
};
