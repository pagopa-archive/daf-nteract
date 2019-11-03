import { Observable, Subscriber } from "rxjs";

const mybinderURL = "https://mybinder.org";

/**
 * Strips the github.com URL base from a repo URL.
 *
 * @param repo A complete repo URL
 *
 * @returns The repo without github.com
 */
const cleanRepo = (repo: string): string =>
  repo
    .replace(/^(https?:\/\/)?github.com\//, "")
    // trim trailing or leading '/' on repo
    .replace(/(^\/)|(\/?$)/g, "");

interface BinderOptions {
  repo?: string;
  ref?: string;
  binderURL?: string;
}

/**
 * Returns a URL for initializing a connection to Binder.
 *
 * @param options An object containing the details of the Binder connection
 *
 * @returns A Binder URL
 */
export const formBinderURL = ({
  repo = "jupyter/notebook",
  ref = "master",
  binderURL = mybinderURL
}: BinderOptions = {}): string => {
  repo = cleanRepo(repo);
  binderURL = binderURL.replace(/(\/?$)/g, ""); // trim trailing / on url
  return `${binderURL}/build/gh/${repo}/${ref}`;
};

export interface IEventSource {
  onmessage?: (evt: MessageEvent) => void;
  onerror?: (reason: any) => void;
  close(): void;
}
type IEventSourceConstructor = new (url: string) => IEventSource;

const defaultEventSource: IEventSourceConstructor =
  typeof window !== "undefined" &&
  "EventSource" in (window as any) &&
  (window as any).EventSource;

/**
 * Returns an observable stream for mybinder.org or any related
 *
 * @param options repo and other options to connect
 * @param EventSourceDI allows overriding EventSource for testing
 *
 * @returns An Observable with a connection to a Binder instance
 */
export const binder = (
  options: BinderOptions,
  EventSourceDI = defaultEventSource
): Observable<any> => {
  if (!EventSourceDI) {
    throw new Error(
      "Event Source not supported on this platform -- please polyfill"
    );
  }

  const url = formBinderURL(options);

  return Observable.create((observer: Subscriber<MessageEvent>) => {
    const es = new EventSourceDI(url);
    es.onmessage = (evt: MessageEvent) => {
      const msg = JSON.parse(evt.data);

      // Pass messages onward, closing on "failed" or "ready"
      observer.next(msg);

      switch (msg.phase) {
        case "failed":
          // The message of failed is a message and shouldn't go on the error
          // part of the stream, we should just complete it
          observer.complete();
          break;
        case "ready":
          // When the server is ready, we can close the event source
          observer.complete();
          break;
        default:
          // do nothing, we already sent the message on
          break;
      }
    };

    es.onerror = err => {
      observer.error(err);
    };

    // disposal of the observable closes the EventSource
    return () => {
      es.close();
    };
  });
};
