import { StringKeysOf, defer, removeIndex, setIndex } from "./utils";
import { match } from "ts-pattern";
import { ActionHandler, useReactogen } from "./useReactogen";
import React from "react";

const titleOptions = [null, "Dr", "Lord", "His Majesty"] as const;
type State = {
  name: string;
  email: string;
  friends: string[];
  title: (typeof titleOptions)[number];
};

const initialState: State = {
  name: "",
  email: "",
  friends: [],
  title: null,
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

const handleAction: ActionHandler<State, Action> =
  (setState) => (action) => (_) =>
    match(action)
      .with(
        { kind: "setField" },
        ({ field, newValue }) =>
          () =>
            setState((s) => ({
              ...s,
              [field]: newValue,
            }))
      )
      .with(
        { kind: "addFriend" },
        () => () => setState((s) => ({ ...s, friends: [...s.friends, ""] }))
      )
      .with(
        { kind: "removeFriend" },
        ({ index }) =>
          () =>
            setState((s) => ({ ...s, friends: removeIndex(index, s.friends) }))
      )
      .with(
        { kind: "updateFriend" },
        ({ index, newValue }) =>
          () =>
            setState((s) => ({
              ...s,
              friends: setIndex(index, newValue, s.friends),
            }))
      )
      .exhaustive();

export const Form = () => {
  const { state, invoke } = useReactogen(initialState, handleAction);
  const doInvoke = defer(invoke);
  const updateTextField =
    (field: StringKeysOf<State>) => (e: React.ChangeEvent<HTMLInputElement>) =>
      invoke({ kind: "setField", field, newValue: e.target.value });

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
          invoke({
            kind: "setField",
            field: "title",
            newValue:
              e.target.value === ""
                ? null
                : (e.target.value as (typeof titleOptions)[number]),
          })
        }
        value={state.title ?? ""}
      >
        {titleOptions.map((title, i) => (
          // todo: make the null option just "", fix associated errors
          <option key={i} value={title ?? ""}>
            {title ?? ""}
          </option>
        ))}
      </select>
      <label>Name</label>
      <input onChange={updateTextField("name")} value={state.name} />
      <label>Email</label>
      <input onChange={updateTextField("email")} value={state.email} />
      <label>Friends</label>
      <button onClick={doInvoke({ kind: "addFriend" })}>+</button>
      {state.friends.map((friend, i) => (
        <div key={i}>
          <input
            onChange={(e) =>
              invoke({
                kind: "updateFriend",
                index: i,
                newValue: e.target.value,
              })
            }
            value={friend}
          />
          <button onClick={doInvoke({ kind: "removeFriend", index: i })}>
            -
          </button>
        </div>
      ))}
    </div>
  );
};
