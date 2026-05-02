
type headerSectionProps = {
    title: string;
    description: string;
}

export default function HeaderSection({ title, description }: headerSectionProps) {
    return (
        <div className='flex flex-col gap-2 items-center justify-center mb-10 text-left md:text-center'>
            <h2 className='text-2xl font-semibold'>
                {title}
            </h2>
            <p className='text-sm text-slate-medium'>
                {description}
            </p>
        </div>
    )
}