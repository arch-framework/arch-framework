import {COLOR_ESCAPE_CODE} from '../constants';

export function bold(str: string): string {
    const {BRIGHT, RESET} = COLOR_ESCAPE_CODE;

    return `${BRIGHT}${str}${RESET}`;
}

export function green(str: string): string {
    const {GREEN, RESET} = COLOR_ESCAPE_CODE;

    return `${GREEN}${str}${RESET}`;
}

export function yellow(str: string): string {
    const {YELLOW, RESET} = COLOR_ESCAPE_CODE;

    return `${YELLOW}${str}${RESET}`;
}

export function blue(str: string): string {
    const {BLUE, RESET} = COLOR_ESCAPE_CODE;

    return `${BLUE}${str}${RESET}`;
}
