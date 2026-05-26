import { ChevronDown } from 'lucide-react';
import type { UseFormRegister, Path, FieldError, FieldValues } from 'react-hook-form';

interface SelectProps<T extends FieldValues> {
	register: UseFormRegister<T>;
	name: Path<T>;
	options: { value: string; label: string }[];
	placeholder?: string;
	error?: FieldError;
	label?: string;
	optional?: boolean;
}

export default function Select<T extends FieldValues>({
	register,
	name,
	options,
	placeholder = "Select an option",
	error,
	label,
	optional
}: SelectProps<T>) {
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

			<div className="relative mt-1">
				<select
					{...register(name)}
					id={name}
					className={`w-full h-12 rounded-sm py-3 px-4 bg-surface-highest focus:outline-none focus:ring-1 focus:ring-primary transition-colors appearance-none cursor-pointer ${
						error ? 'border-red-500' : 'border-transparent'
					} border`}
				>
					<option value="">{placeholder}</option>
					{options.map((opt) => (
						<option key={opt.value} value={opt.value}>
							{opt.label}
						</option>
					))}
				</select>
				<div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-slate-medium">
					<ChevronDown size={18} />
				</div>
			</div>

			{error && <span className='text-[11px] mt-0.5 mb-3 text-red-500'>{error.message}</span>}
		</div>
	);
}
