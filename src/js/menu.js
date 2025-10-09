import { initMenu } from './utils/init.js';

export async function menu() {
  const products = await initMenu();

  console.log(products);
}
