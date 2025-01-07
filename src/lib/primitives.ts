import { createSignal } from "solid-js";

/**
 * Primitive to handle promises in SolidJS, easily manage the state of a promise.
 *
 * @param factory The function that returns a promise.
 */
export const usePromise = <T extends (...args: any) => any>(factory: T) => {
  const [data, setData] = createSignal<T>();
  const [pending, setPending] = createSignal(false);
  const [error, setError] = createSignal<unknown>();

  const start = async (
    ...args: Parameters<T>
  ): Promise<Awaited<ReturnType<T>> | undefined> => {
    setPending(true);
    setError();

    let res: ReturnType<T> | undefined;

    try {
      res = await factory(...args);
      setData(() => res);
    } catch (error) {
      setError(error);
    } finally {
      setPending(false);
    }

    return res;
  };

  return {
    pending,
    data,
    error,
    start,
  };
};
