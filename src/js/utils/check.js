export function activeCategory(config) {
  const activeCategory = sessionStorage.getItem('category');
  const defaultCategory = activeCategory || 'coffee';
  Object.keys(config).forEach(category => {
    config[category].active = category === defaultCategory;
  });
  return defaultCategory;
}
