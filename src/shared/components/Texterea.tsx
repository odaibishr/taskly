import type { UseFormRegister, Path, FieldError, FieldValues } from 'react-hook-form';

interface TextareaProps<T extends FieldValues> {
	register: UseFormRegister<T>;
	name: Path<T>;
	placeholder: string;
	rows?: number;
	error?: FieldError;
	label?: string;
	optional?: boolean;
	maxLength?: number; // الحد الأقصى للأحرف
	value?: string;     // القيمة الحالية (يتم تمريرها باستخدام watch من الأب)
}

export default function Textarea<T extends FieldValues>({
	register,
	name,
	placeholder,
	rows = 4,
	error,
	label,
	optional,
	maxLength,
	value = ""
}: TextareaProps<T>) {
	const currentLength = value?.length || 0;

	return (
		<div className='flex flex-col gap-y-2 mb-4'>
			<div className='flex justify-between items-center'>
				{label && (
					<label
						className='text-[11px] uppercase font-bold text-slate-medium leading-4'
						htmlFor={name}
					>
						{label}
					</label>
				)}
				{optional && (
					<span className='text-[11px] text-slate-medium italic opacity-60 font-medium'>Optional</span>
				)}
			</div>

			<textarea
				{...register(name)}
				id={name}
				placeholder={placeholder}
				rows={rows}
				maxLength={maxLength}
				className={`w-full rounded-sm mt-1 py-3.5 px-4 bg-surface-highest focus:outline-none focus:ring-1 focus:ring-primary transition-colors resize-none ${error ? 'border-red-500' : 'border-transparent'
					} border`}
			/>

			<div className='flex justify-between items-start min-h-[20px]'>
				{error ? (
					<span className='text-[11px] text-red-500 font-medium leading-4'>
						{error.message}
					</span>
				) : (
					<div />
				)}

				{maxLength && (
					<span className={`text-[11px] font-medium opacity-70 ${currentLength >= maxLength ? 'text-red-500' : 'text-slate-medium'}`}>
						{currentLength} / {maxLength} characters
					</span>
				)}
			</div>
		</div>
	);
}
