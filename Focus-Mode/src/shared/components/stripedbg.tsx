import type { ComponentPropsWithoutRef, ReactNode } from 'react';


interface StripedBgProps extends Omit<ComponentPropsWithoutRef<'div'>, 'style'> {
    children?: ReactNode
    color?: string
    transparency?: string
}

export function StripedBg({children, color, transparency, ...rest}: StripedBgProps) {
    return (
        <div {...rest} style={{
            border: 'none',
            backgroundImage: `
                repeating-linear-gradient(
                -45deg, 
             color-mix(in srgb, var(${color}), transparent ${transparency}%) 0px, 
            color-mix(in srgb, var(${color}), transparent ${transparency}%) 6px, 
                transparent 6px, 
                transparent 12px)
            `
        }}>
            {children}
        </div>
    )
}

