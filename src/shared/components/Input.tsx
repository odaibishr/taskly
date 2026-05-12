import type { UseFormRegister, Path, FieldError, FieldValues } from 'react-hook-form';

interface InputProps<T extends FieldValues> {
    register: UseFormRegister<T>;
    name: Path<T>;
    placeholder: string;
    type?: string;
    error?: FieldError;
    label?: string;
}

export default function Input<T extends FieldValues>({ register, name, placeholder, type = "text", error, label }: InputProps<T>) {
    return (
        <div className='flex flex-col gap-y-2 mb-4'>
            {label && <label
                className='text-[11px] uppercase font-bold text-slate-medium leading-4'
                htmlFor={name}>{label}</label>}
            <input
                {...register(name)}
                placeholder={placeholder}
                type={type}
                className={`w-full h-12 rounded-sm mt-1 py-3.5 px-4 bg-surface-highest focus:outline-none focus:ring-1 focus:ring-primary transition-colors ${error ? 'border-red-500' : 'border-transparent'} border`}
            />
            {error && <span className='text-[11px] mt-0.5 mb-3 text-red-500'>{error.message}</span>}
        </div>
    )
}
