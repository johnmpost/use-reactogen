# useReactogen

- `useReactogen` is a React hook for state and effect management inspired by Purescript's Halogen.
- The repository is set up as an example project. The important files are [App.tsx](./src/App.tsx) and [useReactogen](./src/useReactogen.ts).
- The hook itself is only 16 lines and has only React as a dependency. If you want to use it, copy and paste it into your project.

# Why useReactogen

Halogen's approach to this problem is beautiful:

- reducer-like state management
- that can handle side effects
- without unnecessary overhead and boilerplate

It's different from existing solutions:

### React's useReducer

- wonderful as a pure state reducer
- doesn't handle side effects natively (you might instead define separate functions that use `dispatch` within them)
- doesn't handle side effects cleanly (you have to define reducer actions for **all** state changes - even those that only happen alongside side effects, such as setting loading state)

### Redux Toolkit

- **can** handle side effects cleanly (e.g. you can use `extraReducers` to do state changes, such as setting loading state, without manually defining incidental reducer actions)
- requires a lot of boilerplate code
- side effects are not co-located with pure state reducer actions

# How To Use

Here's how to think about useReactogen's architecture conceptually:

- You have a `State` type which defines the shape of the state (of your app or component)
- You have an `Action` type which defines **things you can do**. In this counter app, **incrementing** is something you can do, and **updating from remote** is something you can do. **Setting the loading state** is **NOT** something you can do. Rather, it is just something that happens alongside updating from remote.
- You have a `handleAction` function that that accepts an action and **does something**. Technically, it returns a side-effect or a sequence of side-effects, which the `useReactogen` hook then executes. That might be a simple state update, or it might be an async fetch sandwiched between two loading state updates.

You also need to provide an `initialState`. Then, in your component, you get the current state an `invoke` function that you can use to do actions.

And that's it. Robust, lean, and elegant state and effect management.
