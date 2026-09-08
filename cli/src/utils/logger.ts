export function info(message: string) {
  console.log(`ℹ ${message}`);
}

export function success(message: string) {
  console.log(`✔ ${message}`);
}

export function error(message: string) {
  console.error(`✖ ${message}`);
}

export function step(message: string) {
  console.log(`\n${message}...`);
}

export function blank() {
  console.log('');
}

export function divider() {
  console.log(
    '\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n',
  );
}