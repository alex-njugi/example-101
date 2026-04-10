import { clsx } from 'clsx';
export function Badge({ children, className }: any) {
return <span className={clsx('badge', className)}>{children}</span>;
}