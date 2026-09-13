import { blue, bold, cyan, dim, green, red, yellow } from './colors.js';

export function info(message: string) {
  console.log(`${cyan('ℹ')} ${message}`);
}

export function success(message: string) {
  console.log(`${green('✔')} ${message}`);
}

export function warn(message: string) {
  console.log(`${yellow('⚠')} ${message}`);
}

export function error(message: string) {
  console.error(`${red('✖')} ${message}`);
}

export function heading(message: string) {
  console.log(`\n${bold(message)}`);
}

// Prints a step line, optionally prefixed with a [current/total] counter.
export function step(message: string, current?: number, total?: number) {
  const counter =
    current !== undefined && total !== undefined
      ? `${dim(`[${current}/${total}]`)} `
      : '';

  console.log(`\n${counter}${blue(message)}...`);
}

export function blank() {
  console.log('');
}

export function divider() {
  console.log(dim('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n'));
}