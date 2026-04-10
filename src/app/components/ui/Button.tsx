import { clsx } from 'clsx';
export function Button({ children, className, ...rest }: any) {
return (
<button
className={clsx('px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors', className)}
{...rest}
>{children}</button>
);
}