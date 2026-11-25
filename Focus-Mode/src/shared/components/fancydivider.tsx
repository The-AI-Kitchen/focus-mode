import type { ComponentPropsWithoutRef } from 'react';

interface DividerProps extends Omit<ComponentPropsWithoutRef<'div'>, 'style'> {
    size: number,
    color: string,
    lineWeight: string
}

export function FancyDivider({size, color, lineWeight, ...rest}: DividerProps) {
    const c : number = size / 2;
    const inner : number = size / 3
    const outer : number = (size * 2) / 3;
    const gap : number = size * 0.55;

    const pathData = [
    `M ${c} 0`,
    `C ${c} ${inner}, ${outer} ${c}, ${size} ${c}`,
    `C ${outer} ${c}, ${c} ${outer}, ${c} ${size}`,
    `C ${c} ${outer}, ${inner} ${c}, 0 ${c}`,
    `C ${inner} ${c}, ${c} ${inner}, ${c} 0`,
    `Z`
  ].join(' ');

  return (
    <div {...rest} style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: `${gap}px`,
    }}>
        <span style={{
            flex: "1",
            height: lineWeight,
            background: color,
            clipPath: "polygon(0 50%, 50% 0, 100% 50%, 50% 100%)",
        }}></span>
            <svg fill = {color} style={{
                width: `${size}px`,
                height: `${size}px`,
                flexShrink: "0"
            }} 
            viewBox={`0 0 ${size} ${size}`}>
                <path d={pathData}/>
            </svg>
        <span style={{
        flex: "1",
        height: lineWeight,
        background: color,
        clipPath: "polygon(0 50%, 50% 0, 100% 50%, 50% 100%)",
        }}>
        </span>
    </div>)

}

