# Zero-dependency Progress Bar/Skeleton

[![npm package](https://badgen.net/npm/v/@aldabil/next-progress)](https://www.npmjs.com/package/@aldabil/next-progress)
[![Follow on Twitter](https://badgen.net/twitter/follow/aldabil21?label=@aldabil21)](https://twitter.com/intent/follow?screen_name=aldabil21)

## Install

```jsx
npm i @aldabil/nextjs-progress
```

## Usage

In your custom `_app.tsx|js`.

```jsx
//...some impotrs...
import Progress from "@aldabil/nextjs-progress";

//Progress setup
Progress.configure({
  type: "bar",
  background:
    "linear-gradient(90deg, rgba(251,175,0,1) 0%, rgba(251,175,0,1) 81%, rgba(127,137,0,1) 100%)",
  height: 3,
  //svg: "used with type='fullpage' ",
});
Router.events.on("routeChangeStart", () => Progress.start());
Router.events.on("routeChangeComplete", () => Progress.complete());
Router.events.on("routeChangeError", () => Progress.complete());

const MyApp = (props: MyAppProps) => {
  //...
};
```

And that's it.

#### Options

| Option     | Value                                                                                                    |
| ---------- | -------------------------------------------------------------------------------------------------------- |
| type       | bar / fullpage. When use fullpage type, you need to provide svg as a string toload with skeleton effect. |
| background | string - background CSS property. bar color or fullpage background                                       |
| height     | number. bar height or svg height                                                                         |
| svg        | string. Like `` `<svg> .... </svg>` `` with backticks.                                                   |
