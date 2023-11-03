import { useState } from "react";
import { flow } from "fp-ts/lib/function";

const titleOptions = ["", "Dr", "Lord", "His Majesty"] as const;
type Title = (typeof titleOptions)[number];
type State = {
  name: string;
  email: string;
  friends: string[];
  title: Title;
};

const initialState: State = {
  name: "",
  email: "",
  friends: [],
  title: "",
};

type ETargetValue<T> = { target: { value: T } };

export const Form = () => {
  const [state, setState] = useState(initialState);

  const targetValue = <T,>(e: ETargetValue<T>): T => e.target.value;

  const usingTargetValue = <T, U>(fn: (x: T) => U) => flow(targetValue<T>, fn);

  const usingTargetValueT =
    <S,>() =>
    <T, U>(fn: (x: T) => U) =>
      flow((e: ETargetValue<S>) => e.target.value as unknown as T, fn);

  const setField =
    <T extends keyof State>(field: T) =>
    (newValue: State[T]) =>
      setState((s) => ({ ...s, [field]: newValue }));

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
      }}
    >
      <label>Title</label>
      <select
        onChange={usingTargetValueT<string>()(setField("title"))}
        value={state.title}
      >
        {titleOptions.map((title, i) => (
          <option key={i} value={title}>
            {title}
          </option>
        ))}
      </select>
      <label>Name</label>
      <input onChange={usingTargetValue(setField("name"))} value={state.name} />
      <label>Email</label>
      <input
        onChange={usingTargetValue(setField("email"))}
        value={state.email}
      />
      {/* <label>Friends</label>
      <button onClick={doDispatch({ kind: "addFriend" })}>+</button>
      {state.friends.map((friend, index) => (
        <div key={index}>
          <input onChange={updateFriend(index)} value={friend} />
          <button onClick={doDispatch({ kind: "removeFriend", index })}>
            -
          </button>
        </div>
      ))} */}
    </div>
  );
};
