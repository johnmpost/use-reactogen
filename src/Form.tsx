import { StringKeysOf, defer, removeIndex, setIndex } from "./utils";
import { match } from "ts-pattern";
import React, { useReducer } from "react";

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

type SetField = {
  kind: "setField";
  field: keyof State;
} & {
  [K in keyof State]: {
    field: K;
    newValue: State[K];
  };
}[keyof State];

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
  const updateTextField =
    (field: StringKeysOf<State>) => (e: React.ChangeEvent<HTMLInputElement>) =>
      dispatch({ kind: "setField", field, newValue: e.target.value });
  const updateFriend =
    (index: number) => (e: React.ChangeEvent<HTMLInputElement>) =>
      dispatch({
        kind: "updateFriend",
        index,
        newValue: e.target.value,
      });
  const updateTitle = (e: React.ChangeEvent<HTMLSelectElement>) =>
    dispatch({
      kind: "setField",
      field: "title",
      newValue: e.target.value as Title,
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
      <select onChange={updateTitle} value={state.title}>
        {titleOptions.map((title, i) => (
          <option key={i} value={title}>
            {title}
          </option>
        ))}
      </select>
      <label>Name</label>
      <input onChange={updateTextField("name")} value={state.name} />
      <label>Email</label>
      <input onChange={updateTextField("email")} value={state.email} />
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
