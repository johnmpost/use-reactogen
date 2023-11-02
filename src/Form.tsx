import { StringKeysOf, defer, removeIndex, setIndex } from "./utils";
import { match } from "ts-pattern";
import React, { useReducer } from "react";
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

type KeyValue = {
  field: keyof State;
} & {
  [K in keyof State]: {
    field: K;
    newValue: State[K];
  };
}[keyof State];

type SetField = KeyValue & { kind: "setField" };

type Action =
  | SetField
  | { kind: "addFriend" }
  | { kind: "removeFriend"; index: number }
  | { kind: "updateFriend"; index: number; newValue: string };

const reduce = (s: State, a: Action): State =>
  match(a)
    .with({ kind: "setField" }, ({ field, newValue }) => ({
      ...s,
      [field]: newValue,
    }))
    .with({ kind: "addFriend" }, () => ({ ...s, friends: [...s.friends, ""] }))
    .with({ kind: "removeFriend" }, ({ index }) => ({
      ...s,
      friends: removeIndex(index, s.friends),
    }))
    .with({ kind: "updateFriend" }, ({ index, newValue }) => ({
      ...s,
      friends: setIndex(index, newValue, s.friends),
    }))
    .exhaustive();

export const Form = () => {
  const [state, dispatch] = useReducer(reduce, initialState);
  const doDispatch = defer(dispatch);

  const targetValue = <T extends { target: { value: string } }>(e: T) =>
    e.target.value;

  const setField = (kv: KeyValue) => dispatch({ ...kv, kind: "setField" });

  const setFieldT =
    <T extends keyof State>(field: T) =>
    (newValue: State[T]) => ({ ...state, [field]: newValue });

  const setTextField = (field: StringKeysOf<State>) => (newValue: string) =>
    setField({ field, newValue });

  const handleTextInputChange = (field: StringKeysOf<State>) =>
    flow(targetValue, setTextField(field));

  const updateFriend =
    (index: number) => (e: React.ChangeEvent<HTMLInputElement>) =>
      dispatch({
        kind: "updateFriend",
        index,
        newValue: e.target.value,
      });

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
        onChange={(e) =>
          setField({ field: "title", newValue: e.target.value as Title })
        }
        value={state.title}
      >
        {titleOptions.map((title, i) => (
          <option key={i} value={title}>
            {title}
          </option>
        ))}
      </select>
      <label>Name</label>
      <input onChange={handleTextInputChange("name")} value={state.name} />
      <label>Email</label>
      <input onChange={handleTextInputChange("email")} value={state.email} />
      <label>Friends</label>
      <button onClick={doDispatch({ kind: "addFriend" })}>+</button>
      {state.friends.map((friend, index) => (
        <div key={index}>
          <input onChange={updateFriend(index)} value={friend} />
          <button onClick={doDispatch({ kind: "removeFriend", index })}>
            -
          </button>
        </div>
      ))}
    </div>
  );
};
