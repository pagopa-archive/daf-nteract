declare module "@nteract/vega-embed-v3" {
  export default function vegaEmbed3(
    el: HTMLElement | string,
    spec: {} | string,
    opt?: {},
  ): Promise<any>;
}
