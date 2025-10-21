export function asClick<T extends (...args: any[]) => any>(fn: T): React.MouseEventHandler<HTMLButtonElement> { return (e) => { e.preventDefault(); /* @ts-ignore */ fn(); } }
