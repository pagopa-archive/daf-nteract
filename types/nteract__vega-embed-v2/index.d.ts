declare module "@nteract/vega-embed-v2" {
  export default function vegaEmbed2(
    element: HTMLElement,
    embedSpec: any,
    callback: (err?: Error, result?: any) => any
  ): void;
}
